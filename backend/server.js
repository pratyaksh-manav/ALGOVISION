import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import algorithmRoutes from "./routes/algorithmRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5001);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? "*"
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "algovision-ai-backend" });
});

app.use("/api/algorithms", algorithmRoutes);
app.use("/api/ai", aiRoutes);

app.listen(port, () => {
  console.log(`ALGOVISION.AI backend listening on port ${port}`);
});
