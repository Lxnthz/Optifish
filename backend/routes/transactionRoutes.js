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
        t.product_ids
      FROM transactions t
      WHERE t.user_id = ?
      ORDER BY t.created_at DESC;
    `;
    const transactions = await connection.query(query, [userId]);
    console.log("Raw transactions:", transactions);

    // Fetch products for each transaction
    const transactionsWithProducts = await Promise.all(
      transactions.map(async (transaction) => {
        let productIds = [];

        // Check if product_ids is a string or already an array
        if (typeof transaction.product_ids === "string") {
          try {
            productIds = JSON.parse(transaction.product_ids);
          } catch (error) {
            console.error("Error parsing product_ids:", error);
            productIds = [];
          }
        } else if (Array.isArray(transaction.product_ids)) {
          productIds = transaction.product_ids;
        }

        if (productIds.length > 0) {
          // Create placeholders for the IN clause
          const placeholders = productIds.map(() => "?").join(",");
          const productQuery = `
            SELECT id, name, price
            FROM products
            WHERE id IN (${placeholders})
          `;

          const products = await connection.query(productQuery, productIds);

          return {
            id: transaction.transaction_id,
            receiver_name: transaction.receiver_name,
            address: transaction.address,
            expedition: transaction.expedition,
            expedition_cost: transaction.expedition_cost,
            payment_method: transaction.payment_method,
            payment_tax: transaction.payment_tax,
            platform_tax: transaction.platform_tax,
            discount: transaction.discount,
            total_amount: transaction.total_amount,
            loyalty_points: transaction.loyalty_points,
            tag: transaction.tag,
            created_at: transaction.created_at,
            products: products || [],
          };
        } else {
          return {
            id: transaction.transaction_id,
            receiver_name: transaction.receiver_name,
            address: transaction.address,
            expedition: transaction.expedition,
            expedition_cost: transaction.expedition_cost,
            payment_method: transaction.payment_method,
            payment_tax: transaction.payment_tax,
            platform_tax: transaction.platform_tax,
            discount: transaction.discount,
            total_amount: transaction.total_amount,
            loyalty_points: transaction.loyalty_points,
            tag: transaction.tag,
            created_at: transaction.created_at,
            products: [],
          };
        }
      })
    );

    console.log("Transactions with products:", transactionsWithProducts);
    res.status(200).json(transactionsWithProducts || []);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Fetch recent purchases for a user from the transactions table
router.get("/users/:userId/recent-purchases", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  const connection = await pool.getConnection();
  try {
    // Fetch the latest transactions for the user
    const query = `
      SELECT 
        t.product_ids, 
        t.created_at
      FROM transactions t
      WHERE t.user_id = ?
      ORDER BY t.created_at DESC
      LIMIT 10
    `;
    const transactions = await connection.query(query, [userId]);

    if (!transactions.length) {
      return res.status(200).json([]); // No transactions found
    }

    // Extract product IDs from transactions
    const productIds = [];
    transactions.forEach((transaction) => {
      if (transaction.product_ids) {
        try {
          // Handle raw arrays or JSON strings
          const parsedIds =
            typeof transaction.product_ids === "string"
              ? JSON.parse(transaction.product_ids)
              : transaction.product_ids;

          if (Array.isArray(parsedIds)) {
            productIds.push(...parsedIds);
          } else {
            console.error(
              "Invalid product_ids format:",
              transaction.product_ids
            );
          }
        } catch (error) {
          console.error(
            "Error parsing product_ids:",
            transaction.product_ids,
            error
          );
        }
      }
    });

    if (!productIds.length) {
      return res.status(200).json([]); // No products found
    }

    // Fetch product details for the extracted product IDs
    const placeholders = productIds.map(() => "?").join(",");
    const productQuery = `
      SELECT 
        p.id, 
        p.name, 
        p.price, 
        p.photo, 
        p.rating
      FROM products p
      WHERE p.id IN (${placeholders})
    `;
    const products = await connection.query(productQuery, productIds);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching recent purchases:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

router.post("/reviews", async (req, res) => {
  const { userId, productId, reviewerId, reviewerName, stars, message } = req.body;

  if (!userId || !productId || !reviewerId || !reviewerName || !stars) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (stars < 1 || stars > 5) {
    return res.status(400).json({ error: "Stars must be between 1 and 5." });
  }

  const connection = await pool.getConnection();
  try {
    const query = `
      INSERT INTO reviews (user_id, product_id, reviewer_id, reviewer_name, stars, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await connection.query(query, [userId, productId, reviewerId, reviewerName, stars, message]);

    res.status(201).json({ message: "Review added successfully." });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

router.get("/reviews/:productId", async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required." });
  }

  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT r.stars, r.message, r.reviewer_name, r.created_at
      FROM reviews r
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `;
    const reviews = await connection.query(query, [productId]);

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

export default router;
