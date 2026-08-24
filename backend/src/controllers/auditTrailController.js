
import { AuditLog } from "../models/AuditLog.js";
import crypto from "crypto";

// GET /api/audit-trail
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: logs, count: logs.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/audit-trail/sign
export const signAuditEntry = async (req, res) => {
  try {
    const { actor, role, action, targetRef } = req.body;

    // Get latest hash to chain from
    const latest = await AuditLog.findOne().sort({ createdAt: -1 });
    const previousHash = latest?.tamperProofHash || "GENESIS_BLOCK_KHANANDRISHTI";

    const blockData = JSON.stringify({ actor, role, action, targetRef, previousHash, ts: Date.now() });
    const tamperProofHash = "sha256-" + crypto.createHash("sha256").update(blockData).digest("hex");

    const newLog = new AuditLog({
      id: `LOG-${Date.now().toString().slice(-8)}`,
      timestamp: new Date().toISOString(),
      actor,
      role,
      action,
      targetRef,
      tamperProofHash,
      previousHash,
      verified: true
    });
    await newLog.save();
    res.status(201).json({ success: true, data: newLog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/audit-trail/verify
export const verifyChain = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: 1 });
    let chainValid = true;
    for (let i = 1; i < logs.length; i++) {
      if (logs[i].previousHash !== logs[i - 1].tamperProofHash) {
        chainValid = false;
        break;
      }
    }
    res.json({ success: true, chainValid, totalBlocks: logs.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};