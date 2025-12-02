// server/src/routes/demo.ts
import express from "express";
import { pool } from "../services/db";
const router = express.Router();

// ping for quick health checks
router.get("/ping", async (_req, res) => {
  return res.json({ pong: true });
});

// simple search endpoint (example)
router.get("/search", async (req, res) => {
  const q = (req.query.q || "").toString();
  try {
    // if you have demo_links table return matched, else empty array
    const r = await pool.query(
      "SELECT url FROM demo_links WHERE category ILIKE $1 LIMIT 10",
      [`%${q}%`]
    ).catch(() => ({ rows: [] }));
    return res.json({ ok: true, results: r.rows.map((r:any) => r.url) });
  } catch (e:any) {
    console.error("demo search error:", e);
    return res.status(500).json({ ok: false, error: String(e.message || e) });
  }
});

export default router;
