import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config/index.js";
import { connectDB } from "./config/db.js";
import apiRoutes from "./routes/index.js";

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.use("/api", apiRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(config.port, async () => {
  await connectDB();
  console.log(`🚀 KhananDrishti Backend running on port ${config.port}`);
});