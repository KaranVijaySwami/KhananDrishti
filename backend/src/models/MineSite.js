import mongoose, { Schema } from "mongoose";































const MineSiteSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    subsidiary: { type: String, required: true },
    state: String,
    district: String,
    type: { type: String, enum: ["Opencast", "Underground", "Mixed"] },
    capacityMTPA: Number,
    currentProductionMT: Number,
    ecCapMTPA: Number,
    complianceScore: Number,
    starRating: { type: Number, enum: [1, 2, 3, 4, 5] },
    lat: Number,
    lng: Number,
    manager: String,
    safetyOfficer: String,
    activeViolations: { type: Number, default: 0 },
    highRiskHazards: { type: Number, default: 0 },
    lastInspectionDate: String,
    status: { type: String, enum: ["Operational", "Restricted_Notice", "Under_Review"], default: "Operational" },
    telemetry: {
      methanePct: Number,
      coPpm: Number,
      dustPm10: Number,
      waterPh: Number,
      slopeDisplacementMm: Number,
      noiseDb: Number
    }
  },
  { timestamps: true }
);

export const MineSite = mongoose.model("MineSite", MineSiteSchema);