import express from "express";
import authRoutes from "./authRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
// We can mount other routes here as they get built out.

export default router;