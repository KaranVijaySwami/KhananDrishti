import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "./config/index.js";
import { connectDB } from "./config/db.js";
import apiRoutes from "./routes/index.js";

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.use("/api", apiRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(config.port, async () => {
  await connectDB();
  console.log(`🚀 KhananDrishti Backend running on port ${config.port}`);
});