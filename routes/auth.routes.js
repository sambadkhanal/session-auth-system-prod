import express from "express";
import registerController from "../controllers/auth/register.controller.js";
import loginController from "../controllers/auth/login.controller.js";
import logoutController from "../controllers/auth/logout.controller.js";
import checkSessionController from "../controllers/auth/checkSession.controller.js";

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/logout", logoutController);

router.get("/checkSession", checkSessionController);

export default router;
