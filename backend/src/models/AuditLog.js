import mongoose, { Schema } from "mongoose";














const AuditLogSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    timestamp: { type: String, required: true },
    actor: String,
    role: String,
    action: String,
    targetRef: String,
    tamperProofHash: { type: String, required: true },
    previousHash: String,
    verified: { type: Boolean, default: true },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

// Index for fast chain traversal
AuditLogSchema.index({ tamperProofHash: 1 });
AuditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model("AuditLog", AuditLogSchema);