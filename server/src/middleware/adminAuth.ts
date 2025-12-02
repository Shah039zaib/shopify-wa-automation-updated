// server/src/middleware/adminAuth.ts
import { Request, Response, NextFunction } from "express";
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.ADMIN_SECRET || "";
  const header = (req.headers["x-admin-secret"] || "").toString();
  if (!secret || header !== secret) return res.status(401).json({ ok: false, error: "Unauthorized" });
  next();
}
