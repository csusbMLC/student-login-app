/**
 * @file This file contains the main server code for the student login app.
 */

import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import { config } from "dotenv";
import authRouter from "./Routes/AuthRoute.js";
import apiRouter from "./Routes/apiRoute.js";

config();

const PORT = process.env.PORT || 5000;

// Initialize express app
const app = express();

// Middleware
app.use(json());
app.use(cors());

/**
 * Connects to the MongoDB database.
 * @returns {Promise<void>} A promise that resolves when the connection is successful.
 */
const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Default homepage for testing server status
app.get("/", async (req, res) => {
  res.status(200).json({ message: "Welcome to the student login API" });
});

// API routes for the app
app.use("/api", apiRouter);

// Auth routes for admin panel access
app.use("/auth", authRouter);

// Once the database is connected, the server starts listening on the specified port for incoming requests.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
