import express from "express";
import bcrypt from "bcrypt";
import pool from "../modules/db.js";

const router = express.Router();

// Registration Endpoint
router.post("/register", async (req, res) => {
  const { email, password, full_name, role } = req.body;

  if (!email || !password || !full_name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Check if the email already exists
    const [existingUser] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the user (exclude the phone column)
    const result = await connection.query(
      "INSERT INTO users (email, password_hash, full_name, role, is_active, created_at) VALUES (?, ?, ?, ?, TRUE, NOW())",
      [email, hashedPassword, full_name, role || "customer"]
    );

    const userId = result.insertId;

    res.status(201).json({
      message: "User registered successfully",
      userId: userId.toString(), // Ensure no BigInt issues
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// Login Endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let connection;
  try {
    connection = await pool.getConnection();

    const [user] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      ...userWithoutPassword,
      id: userWithoutPassword.id.toString(), // Ensure no BigInt issues
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
});

// Upgrade Role Endpoint
router.post("/upgradeRole", async (req, res) => {
  const { userId, newRole } = req.body;

  if (!userId || !newRole) {
    return res.status(400).json({ error: "User ID and new role are required" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Update the user's role
    await connection.query("UPDATE users SET role = ? WHERE id = ?", [
      newRole,
      userId,
    ]);

    res.status(200).json({ message: `User role updated to ${newRole}` });
  } catch (error) {
    console.error("Error upgrading role:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
