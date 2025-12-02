
import Tesseract from "tesseract.js";

export async function runOcrOnImage(filePath: string) {
  try {
    const worker = await Tesseract.createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data } = await worker.recognize(filePath);
    await worker.terminate();
    return { text: data.text, confidence: data.confidence };
  } catch (e) {
    console.error("OCR error:", e);
    return { text: "", confidence: 0 };
  }
}
