import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "./config/index.js";
import { connectDB } from "./config/db.js";
import apiRoutes from "./routes/index.js";

const app = express();

app.use(morgan("dev"));

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());


app.get("/", (req, res) => {
  res.json({
    message: "KhananDrishti Backend is running!",
    status: "ok",
  });
});


app.use("/api", apiRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.get("/test", (req, res) => {
  res.send("TEST ROUTE WORKS");
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port,"0.0.0.0", () => {
      console.log(
        `🚀 KhananDrishti Backend running on port ${config.port}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();