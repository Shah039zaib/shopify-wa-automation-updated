import { Pool } from "pg";
import fs from "fs";
import path from "path";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function initDb() {
  try {
    const p = path.join(__dirname, "..", "..", "migrations", "init.sql");
    if (fs.existsSync(p)) {
      const sql = fs.readFileSync(p, "utf8");
      await pool.query(sql);
      console.log("Migrations run.");
    } else {
      console.log("No migrations file found:", p);
    }
  } catch (e) {
    console.error("DB init error:", e);
    throw e;
  }
}

export { pool };
