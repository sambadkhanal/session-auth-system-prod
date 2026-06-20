import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

// ...
import dotenv from "dotenv";
dotenv.config();
const app = express();

// ---------- Middlewares ----------
// app.set("trust proxy", 1); // It tells express i am running behind a proxy (like Nginx, Render, Railway, Cloudflare) and i should trust the first proxy infront of me.

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500", // Live Server
      "http://localhost:5173", // Vite React App
    ],
    credentials: true, // Tells the browser: "It is okay to receive sensitive data (like cookies) during this cross-origin request." and now in frontend side you have to include {credentials: "include"} inside fetch
  }),
);

// Creates req.sessionID and req.session object immediately and thats it
app.use(
  session({
    name: "session_id", // Name of the cookie that will be stored in browser and its value will be used to identify user's session object stored inside the MongoStore collection named "session_store"
    cookie: {
      maxAge: 1000 * 60 * 60, // After 60 minutes above cookie will be deleted from the browser automatically and the browser will stop sending this cookie to the server
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // sameSite: none works only with secure: true for cross site cookie sharing
      //   https://app.example.com  //frontend
      //   https://api.example.com //api
      //   If in same domain/site like above example ie example.com then use sameSite: "lax"
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    // rolling: true, // You have 60 minutes of inactivity allowed — every request resets the countdown

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "session_store",
      ttl: 60 * 60, // After 60 mins session document will be physically DELETED from MongoStore although its not instant or immediate but it will be eventually deleted
    }),
  }),
);

// ---------- Routes ----------
// Auth
app.use("/api/auth", authRoutes);

// Database and Server
const PORT = process.env.PORT || 8080;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Mongodb connected");
    app.listen(PORT, () => {
      console.log(`Server is listening to the port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to mongodb: ", err);
    process.exit(1); // Exit the process with failure
  });
