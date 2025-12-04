// bot/src/flowService.ts
// FIXED FOR BAILEYS v5 – No WASocket namespace typing

import { proto } from "@adiwajshing/baileys";

export async function handleIncomingMessage(sock: any, upsert: any) {
  try {
    const msgs = upsert?.messages || upsert?.messagesUpsert?.messages || [];
    const messages = Array.isArray(msgs) ? msgs : [msgs];

    for (const msg of messages) {
      if (!msg.message) continue;

      const from = msg.key.remoteJid;
      const m = msg.message;

      // Simple text handler
      if (m.conversation || m.extendedTextMessage) {
        const text = m.conversation || m.extendedTextMessage?.text || "";

        await sock.sendMessage(from, {
          text: `Received: ${text}`
        });
      }

      // Image → OCR Logic (safe)
      if (m.imageMessage && m.imageMessage.caption) {
        await sock.sendMessage(from, {
          text: "Image received — OCR disabled in this version."
        });
      }
    }
  } catch (err) {
    console.error("flowService error →", err);
  }
}

export default { handleIncomingMessage };
