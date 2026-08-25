import express from "express";
import {
  createInspection,
  getInspections,
  getMyMineInspections,
  getInspectionById,
} from "../controllers/inspectionController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Require authentication for all routes
router.use(protect);

// Safety Officer specific routes
router.post("/", authorize("safety_officer"), createInspection);
router.get("/mine", authorize("safety_officer"), getMyMineInspections);

// Admin / Mine Official routes for viewing all
router.get("/", authorize("mine_official", "CIL_HQ", "safety_officer"), getInspections);

// Get single inspection
router.get("/:id", getInspectionById);

export default router;
