import express from "express";
import pool from "../modules/db.js";

const router = express.Router();

// Create a new transaction and update loyalty points
router.post("/transactions", async (req, res) => {
  const {
    userId,
    receiverName,
    address,
    expedition,
    expeditionCost,
    paymentMethod,
    paymentTax,
    platformTax,
    discount,
    totalAmount,
    loyaltyPoints,
    tag,
    productIds, // Add productIds to the request body
  } = req.body;

  if (
    !userId ||
    !receiverName ||
    !address ||
    !expedition ||
    !expeditionCost ||
    !paymentMethod ||
    !paymentTax ||
    !platformTax ||
    !totalAmount ||
    !loyaltyPoints ||
    !productIds // Ensure productIds is provided
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const connection = await pool.getConnection();
  try {
    // Start a transaction
    await connection.beginTransaction();

    // Insert the transaction into the database
    const query = `
      INSERT INTO transactions (
        user_id, receiver_name, address, expedition, expedition_cost,
        payment_method, payment_tax, platform_tax, discount, total_amount,
        loyalty_points, tag, product_ids
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      userId,
      receiverName,
      address,
      expedition,
      expeditionCost,
      paymentMethod,
      paymentTax,
      platformTax,
      discount || 0,
      totalAmount,
      loyaltyPoints,
      tag || "Personal",
      JSON.stringify(productIds), // Convert productIds to JSON format
    ];

    await connection.query(query, values);

    // Update the user's loyalty points
    const updatePointsQuery = `
      UPDATE users
      SET loyalty_points = loyalty_points + ?
      WHERE id = ?
    `;
    await connection.query(updatePointsQuery, [loyaltyPoints, userId]);

    // Delete the user's cart
    const deleteCartQuery = `
      DELETE FROM carts
      WHERE user_id = ?
    `;
    await connection.query(deleteCartQuery, [userId]);

    // Commit the transaction
    await connection.commit();

    res.status(201).json({ message: "Transaction completed successfully." });
  } catch (error) {
    console.error("Error completing transaction:", error);
    await connection.rollback();
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Fetch transaction history for a user
router.get("/transactions/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        t.id AS transaction_id,
        t.receiver_name,
        t.address,
        t.expedition,
        t.expedition_cost,
        t.payment_method,
        t.payment_tax,
        t.platform_tax,
        t.discount,
        t.total_amount,
        t.loyalty_points,
        t.tag,
        t.created_at,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', p.id,
              'name', p.name,
              'price', p.price
            )
          )
          FROM products p
          WHERE JSON_CONTAINS(t.product_ids, JSON_QUOTE(p.id))
        ) AS products
      FROM transactions t
      WHERE t.user_id = ?
      ORDER BY t.created_at DESC
    `;
    const [transactions] = await connection.query(query, [userId]);

    res.status(200).json(transactions || []);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

export default router;
