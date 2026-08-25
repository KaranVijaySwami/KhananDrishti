import express from "express";
import rateLimit from "express-rate-limit";
import { login, register, logout, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per `window` (here, per 15 minutes)
  message: "Too many login attempts from this IP, please try again after 15 minutes",
});

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;