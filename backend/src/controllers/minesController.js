
import { MineSite } from "../models/MineSite.js";

// GET /api/mines
export const getMines = async (req, res) => {
  try {
    const { subsidiary } = req.query;
    const filter = subsidiary && subsidiary !== "ALL" ? { subsidiary } : {};
    const mines = await MineSite.find(filter).sort({ name: 1 });
    res.json({ success: true, data: mines, count: mines.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/mines/:id
export const getMineById = async (req, res) => {
  try {
    const mine = await MineSite.findOne({ id: req.params.id });
    if (!mine) return res.status(404).json({ error: "Mine not found" });
    res.json({ success: true, data: mine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/mines/:id/telemetry
export const updateTelemetry = async (req, res) => {
  try {
    const mine = await MineSite.findOneAndUpdate(
      { id: req.params.id },
      { $set: { telemetry: req.body } },
      { new: true }
    );
    if (!mine) return res.status(404).json({ error: "Mine not found" });
    res.json({ success: true, data: mine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};