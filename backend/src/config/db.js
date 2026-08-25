import dns from "dns";
import mongoose from "mongoose";
import { config } from "./index.js";

// Force Google DNS to resolve MongoDB Atlas SRV records correctly.
// Some ISP/corporate DNS servers block Node.js SRV UDP queries.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri, { family: 4 });
    console.log(`✅ MongoDB connected: ${config.mongoUri}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected.");
});