import mongoose, { Schema } from "mongoose";

















const UserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    designation: String,
    role: { type: String, required: true },
    subsidiary: String,
    mineId: String,
    mineName: String,
    department: String,
    employeeCode: { type: String, required: true, unique: true },
    password: { type: String },
    statutoryCertNo: String,
    dscKeyId: String,
    allowedTabs: [String]
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);