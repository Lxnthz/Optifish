import express from "express";
import pool from "../modules/db.js";

const router = express.Router();

// Fetch all users
router.get("/users", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // Execute the query to fetch all users
    const result = await connection.query(
      "SELECT id, full_name, email, role, is_consultant, is_seller, is_active, created_at FROM users"
    );

    // Return the result directly as JSON
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

router.get("/role-upgrade-requests", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const requests = await connection.query(
      "SELECT r.id, r.user_id, r.requested_role, r.status, r.created_at, u.full_name, u.email " +
        "FROM role_upgrade_requests r " +
        "JOIN users u ON r.user_id = u.id " +
        "WHERE r.status = 'pending'"
    );

    res.status(200).json(requests); // Return the requests as JSON
  } catch (error) {
    console.error("Error fetching role upgrade requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

router.get("/consultant-requests", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const requests = await connection.query(
      "SELECT r.id, r.user_id, r.requested_role, r.status, r.created_at, u.full_name, u.email " +
        "FROM role_upgrade_requests r " +
        "JOIN users u ON r.user_id = u.id " +
        "WHERE r.status = 'pending' AND r.requested_role = 'consultant'"
    );

    res.status(200).json(requests); // Return the consultant requests as JSON
  } catch (error) {
    console.error("Error fetching consultant requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

router.patch("/role-upgrade-requests/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res
      .status(400)
      .json({ error: "Invalid status. Must be 'approved' or 'rejected'." });
  }

  const connection = await pool.getConnection();
  try {
    // Check if the request exists
    const request = await connection.query(
      "SELECT * FROM role_upgrade_requests WHERE id = ?",
      [id]
    );

    if (!request || request.length === 0) {
      return res.status(404).json({ error: "Role upgrade request not found." });
    }

    const roleRequest = request[0]; // Extract the first row from the result

    if (roleRequest.status !== "pending") {
      return res
        .status(400)
        .json({ error: "Request has already been processed." });
    }

    // Update the request status
    await connection.query(
      "UPDATE role_upgrade_requests SET status = ? WHERE id = ?",
      [status, id]
    );

    // If approved, update the user's role and is_consultant/is_seller fields
    if (status === "approved") {
      const { user_id, requested_role } = roleRequest;

      // Determine which field to update based on the requested role
      if (requested_role === "consultant") {
        await connection.query(
          "UPDATE users SET role = ?, is_consultant = 1 WHERE id = ?",
          [requested_role, user_id]
        );
      } else if (requested_role === "seller") {
        await connection.query(
          "UPDATE users SET role = ?, is_seller = 1 WHERE id = ?",
          [requested_role, user_id]
        );
      }
    }

    res.status(200).json({ message: `Request ${status} successfully.` });
  } catch (error) {
    console.error("Error updating role upgrade request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Fetching user data for ID:", id); // Debug log
  let connection;

  try {
    connection = await pool.getConnection();

    // Fetch user data
    const [rows] = await connection.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);

    if (!rows.length) {
      console.log("User not found for ID:", id); // Debug log
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];
    console.log("Fetched User Data:", user); // Debug log

    res.status(200).json({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      profile_picture: user.profile_picture,
      loyalty_points: user.loyalty_points,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
});

router.get("/users/:id/loyalty-points", async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();
  try {
    const rows = await connection.query(
      "SELECT loyalty_points FROM users WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ loyalty_points: rows[0].loyalty_points });
  } catch (error) {
    console.error("Error fetching loyalty points:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

export default router;
