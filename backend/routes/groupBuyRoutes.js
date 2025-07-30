import express from "express";
import pool from "../modules/db.js";

const router = express.Router();

// Start a Group Buy
router.post("/group-buys", async (req, res) => {
  const { productId, creatorId, maxUsers } = req.body;

  if (!productId || !creatorId || !maxUsers) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const connection = await pool.getConnection();
  try {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    const query = `
      INSERT INTO group_buys (product_id, creator_id, max_users, expires_at)
      VALUES (?, ?, ?, ?)
    `;
    const result = await connection.query(query, [
      productId,
      creatorId,
      maxUsers,
      expiresAt,
    ]);

    // Ensure the result is valid
    if (!result || !result.insertId) {
      throw new Error("Failed to insert group buy.");
    }

    res.status(201).json({
      message: "Group buy started successfully.",
      groupBuyId: result.insertId,
    });
  } catch (error) {
    console.error("Error starting group buy:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Join a Group Buy
router.post("/group-buys/:groupBuyId/join", async (req, res) => {
  const { groupBuyId } = req.params;
  const { userId } = req.body;

  if (!groupBuyId || !userId) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const connection = await pool.getConnection();
  try {
    // Check if the user has already joined the group buy
    const checkQuery = `
      SELECT * FROM group_buy_participants
      WHERE group_buy_id = ? AND user_id = ?
    `;
    const existingParticipant = await connection.query(checkQuery, [
      groupBuyId,
      userId,
    ]);

    if (existingParticipant.length > 0) {
      return res
        .status(400)
        .json({ error: "You have already joined this group buy." });
    }

    // Add the user to the group buy participants
    const insertQuery = `
      INSERT INTO group_buy_participants (group_buy_id, user_id)
      VALUES (?, ?)
    `;
    await connection.query(insertQuery, [groupBuyId, userId]);

    // Update the group buy's current users and discount percentage
    const updateQuery = `
      UPDATE group_buys
      SET current_users = current_users + 1,
          discount_percentage = discount_percentage + 2
      WHERE id = ? AND current_users < max_users
    `;
    await connection.query(updateQuery, [groupBuyId]);

    res.status(200).json({ message: "Successfully joined the group buy." });
  } catch (error) {
    console.error("Error joining group buy:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Fetch Active Group Buys
router.get("/group-buys/active", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT * FROM group_buys
      WHERE status = 'active' AND expires_at > NOW()
    `;
    const groupBuys = await connection.query(query);
    res.status(200).json(groupBuys);
  } catch (error) {
    console.error("Error fetching active group buys:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Complete a Group Buy
router.post("/group-buys/:groupBuyId/complete", async (req, res) => {
  const { groupBuyId } = req.params;

  if (!groupBuyId) {
    return res.status(400).json({ error: "Group Buy ID is required." });
  }

  const connection = await pool.getConnection();
  try {
    const query = `
      UPDATE group_buys
      SET status = 'completed'
      WHERE id = ?
    `;
    await connection.query(query, [groupBuyId]);

    res.status(200).json({ message: "Group buy completed successfully." });
  } catch (error) {
    console.error("Error completing group buy:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Fetch User's Group Buy Status
router.get("/group-buys/user/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        gb.id AS groupBuyId, 
        gb.product_id AS productId, 
        gb.status, 
        gb.expires_at AS expiresAt, 
        gbp.joined_at AS joinedAt, 
        p.name AS productName, 
        p.photo AS productImage,
        gb.current_users AS currentUsers,
        gb.max_users AS maxUsers,
        gb.discount_percentage AS discountPercentage
      FROM group_buys gb
      JOIN group_buy_participants gbp ON gb.id = gbp.group_buy_id
      JOIN products p ON gb.product_id = p.id
      WHERE gbp.user_id = ?
    `;
    const groupBuys = await connection.query(query, [userId]);
    res.status(200).json(groupBuys);
  } catch (error) {
    console.error("Error fetching user's group buy status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Create a new Group Buy Transaction
router.post("/group-buy/transaction", async (req, res) => {
  const {
    userId,
    groupBuyId,
    amount,
    paymentMethod,
    receiverName,
    address,
    expedition,
  } = req.body;

  if (
    !userId ||
    !groupBuyId ||
    !amount ||
    !paymentMethod ||
    !receiverName ||
    !address ||
    !expedition
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const connection = await pool.getConnection();
  try {
    // Start a transaction
    await connection.beginTransaction();

    // Insert the transaction into the `group_buy_transactions` table
    const transactionQuery = `
      INSERT INTO group_buy_transactions (user_id, group_buy_id, amount, payment_method, receiver_name, address, expedition, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `;
    const transactionResult = await connection.query(transactionQuery, [
      userId,
      groupBuyId,
      amount,
      paymentMethod,
      receiverName,
      address,
      expedition,
    ]);

    // Add the user as a participant in the group buy
    const participantQuery = `
      INSERT INTO group_buy_participants (group_buy_id, user_id, payment_status)
      VALUES (?, ?, 'completed')
      ON DUPLICATE KEY UPDATE payment_status = 'completed'
    `;
    await connection.query(participantQuery, [groupBuyId, userId]);

    // Commit the transaction
    await connection.commit();

    res.status(201).json({
      message: "Group buy transaction created successfully.",
      transactionId: transactionResult.insertId,
    });
  } catch (error) {
    console.error("Error creating group buy transaction:", error);
    await connection.rollback();
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Fetch Product ID by Group Buy ID
router.get("/group-buys/:groupBuyId/product", async (req, res) => {
  const { groupBuyId } = req.params;

  if (!groupBuyId) {
    console.error("Group Buy ID is missing in the request.");
    return res.status(400).json({ error: "Group Buy ID is required." });
  }

  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        gb.product_id AS productId,
        p.name AS productName,
        p.price AS productPrice,
        p.description AS productDescription,
        p.photo AS productPhoto
      FROM group_buys gb
      JOIN products p ON gb.product_id = p.id
      WHERE gb.id = ?
    `;
    const result = await connection.query(query, [groupBuyId]);

    if (!result) {
      console.error("Group Buy not found for ID:", groupBuyId);
      return res.status(404).json({ error: "Group Buy not found." });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

export default router;
