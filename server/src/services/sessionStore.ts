
import { pool } from "./db";
import { encryptJson, decryptJson } from "../utils/encrypt";

export async function saveSessionToDb(sessionObj: any) {
  const enc = encryptJson(sessionObj);
  await pool.query("INSERT INTO wa_sessions (session_key) VALUES ($1)", [enc]);
  return true;
}

export async function getLatestSessionFromDb() {
  const res = await pool.query("SELECT session_key FROM wa_sessions ORDER BY id DESC LIMIT 1");
  if (res.rowCount === 0) return null;
  try {
    const dec = decryptJson(res.rows[0].session_key);
    return dec;
  } catch (e) {
    console.error("Session decrypt error:", e);
    return null;
  }
}
