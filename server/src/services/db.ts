
import { Pool } from "pg";
import fs from "fs";
import path from "path";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function initDb() {
  const p = path.join(__dirname, "..", "..", "migrations", "init.sql");
  if (fs.existsSync(p)) {
    const sql = fs.readFileSync(p, "utf8");
    await pool.query(sql);
    console.log("Migrations run.");
  }
}

export { pool };
