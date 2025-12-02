// server/src/routes/auth.ts
import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();

const ADMIN_SECRET = process.env.ADMIN_SECRET || "";
const JWT_SECRET = process.env.ENCRYPTION_KEY || "dev_jwt_secret";

router.post("/login", (req, res) => {
  const { password } = req.body;
  if (!ADMIN_SECRET) return res.status(500).json({ ok: false, error: "admin not configured" });
  if (password !== ADMIN_SECRET) return res.status(401).json({ ok: false, error: "invalid" });
  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "8h" });
  // set cookie (if you want) and return token
  res.cookie("a_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
  res.json({ ok: true });
});

export default router;
