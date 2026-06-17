import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";

// ...
import dotenv from "dotenv";
dotenv.config();
const app = express();

// ---------- Middlewares ----------
app.use(express.json());

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
  });
