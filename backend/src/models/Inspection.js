import mongoose, { Schema } from "mongoose";

const ChecklistItemSchema = new Schema({
  checkPoint: { type: String, required: true },
  statutoryRef: { type: String, required: true },
  status: { type: String, enum: ["Pass", "Fail", "Observation"], required: true },
  remarks: { type: String, default: "" },
});

const InspectionSchema = new Schema(
  {
    inspectionId: { type: String, required: true, unique: true },
    mineId: { type: String, required: true },
    mineName: { type: String, required: true },
    subsidiary: { type: String, required: true },
    inspectorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    inspectorName: { type: String, required: true },
    inspectorDesignation: { type: String, required: true },
    inspectionType: { type: String, required: true },
    benchOrLevel: { type: String, required: true },
    seamName: { type: String },
    date: { type: String },
    timestamp: { type: String },
    geoTag: {
      lat: { type: Number },
      lng: { type: Number },
      accuracyM: { type: Number },
      benchOrLevel: { type: String },
      seam: { type: String },
    },
    checklistSummary: {
      totalItems: { type: Number, default: 0 },
      passed: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
    },
    items: [ChecklistItemSchema],
    hazardsFound: [{ type: String }],
    overallVerdict: { 
      type: String, 
      enum: ["Compliant", "Non_Compliant_Notice", "Observation_Logged"],
      required: true 
    },
    photoUrls: [{ type: String }],
    digitalSignatureHash: { type: String, required: true },
    tamperProofHash: { type: String, required: true },
    syncStatus: { type: String, enum: ["Synced", "Queued_Offline"], default: "Synced" },
  },
  { timestamps: true }
);

export const Inspection = mongoose.model("Inspection", InspectionSchema);
