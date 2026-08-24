
import { ContractorRecord } from "../models/ContractorRecord.js";
import { FormBWorker } from "../models/FormBWorker.js";

// GET /api/contractors
export const getContractors = async (req, res) => {
  try {
    const { mineId, subsidiary, status } = req.query;
    const filter = {};
    if (mineId) filter.mineId = mineId;
    if (subsidiary) filter.subsidiary = subsidiary;
    if (status) filter.status = status;
    const contractors = await ContractorRecord.find(filter);
    res.json({ success: true, data: contractors, count: contractors.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/contractors
export const createContractor = async (req, res) => {
  try {
    const contractor = new ContractorRecord({ ...req.body, id: `CONT-${Date.now()}` });
    await contractor.save();
    res.status(201).json({ success: true, data: contractor });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/contractors/workers
export const getWorkers = async (req, res) => {
  try {
    const { mineId, contractorId, status } = req.query;
    const filter = {};
    if (mineId) filter.mineId = mineId;
    if (contractorId) filter.contractorId = contractorId;
    if (status) filter.status = status;
    const workers = await FormBWorker.find(filter).sort({ name: 1 });
    res.json({ success: true, data: workers, count: workers.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/contractors/workers/:workerId/gate-pass
export const toggleGatePass = async (req, res) => {
  try {
    const worker = await FormBWorker.findOne({ workerId: req.params.workerId });
    if (!worker) return res.status(404).json({ error: "Worker not found" });
    worker.gatePassActive = !worker.gatePassActive;
    await worker.save();
    res.json({ success: true, data: worker });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/contractors/workers/:workerId/pme
export const certifyPME = async (req, res) => {
  try {
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 3);
    const worker = await FormBWorker.findOneAndUpdate(
      { workerId: req.params.workerId },
      { $set: { pmeValidUntil: validUntil.toISOString().split("T")[0], status: "Active" } },
      { new: true }
    );
    if (!worker) return res.status(404).json({ error: "Worker not found" });
    res.json({ success: true, data: worker });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};