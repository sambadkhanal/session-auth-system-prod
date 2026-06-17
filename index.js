import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";

// ...
import dotenv from "dotenv";
dotenv.config();
const app = express();

// ---------- Middlewares ----------
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Adjust it to your frontend URL
    credentials: true, // Tells the browser: "It is okay to receive sensitive data (like cookies) during this cross-origin request." and now in frontend side you have to include {credentials: "include"} inside fetch
  }),
);

// ---------- Routes ----------
// Auth Route
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Mongodb connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening to the port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to mongodb: ", err);
    process.exit(1); // Exit the process with failure
  });
