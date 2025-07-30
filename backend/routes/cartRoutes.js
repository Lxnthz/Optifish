import express from "express";
import pool from "../modules/db.js";

const router = express.Router();

// Add item to cart
router.post("/cart", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const connection = await pool.getConnection();
  try {
    // Check if the user already has a cart
    console.log("Checking cart for userId:", userId);
    console.log("Received userId from frontend:", userId);
    let [cart] = await connection.query(
      "SELECT * FROM carts WHERE user_id = ?",
      [userId]
    );

    if (!cart || cart.length === 0) {
      console.log("No cart found for userId. Creating a new cart.");
      // Create a new cart if none exists
      const result = await connection.query(
        "INSERT INTO carts (user_id) VALUES (?)",
        [userId]
      );
      cart = { cart_id: result.insertId };
    } else {
      console.log("Cart found:", cart);
    }

    // Add item to cart or update quantity if it already exists
    await connection.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
      [cart.cart_id, productId, quantity, quantity]
    );

    res.status(200).json({ message: "Item added to cart" });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Get cart items by userId
router.get("/cart/:userId", async (req, res) => {
  const { userId } = req.params;

  const connection = await pool.getConnection();
  try {
    // Fetch the cart associated with the userId
    const [cart] = await connection.query(
      "SELECT * FROM carts WHERE user_id = ?",
      [userId]
    );

    if (!cart) {
      return res.status(404).json({ error: "Cart not found for this user." });
    }

    // Fetch the items in the cart
    const items = await connection.query(
      `SELECT ci.item_id, ci.quantity, p.id AS product_id, p.name, p.price, p.photo
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cart.cart_id]
    );

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Update cart item quantity
router.put("/cart/:itemId", async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Quantity must be greater than 0" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.query(
      "UPDATE cart_items SET quantity = ? WHERE item_id = ?",
      [quantity, itemId]
    );
    res.status(200).json({ message: "Cart item updated" });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Remove item from cart
router.delete("/cart/:itemId", async (req, res) => {
  const { itemId } = req.params;

  const connection = await pool.getConnection();
  try {
    await connection.query("DELETE FROM cart_items WHERE item_id = ?", [
      itemId,
    ]);
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

export default router;
