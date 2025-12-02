
import crypto from "crypto";

const ALGO = "aes-256-gcm";
const KEY = (process.env.ENCRYPTION_KEY || "").slice(0,32);
if (!KEY || KEY.length < 32) {
  console.warn("ENCRYPTION_KEY should be set and at least 32 characters.");
}

export function encryptJson(obj: any) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, Buffer.from(KEY), iv);
  const text = JSON.stringify(obj);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptJson(b64: string) {
  const data = Buffer.from(b64, "base64");
  const iv = data.slice(0, 12);
  const tag = data.slice(12, 28);
  const encrypted = data.slice(28);
  const decipher = crypto.createDecipheriv(ALGO, Buffer.from(KEY), iv);
  decipher.setAuthTag(tag);
  const out = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return JSON.parse(out.toString("utf8"));
}
