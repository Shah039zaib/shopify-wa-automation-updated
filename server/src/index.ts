// server/src/index.ts
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import { initDb } from "./services/db";
import leadsRouter from "./routes/leads";
import sessionRouter from "./routes/session";
import paymentRouter from "./routes/payment";
import adminRouter from "./routes/admin";
import demoRouter from "./routes/demo";

dotenv.config();

const app = express();

// trust proxy for secure cookies behind Render / proxy
app.set("trust proxy", 1);

// parse JSON with larger limit for session sync
app.use(express.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

// CORS: set origin explicitly to your admin frontend URL (recommended)
// fallback to true (allow all) only if you truly need it
const ADMIN_ORIGIN = process.env.ADMIN_FRONTEND_ORIGIN || process.env.APP_BASE_URL || true;
app.use(
  cors({
    origin: ADMIN_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

// ----- ensure server_uploads exists on Render -----
const uploadsPath = path.join(__dirname, "..", "server_uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use("/server_uploads", express.static(uploadsPath));
// --------------------------------------------------

// API ROUTES
app.use("/api/leads", leadsRouter);
app.use("/api/session", sessionRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/demo", demoRouter);

// Root health check
app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Server running." });
});

// small ping route optional
app.get("/ping", (_req, res) => res.json({ ok: true, time: Date.now() }));

const PORT = Number(process.env.PORT || 3000);

async function start() {
  try {
    console.log("Initializing database...");
    await initDb();
    console.log("Database initialized.");

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (e: any) {
    console.error("Startup Error:", e);
    process.exit(1);
  }
}

start();
