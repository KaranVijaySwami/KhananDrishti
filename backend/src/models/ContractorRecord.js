import mongoose, { Schema } from "mongoose";



















const ContractorSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    contractorName: String,
    contractCode: String,
    subsidiary: String,
    mineId: String,
    totalWorkers: Number,
    formBCompliantPct: Number,
    pmeValidPct: Number,
    vtcCertifiedPct: Number,
    safetyInductionScore: Number,
    activeMachineryCount: Number,
    safetyViolationsLast90Days: Number,
    status: { type: String, enum: ["Compliant", "Warning_Notice", "Suspended"], default: "Compliant" },
    supervisorName: String,
    contactNumber: String
  },
  { timestamps: true }
);

export const ContractorRecord = mongoose.model("ContractorRecord", ContractorSchema);