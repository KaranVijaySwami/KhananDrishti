import mongoose, { Schema } from "mongoose";

const LoginLogSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // In case of failed login for non-existent user
    },
    email: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      required: true,
    },
    failureReason: {
      type: String,
    },
  },
  { timestamps: true }
);

export const LoginLog = mongoose.model("LoginLog", LoginLogSchema);
