
import { pool } from "./db";
import { runOcrOnImage } from "../utils/ocr";

// Simple wrapper: analyze OCR text for amounts and phone numbers
export async function analyzePaymentCandidate(fileUrl: string, localPath: string) {
  const ocr = await runOcrOnImage(localPath);
  // naive extraction
  const text = (ocr.text || "").toLowerCase();
  const matches = [];
  const amountMatch = text.match(/\b(\d{3,7})\b/);
  const phoneMatch = text.match(/0\d{9,12}|\+\d{11,14}/);
  return { text: ocr.text, confidence: ocr.confidence || 0, amount: amountMatch ? amountMatch[0] : null, phone: phoneMatch ? phoneMatch[0] : null };
}
