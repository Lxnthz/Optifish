import express from "express";
import multer from "multer";
import path from "path";
import pool from "../modules/db.js";
import fs from "fs";
import moment from "moment"; // Import moment.js for date formatting

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath =
      file.fieldname === "image" ? "uploads/blog-photos" : "uploads/blogs-md";

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/**
 * Route: POST /blogs
 * Description: Add blog with inline markdown_data (stored in DB)
 */
router.post("/blogs", upload.single("image"), async (req, res) => {
  const { title, writer_name, markdown_data } = req.body;
  const image_url = req.file
    ? `/uploads/blog-photos/${req.file.filename}`
    : null;

  if (!title || !writer_name || !markdown_data) {
    return res
      .status(400)
      .json({ error: "Title, writer name, and blog content are required." });
  }

  const connection = await pool.getConnection();
  try {
    const query = `
      INSERT INTO blogs (title, writer_name, markdown_data, image_url, status)
      VALUES (?, ?, ?, ?, 'pending')
    `;
    await connection.query(query, [
      title,
      writer_name,
      markdown_data,
      image_url,
    ]);

    res.status(201).json({
      message: "Blog submitted successfully and is pending approval.",
    });
  } catch (error) {
    console.error("Error adding blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

/**
 * Route: POST /blogs/file
 * Description: Add blog with markdown file (stored on disk)
 */
router.post(
  "/blogs/file",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "markdown", maxCount: 1 },
  ]),
  async (req, res) => {
    const { title, writer_name, created_at } = req.body;
    const markdownFile = req.files?.markdown?.[0];
    const imageFile = req.files?.image?.[0];

    // Validate required fields
    if (!title || !writer_name || !created_at || !markdownFile || !imageFile) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Format the created_at value to match the database's DATETIME format
    const formattedCreatedAt = moment(created_at).format("YYYY-MM-DD HH:mm:ss");

    // Construct file paths
    const markdownPath = `/uploads/blogs-md/${markdownFile.filename}`;
    const imageUrl = `/uploads/blog-photos/${imageFile.filename}`;

    const connection = await pool.getConnection();
    try {
      const query = `
        INSERT INTO blogs (title, writer_name, markdown_path, created_at, image_url, status)
        VALUES (?, ?, ?, ?, ?, 'pending')
      `;
      await connection.query(query, [
        title,
        writer_name,
        markdownPath,
        formattedCreatedAt,
        imageUrl,
      ]);

      res.status(201).json({
        message: "Blog submitted successfully and is pending approval.",
      });
    } catch (error) {
      console.error("Error saving blog:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      connection.release();
    }
  }
);

/**
 * Route: GET /blogs/accepted
 * Description: Get all accepted blogs (read markdown from file)
 */
router.get("/blogs/accepted", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT id, title, writer_name, markdown_path, created_at, image_url
      FROM blogs
      WHERE status = 'accepted'
      ORDER BY created_at DESC
    `;
    const blogs = await connection.query(query);

    const blogsWithContent = blogs.map((blog) => {
      let markdownContent = null;

      if (blog.markdown_path && fs.existsSync(`.${blog.markdown_path}`)) {
        try {
          markdownContent = fs.readFileSync(`.${blog.markdown_path}`, "utf-8");
        } catch (err) {
          console.error(
            `Failed to read markdown file for blog ${blog.id}:`,
            err
          );
        }
      }

      return { ...blog, markdown_content: markdownContent };
    });

    res.status(200).json(blogsWithContent);
  } catch (error) {
    console.error("Error fetching accepted blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

router.get("/blogs/pending", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT id, title, writer_name, created_at, status
      FROM blogs
      WHERE status = 'pending'
      ORDER BY created_at DESC
    `;
    const blogs = await connection.query(query);
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching pending blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

/**
 * Route: GET /blogs/:id
 * Description: Get single blog with markdown file
 */
router.get("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT id, title, writer_name, markdown_path, created_at, image_url
      FROM blogs
      WHERE id = ? AND status = 'accepted'
    `;
    const [blog] = await connection.query(query, [id]);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }

    let markdownContent = null;

    if (blog.markdown_path && fs.existsSync(`.${blog.markdown_path}`)) {
      try {
        markdownContent = fs.readFileSync(`.${blog.markdown_path}`, "utf-8");
      } catch (err) {
        console.error(`Failed to read markdown file for blog ${blog.id}:`, err);
      }
    }

    res.status(200).json({ ...blog, markdown_content: markdownContent });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// GET pending blogs (short list view)

// Accept blog
router.post("/blogs/accept/:id", async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();
  try {
    const query = `UPDATE blogs SET status = 'accepted' WHERE id = ?`;
    const result = await connection.query(query, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Blog not found." });
    }
    res.status(200).json({ message: "Blog accepted successfully." });
  } catch (error) {
    console.error("Error accepting blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Reject blog
router.post("/blogs/reject/:id", async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();
  try {
    const query = `UPDATE blogs SET status = 'rejected' WHERE id = ?`;
    const result = await connection.query(query, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Blog not found." });
    }
    res.status(200).json({ message: "Blog rejected successfully." });
  } catch (error) {
    console.error("Error rejecting blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

export default router;
