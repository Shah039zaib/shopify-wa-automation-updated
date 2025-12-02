// server/src/routes/payment.ts
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { pool } from "../services/db";
import { analyzePaymentCandidate } from "../services/paymentService";

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname || "");
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`);
  }
});
const upload = multer({ storage });

// Extend Express Request to include multer file (TypeScript-friendly)
interface MulterRequest extends express.Request {
  file?: Express.Multer.File;
}

// upload screenshot candidate
router.post("/upload", upload.single("screenshot"), async (req: MulterRequest, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ ok: false, error: "No file" });

    // move file to public uploads (simple)
    const publicDir = path.join(__dirname, "..", "..", "server_uploads");
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    const dest = path.join(publicDir, path.basename(file.filename));
    // file.path is already at uploadDir; move/rename to publicDir
    fs.renameSync(file.path, dest);
    const url = `/server_uploads/${path.basename(dest)}`;

    // Run OCR / analysis (server-side)
    const analysis = await analyzePaymentCandidate(url, dest);

    // save candidate
    const client_id = req.body.client_id || null;
    const q = `INSERT INTO payment_candidates (client_id, screenshot_url, ocr_text, confidence, status) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
    const r = await pool.query(q, [client_id, url, analysis.text || "", analysis.confidence || 0, 'pending']);
    res.json({ ok: true, candidate: r.rows[0], analysis });
  } catch (e: any) {
    console.error("Upload error:", e);
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
});

// list candidates
router.get("/candidates", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM payment_candidates ORDER BY created_at DESC LIMIT 200");
    res.json({ ok: true, candidates: r.rows });
  } catch (e) {
    console.error("Candidates list error:", e);
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// confirm payment (admin)
router.post("/:id/confirm", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const q = "UPDATE payment_candidates SET status='confirmed' WHERE id=$1 RETURNING *";
    const r = await pool.query(q, [id]);
    await pool.query("UPDATE clients SET status='advance_paid' WHERE id=(SELECT client_id FROM payment_candidates WHERE id=$1)", [id]);
    res.json({ ok: true, candidate: r.rows[0] });
  } catch (e) {
    console.error("Confirm error:", e);
    res.status(500).json({ ok: false, error: String(e) });
  }
});

export default router;
