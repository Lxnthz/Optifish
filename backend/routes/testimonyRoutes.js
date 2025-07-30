import express from "express";
import pool from "../modules/db.js";

const router = express.Router();

// Add a testimony
router.post("/testimonies", async (req, res) => {
  const { name, job, message } = req.body;

  if (!name || !job || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const connection = await pool.getConnection();
  try {
    const query = `
      INSERT INTO testimonies (name, job, message)
      VALUES (?, ?, ?)
    `;
    await connection.query(query, [name, job, message]);

    res.status(201).json({ message: "Testimony added successfully." });
  } catch (error) {
    console.error("Error adding testimony:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Fetch testimonies
router.get("/testimonies", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT id, name, job, message, created_at
      FROM testimonies
      ORDER BY created_at DESC
    `;
    const testimonies = await connection.query(query);

    res.status(200).json(testimonies);
  } catch (error) {
    console.error("Error fetching testimonies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

export default router;
