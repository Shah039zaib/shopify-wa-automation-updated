// server/src/utils/ai.ts
import axios from "axios";

const HF_KEY = process.env.HUGGINGFACE_API_KEY || "";
const HF_MODEL = process.env.HF_MODEL || "distilgpt2";

export async function generateWithHF(prompt: string, opts?: { temperature?: number, max_tokens?: number }) {
  if (!HF_KEY) throw new Error("no_hf_key");
  const url = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
  const payload = {
    inputs: prompt,
    parameters: { temperature: opts?.temperature ?? 0.7, max_new_tokens: opts?.max_tokens ?? 150 }
  };
  const headers = { Authorization: `Bearer ${HF_KEY}` };
  const res = await axios.post(url, payload, { headers, timeout: 20000 });
  if (Array.isArray(res.data) && res.data[0]?.generated_text) return res.data[0].generated_text;
  if (res.data?.generated_text) return res.data.generated_text;
  return String(res.data);
}
