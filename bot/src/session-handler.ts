// bot/src/session-handler.ts
// Utilities to read local session file (if you want bot to supply endpoints locally)

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const SESSION_DIR = process.env.SESSION_DIR || "./bot_sessions";
const SESSION_FILE = process.env.SESSION_FILE || "auth_info.json";
const authPath = path.join(SESSION_DIR, SESSION_FILE);

export function readLocalSession() {
  if (!fs.existsSync(authPath)) return null;
  try {
    return fs.readFileSync(authPath, "utf-8");
  } catch (e) {
    console.warn("readLocalSession error", e);
    return null;
  }
}
export default { readLocalSession };
