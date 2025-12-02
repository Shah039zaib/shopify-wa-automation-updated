
import axios from "axios";

// aiService: proxies requests to AI provider if API key provided.
// Also contains demo-store search using internal demo_links table.
import { pool } from "./db";

export async function proxyAiReply(prompt: string) {
  const provider = process.env.AI_PROVIDER || "openai";
  const key = process.env.AI_API_KEY || "";
  if (!key) throw new Error("AI key not configured");
  if (provider === "openai") {
    const r = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300
    }, { headers: { Authorization: `Bearer ${key}` }});
    return r.data;
  }
  throw new Error("Unsupported AI provider");
}

export async function searchDemoStores(category: string) {
  const q = "SELECT url FROM demo_links WHERE lower(category)=lower($1) AND safe=true LIMIT 20";
  const r = await pool.query(q, [category]);
  return r.rows.map((row:any) => row.url);
}
