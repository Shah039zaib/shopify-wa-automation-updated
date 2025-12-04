export async function handleIncomingMessage(sock, upsert) {
  try {
    const msgs = upsert.messages || [];
    for (let msg of msgs) {
      if (!msg.message) continue;

      const from = msg.key.remoteJid;
      const text = msg.message?.conversation;

      if (text) {
        await sock.sendMessage(from, { text: "Received: " + text });
      }
    }
  } catch (e) {
    console.log("flowService error:", e.message);
  }
}
