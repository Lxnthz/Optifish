import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/authRoutes.js";
import fetchRoutes from "./routes/fetchRoutes.js"; // Import fetchRoutes

dotenv.config();

// Custom BigInt serializer
BigInt.prototype.toJSON = function () {
  return this.toString(); // Convert BigInt to string for JSON serialization
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.disable("x-powered-by");

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
