import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5001", 10),

  nodeEnv: process.env.NODE_ENV || "development",

mongoUri: process.env.MONGODB_URI,

  corsOrigin:
    process.env.CORS_ORIGIN ||
    "http://localhost:5173",

  geminiApiKey:
    process.env.GEMINI_API_KEY || "",

  jwtSecret:
    process.env.JWT_SECRET || "",
};