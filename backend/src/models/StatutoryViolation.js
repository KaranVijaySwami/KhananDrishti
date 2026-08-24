import mongoose, { Schema } from "mongoose";






















const ViolationSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    mineId: { type: String, required: true },
    mineName: { type: String, required: true },
    subsidiary: String,
    category: String,
    clause: String,
    description: String,
    severity: { type: String, enum: ["Low", "Medium", "High", "Critical"] },
    dateIssued: String,
    statutoryDeadline: String,
    issuingAuthority: String,
    issuingOfficer: String,
    noticeRef: String,
    status: {
      type: String,
      enum: ["Open", "ATR_Submitted", "Verified_Closed", "Escalated_Level2", "Escalated_Level3"],
      default: "Open"
    },
    assignedPerson: String,
    actionTaken: String,
    geoTag: { lat: Number, lng: Number, bench: String, seam: String },
    attachments: [String]
  },
  { timestamps: true }
);

export const StatutoryViolation = mongoose.model("StatutoryViolation", ViolationSchema);