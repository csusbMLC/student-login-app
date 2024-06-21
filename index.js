import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import { config } from "dotenv";
import * as url from "url";
import authRouter from "./Routes/AuthRoute.js";
import apiRouter from "./Routes/apiRoute.js";
import cookieParser from "cookie-parser";

config();

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const app = express();

app.use(cookieParser());
app.use(json());
app.use(cors());
app.use(express.static(__dirname + "/buildAdmin"));

//await connect to database
const connectDB = async () => {
  try {
    // console.log(process.env);
    const conn = await connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

//default homepage
app.get("/", async (req, res) => {
  res.status(200).json({ message: "Welcome to the student login API" });
});

app.use("/api", apiRouter);

app.use("/auth", authRouter);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
