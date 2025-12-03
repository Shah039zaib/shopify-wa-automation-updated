// server/src/routes/admin.ts
import express from "express";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const router = express.Router();
const ADMIN_SECRET = process.env.ADMIN_SECRET || "change_this_secret";
const COOKIE_NAME = "a_token";

function getTokenFromReq(req: Request) {
  return req.cookies?.[COOKIE_NAME] || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);
}

function verifyToken(token: string | null) {
  if (!token) return null;
  try {
    return jwt.verify(token, ADMIN_SECRET);
  } catch {
    return null;
  }
}

// POST /api/admin/auth/login
router.post("/auth/login", (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_SECRET) return res.status(401).json({ ok: false, error: "Invalid password" });

  const token = jwt.sign({ role: "admin" }, ADMIN_SECRET, { expiresIn: "7d" });
  // cookie: secure + httpOnly + sameSite none for cross-site, Render uses HTTPS so secure=true ok
  res.cookie(COOKIE_NAME, token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 3600 * 1000 });
  return res.json({ ok: true });
});

// POST /api/admin/auth/logout
router.post("/auth/logout", (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ ok: true });
});

// GET /api/admin/me
router.get("/me", (req: Request, res: Response) => {
  const token = getTokenFromReq(req);
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ ok: false, error: "Not authenticated" });
  return res.json({ ok: true, user: payload });
});

export default router;
