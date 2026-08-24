
import { StatutoryViolation } from "../models/StatutoryViolation.js";

// GET /api/violations
export const getViolations = async (req, res) => {
  try {
    const { mineId, subsidiary, status, severity } = req.query;
    const filter = {};
    if (mineId) filter.mineId = mineId;
    if (subsidiary) filter.subsidiary = subsidiary;
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    const violations = await StatutoryViolation.find(filter).sort({ dateIssued: -1 });
    res.json({ success: true, data: violations, count: violations.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/violations/:id
export const getViolationById = async (req, res) => {
  try {
    const v = await StatutoryViolation.findOne({ id: req.params.id });
    if (!v) return res.status(404).json({ error: "Violation not found" });
    res.json({ success: true, data: v });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/violations
export const createViolation = async (req, res) => {
  try {
    const violation = new StatutoryViolation({ ...req.body, id: `VIOL-${Date.now()}` });
    await violation.save();
    res.status(201).json({ success: true, data: violation });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PATCH /api/violations/:id/status
export const updateViolationStatus = async (req, res) => {
  try {
    const { status, actionTaken } = req.body;
    const violation = await StatutoryViolation.findOneAndUpdate(
      { id: req.params.id },
      { $set: { status, ...(actionTaken && { actionTaken }) } },
      { new: true }
    );
    if (!violation) return res.status(404).json({ error: "Violation not found" });
    res.json({ success: true, data: violation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};