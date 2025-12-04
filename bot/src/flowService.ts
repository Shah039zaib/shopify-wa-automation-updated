// bot/src/flowService.ts
// Simple, robust incoming message handler for Baileys v5

export async function handleIncomingMessage(sock: any, upsert: any) {
  try {
    const msgs = upsert?.messages || upsert?.messagesUpsert?.messages || [];
    const messages = Array.isArray(msgs) ? msgs : [msgs];

    for (const msg of messages) {
      if (!msg || !msg.message) continue;
      const key = msg.key;
      const from = key.remoteJid;
      const m = msg.message;

      // simple text handling
      const text = m.conversation || m.extendedTextMessage?.text;
      if (text) {
        try {
          await sock.sendMessage(from, { text: "Auto-reply: " + text });
        } catch (e) {
          console.warn("sendMessage error:", e);
        }
        continue;
      }

      // image handling (basic)
      if (m.imageMessage) {
        try {
          await sock.sendMessage(from, { text: "Image received. Use OCR endpoint on server." });
        } catch (e) {
          console.warn("sendMessage error for image:", e);
        }
      }
    }
  } catch (e) {
    console.error("flowService error:", e);
  }
}

export default { handleIncomingMessage };
