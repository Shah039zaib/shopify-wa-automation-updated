import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.ENCRYPTION_KEY || "devkey";
export function requireJwt(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.a_token || req.headers["authorization"]?.toString().replace("Bearer ", "");
  if (!token) return res.status(401).json({ ok: false, error: "no token" });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) { return res.status(401).json({ ok: false, error: "invalid token" }); }
}
