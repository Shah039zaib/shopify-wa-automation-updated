// server/src/routes/session.ts
import express from "express";
import QRCode from "qrcode";

const router = express.Router();

let lastQrText: string | null = null;
let lastQrAt: number | null = null;

router.post("/qr", (req, res) => {
  const { qr } = req.body;
  if (!qr) return res.status(400).json({ ok: false, error: "missing_qr" });
  lastQrText = qr;
  lastQrAt = Date.now();
  return res.json({ ok: true });
});

router.post("/qr/clear", (_req, res) => {
  lastQrText = null;
  lastQrAt = null;
  return res.json({ ok: true });
});

router.get("/qr", async (_req, res) => {
  if (!lastQrText) return res.status(404).json({ ok: false, error: "no_qr" });
  try {
    const dataUrl = await QRCode.toDataURL(lastQrText);
    return res.json({ ok: true, dataUrl, ts: lastQrAt });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "qr_error" });
  }
});

export default router;
