import mongoose, { Schema } from "mongoose";




























const InspectionSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    mineId: String,
    mineName: String,
    subsidiary: String,
    inspectorName: String,
    inspectorDesignation: String,
    inspectionType: String,
    date: String,
    timestamp: String,
    geoTag: { lat: Number, lng: Number, accuracyM: Number, benchOrLevel: String, seam: String },
    checklistSummary: { totalItems: Number, passed: Number, failed: Number },
    items: [{ checkPoint: String, status: String, statutoryRef: String, remarks: String }],
    hazardsFound: [String],
    photoUrls: [String],
    overallVerdict: String,
    digitalSignatureHash: String,
    tamperProofHash: String,
    syncStatus: String
  },
  { timestamps: true }
);

export const InspectionRecord = mongoose.model("InspectionRecord", InspectionSchema);