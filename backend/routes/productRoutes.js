import express from "express";
import multer from "multer";
import path from "path";
import pool from "../modules/db.js";
import fs from "fs";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/product-photos";
    // Ensure the directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });

// Route to handle adding a new product
router.post("/products", upload.single("photo"), async (req, res) => {
  const { name, category, price, description, quantity, user_id } = req.body;
  const photo = req.file
    ? `/uploads/product-photos/${req.file.filename}`
    : null;

  if (!name || !category || !price || !description || !quantity || !user_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const query = `
      INSERT INTO products (name, category, price, description, quantity, photo, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await connection.query(query, [
      name,
      category,
      price,
      description,
      quantity,
      photo,
      user_id,
    ]);

    const newProduct = {
      id: result.insertId,
      name,
      category,
      price,
      description,
      quantity,
      photo,
      user_id,
    };

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
});

// Route to handle fetching products for a user
router.get("/products", async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const query = `
      SELECT * FROM products WHERE user_id = ?
    `;
    const products = await connection.query(query, [user_id]);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
});

router.put("/products/:id", upload.single("photo"), async (req, res) => {
  const { id } = req.params;
  const { name, category, price, description, quantity } = req.body;
  const newPhoto = req.file
    ? `/uploads/product-photos/${req.file.filename}`
    : null;

  if (!name || !category || !price || !description || !quantity) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Fetch the existing product to get the current photo path
    const [existingProduct] = await connection.query(
      `SELECT photo FROM products WHERE id = ?`,
      [id]
    );

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const oldPhoto = existingProduct.photo;

    // Update the product in the database
    const query = `
      UPDATE products
      SET 
        name = ?, 
        category = ?, 
        price = ?, 
        description = ?, 
        quantity = ?, 
        photo = COALESCE(?, photo) -- Preserve existing photo if no new photo is uploaded
      WHERE id = ?
    `;
    await connection.query(query, [
      name,
      category,
      price,
      description,
      quantity,
      newPhoto,
      id,
    ]);

    // Delete the old photo if a new photo is uploaded
    if (newPhoto && oldPhoto) {
      const oldPhotoPath = `.${oldPhoto}`; // Add `.` to make it relative to the project root
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
});

router.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  let connection;
  try {
    connection = await pool.getConnection();

    // Fetch the product to get the photo path
    const [product] = await connection.query(
      `SELECT photo FROM products WHERE id = ?`,
      [id]
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const photoPath = product.photo;

    // Delete the product from the database
    const query = `DELETE FROM products WHERE id = ?`;
    await connection.query(query, [id]);

    // Delete the photo file from the uploads directory
    if (photoPath) {
      const fullPhotoPath = `.${photoPath}`; // Add `.` to make it relative to the project root
      if (fs.existsSync(fullPhotoPath)) {
        fs.unlinkSync(fullPhotoPath);
      }
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
});

router.put("/products/:id/rating", async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  if (rating < 0 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 0 and 5" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const query = `UPDATE products SET rating = ? WHERE id = ?`;
    await connection.query(query, [rating, id]);

    res.status(200).json({ message: "Product rating updated successfully" });
  } catch (error) {
    console.error("Error updating product rating:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
});

router.put("/products/:id/sold", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ error: "Quantity must be greater than 0" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const query = `UPDATE products SET sold = sold + ? WHERE id = ?`;
    await connection.query(query, [quantity, id]);

    res
      .status(200)
      .json({ message: "Product sold count updated successfully" });
  } catch (error) {
    console.error("Error updating product sold count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
});

// Fetch all products with owner name
router.get("/products/all", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.category, 
        p.price, 
        p.photo, 
        p.rating,
        p.description,
        p.quantity,
        p.sold, 
        u.full_name AS owner_name
      FROM products p
      JOIN users u ON p.user_id = u.id
    `;
    const products = await connection.query(query);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

export default router;
