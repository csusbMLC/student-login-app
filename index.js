/**
 * @file Main server code for the student login app.
 */

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./Routes/AuthRoute.js";
import apiRouter from "./Routes/apiRoute.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

/**
 * Connects to the MongoDB database.
 * @returns {Promise<void>} A promise that resolves when the connection is successful.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Default homepage for testing server status
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the student login API" });
});

// API routes for the app
app.use("/api", apiRouter);

// Auth routes for admin panel access
app.use("/auth", authRouter);

// Start the server after connecting to the database
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

startServer();
