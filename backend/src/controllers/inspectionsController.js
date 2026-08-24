
import { InspectionRecord } from "../models/InspectionRecord.js";
import crypto from "crypto";

// GET /api/inspections
export const getInspections = async (req, res) => {
  try {
    const { mineId, subsidiary } = req.query;
    const filter = {};
    if (mineId) filter.mineId = mineId;
    if (subsidiary) filter.subsidiary = subsidiary;
    const inspections = await InspectionRecord.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: inspections, count: inspections.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/inspections/:id
export const getInspectionById = async (req, res) => {
  try {
    const insp = await InspectionRecord.findOne({ id: req.params.id });
    if (!insp) return res.status(404).json({ error: "Inspection not found" });
    res.json({ success: true, data: insp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/inspections
export const createInspection = async (req, res) => {
  try {
    const hash = crypto.
    createHash("sha256").
    update(JSON.stringify(req.body) + Date.now()).
    digest("hex");

    const inspection = new InspectionRecord({
      ...req.body,
      id: `INSP-${Date.now().toString().slice(-8)}`,
      digitalSignatureHash: hash,
      tamperProofHash: `sha256-${hash.slice(0, 20)}`,
      syncStatus: "Synced"
    });
    await inspection.save();
    res.status(201).json({ success: true, data: inspection });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};