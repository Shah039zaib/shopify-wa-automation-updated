// server/src/routes/bot.ts
// Simple bot API bridge between Bot service and Admin UI.
// - stores QR and session files in server/sessions
// - protects uploads with optional SESSION_UPLOAD_SECRET header "x-session-secret"

import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const SESS_DIR = path.join(__dirname, "..", "..", "sessions"); // server/sessions
if (!fs.existsSync(SESS_DIR)) fs.mkdirSync(SESS_DIR, { recursive: true });

const REQUIRE_SECRET = !!process.env.SESSION_UPLOAD_SECRET;
const SECRET_KEY = process.env.SESSION_UPLOAD_SECRET || "";

// helper to validate secret header
function checkSecret(req: express.Request) {
  if (!REQUIRE_SECRET) return true;
  const got = (req.header("x-session-secret") || req.header("x-session-key") || "").toString();
  return got === SECRET_KEY;
}

// POST /qr  -> body: { qr: "<qr-string>" }
router.post("/qr", async (req, res) => {
  try {
    if (!checkSecret(req)) return res.status(403).json({ ok: false, error: "invalid secret" });

    const qr = req.body?.qr || req.body?.data || null;
    if (!qr) return res.status(400).json({ ok: false, error: "qr required" });

    // save as raw txt + json
    const ts = Date.now();
    fs.writeFileSync(path.join(SESS_DIR, "last_qr.txt"), String(qr), "utf8");
    fs.writeFileSync(path.join(SESS_DIR, "last_qr.json"), JSON.stringify({ qr, ts }, null, 2), "utf8");

    return res.json({ ok: true });
  } catch (e: any) {
    console.error("POST /api/bot/qr error", e);
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

// GET /qr  -> returns { ok: true, qr: "<string>" } or { ok:false }
router.get("/qr", async (req, res) => {
  try {
    const p = path.join(SESS_DIR, "last_qr.txt");
    if (!fs.existsSync(p)) return res.json({ ok: true, qr: null });
    const qr = fs.readFileSync(p, "utf8");
    return res.json({ ok: true, qr });
  } catch (e: any) {
    console.error("GET /api/bot/qr error", e);
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

// POST /session  -> body: { session: { ... } }   (bot uploads auth/session)
router.post("/session", async (req, res) => {
  try {
    if (!checkSecret(req)) return res.status(403).json({ ok: false, error: "invalid secret" });
    const session = req.body?.session;
    if (!session) return res.status(400).json({ ok: false, error: "session required" });

    const ts = Date.now();
    const fname = `session_${ts}.json`;
    fs.writeFileSync(path.join(SESS_DIR, fname), typeof session === "string" ? session : JSON.stringify(session, null, 2), "utf8");
    // also put latest copy
    fs.writeFileSync(path.join(SESS_DIR, "last_session.json"), typeof session === "string" ? session : JSON.stringify(session, null, 2), "utf8");

    return res.json({ ok: true, file: fname });
  } catch (e: any) {
    console.error("POST /api/bot/session error", e);
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

// GET /session  -> returns latest session content
router.get("/session", async (req, res) => {
  try {
    const p = path.join(SESS_DIR, "last_session.json");
    if (!fs.existsSync(p)) return res.json({ ok: true, session: null });
    const content = fs.readFileSync(p, "utf8");
    try { return res.json({ ok: true, session: JSON.parse(content) }); } catch { return res.json({ ok: true, session: content }); }
  } catch (e: any) {
    console.error("GET /api/bot/session error", e);
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

// GET /status -> quick status: whether last_session exists
router.get("/status", async (req, res) => {
  try {
    const p = path.join(SESS_DIR, "last_session.json");
    const exists = fs.existsSync(p);
    return res.json({ ok: true, connected: exists });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

export default router;
