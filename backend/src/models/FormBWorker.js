import mongoose, { Schema } from "mongoose";



















const FormBWorkerSchema = new Schema(
  {
    workerId: { type: String, required: true, unique: true },
    name: String,
    category: String,
    contractorId: String,
    mineId: String,
    subsidiary: String,
    designation: String,
    pmeValidUntil: String,
    vtcCertified: Boolean,
    safetyInductionDate: String,
    gatePassActive: { type: Boolean, default: true },
    rfidTag: String,
    aadharLast4: String,
    joiningDate: String,
    status: { type: String, enum: ["Active", "Suspended", "PME_Expired", "Terminated"], default: "Active" }
  },
  { timestamps: true }
);

export const FormBWorker = mongoose.model("FormBWorker", FormBWorkerSchema);