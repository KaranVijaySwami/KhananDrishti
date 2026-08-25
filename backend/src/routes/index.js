import express from "express";
import authRoutes from "./authRoutes.js";
import inspectionRoutes from "./inspectionRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/inspections", inspectionRoutes);

export default router;