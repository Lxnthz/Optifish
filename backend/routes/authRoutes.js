import express from "express";
import bcrypt from "bcrypt";
import pool from "../modules/db.js";

const router = express.Router();

// Registration Endpoint
router.post("/register", async (req, res) => {
  const { email, password, full_name, phone } = req.body;

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

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the user into the `users` table
    const result = await connection.query(
      "INSERT INTO users (email, password_hash, full_name, phone, role, is_active, created_at) VALUES (?, ?, ?, ?, 'customer', TRUE, NOW())",
      [email, hashedPassword, full_name, phone]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
});

// Login Endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Check if the user exists
    const [user] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Exclude the password hash from the response
    const { password_hash, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
});

// Admin Login Endpoint
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Check if the admin exists
    const [admin] = await connection.query(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Exclude the password hash from the response
    const { password_hash, ...adminWithoutPassword } = admin;

    res.status(200).json(adminWithoutPassword);
  } catch (error) {
    console.error("Error logging in admin:", error);
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

// Role Upgrade Request Endpoint
router.post("/role-upgrade-request", async (req, res) => {
  const { userId, requestedRole } = req.body;

  if (!userId || !requestedRole) {
    return res
      .status(400)
      .json({ error: "User ID and requested role are required" });
  }

  if (!["seller", "consultant"].includes(requestedRole)) {
    return res.status(400).json({ error: "Invalid role requested" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Check if a pending request already exists
    const [existingRequest] = await connection.query(
      "SELECT * FROM role_upgrade_requests WHERE user_id = ? AND status = 'pending'",
      [userId]
    );
    if (existingRequest) {
      return res
        .status(400)
        .json({ error: "A pending request already exists" });
    }

    // Insert the new role upgrade request
    await connection.query(
      "INSERT INTO role_upgrade_requests (user_id, requested_role) VALUES (?, ?)",
      [userId, requestedRole]
    );

    res
      .status(201)
      .json({ message: "Role upgrade request submitted successfully" });
  } catch (error) {
    console.error("Error submitting role upgrade request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
});

// Role Upgrade Approval Endpoint
router.post("/role-upgrade-approval", async (req, res) => {
  const { requestId, status } = req.body;

  if (!requestId || !["approved", "rejected"].includes(status)) {
    return res
      .status(400)
      .json({ error: "Request ID and valid status are required" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Get the role upgrade request
    const [request] = await connection.query(
      "SELECT * FROM role_upgrade_requests WHERE id = ?",
      [requestId]
    );
    if (!request) {
      return res.status(404).json({ error: "Role upgrade request not found" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ error: "Request has already been processed" });
    }

    // Update the request status
    await connection.query(
      "UPDATE role_upgrade_requests SET status = ? WHERE id = ?",
      [status, requestId]
    );

    // If approved, insert data into the respective table
    if (status === "approved") {
      const { user_id, requested_role } = request;

      if (requested_role === "seller") {
        await connection.query(
          "INSERT INTO sellers (user_id, store_name, store_slug) VALUES (?, ?, ?)",
          [user_id, "Default Store Name", `store-${user_id}`]
        );
      } else if (requested_role === "consultant") {
        await connection.query(
          "INSERT INTO consultants (user_id, bio, expertise_area) VALUES (?, ?, ?)",
          [user_id, "Default Bio", "General Expertise"]
        );
      }

      // Update the user's role in the `users` table
      const newRole = requested_role === "seller" ? "seller" : "consultant";
      await connection.query("UPDATE users SET role = ? WHERE id = ?", [
        newRole,
        user_id,
      ]);
    }

    res.status(200).json({ message: `Role upgrade request ${status}` });
  } catch (error) {
    console.error("Error processing role upgrade request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
});

// // Register Super Admin Endpoint
// router.post("/register-superadmin", async (req, res) => {
//   const email = "superadmin@optifish.com";
//   const password = "opti";
//   const fullName = "Optifish Super Admin";

//   let connection;
//   try {
//     connection = await pool.getConnection();

//     // Check if the super admin already exists
//     const [existingAdmin] = await connection.query(
//       "SELECT * FROM admins WHERE email = ?",
//       [email]
//     );
//     if (existingAdmin) {
//       return res.status(400).json({ error: "Super Admin already exists." });
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Insert the super admin into the `admins` table
//     await connection.query(
//       "INSERT INTO admins (email, password_hash, full_name, role, created_at) VALUES (?, ?, ?, 'super_admin', NOW())",
//       [email, hashedPassword, fullName]
//     );

//     res.status(201).json({ message: "Super Admin registered successfully!" });
//   } catch (error) {
//     console.error("Error registering super admin:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   } finally {
//     if (connection) connection.release();
//   }
// });

export default router;
