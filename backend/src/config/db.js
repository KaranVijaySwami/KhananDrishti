import mongoose from "mongoose";
import { config } from "./index.js";

export async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log(`✅ MongoDB connected: ${config.mongoUri}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected.");
});