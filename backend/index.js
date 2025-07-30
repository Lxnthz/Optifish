import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/authRoutes.js";
import fetchRoutes from "./routes/fetchRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import testimonyRoutes from "./routes/testimonyRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import groupBuyRoutes from "./routes/groupBuyRoutes.js"; 

dotenv.config();

// Custom BigInt serializer
BigInt.prototype.toJSON = function () {
  return this.toString(); // Convert BigInt to string for JSON serialization
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.disable("x-powered-by");

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true, // Allow cookies and credentials
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api", fetchRoutes); // Register fetchRoutes
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", transactionRoutes);
app.use("/api", testimonyRoutes);
app.use("/api", blogRoutes);
app.use("/api", groupBuyRoutes);
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  },
  express.static("uploads")
);

app.use((req, res, next) => {
  console.log(`Unhandled request: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
