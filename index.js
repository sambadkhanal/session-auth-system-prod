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
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Adjust it to your frontend URL
    credentials: true, // Tells the browser: "It is okay to receive sensitive data (like cookies) during this cross-origin request." and now in frontend side you have to include {credentials: "include"} inside fetch
  }),
);

// Here you are specifying the session_id which will be sent from server and browser will store it as cookie and sends it in future requests so that server can identify the session object or document from session_store in mongo
app.use(
  session({
    name: "session_id", // Name of the cookie that will be shown in browser and its value will be used to identify user's session object or document inside the MongoStore collection named "session_store"
    cookie: {
      maxAge: 1000 * 60 * 60, // After 60 minutes above cookie will be deleted from the browser automatically and browser will stop sending this cookie to the server
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      //   https://app.example.com //frontend
      //   https://api.example.com //api
      //   If in same domain/site like above example ie example.com then use same:Site: "lax"
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "session_store",
      ttl: 60 * 60, // session expires after 60 minutes and expired sessions will eventually(may take some time) be deleted from MongoDB automatically
    }),
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
