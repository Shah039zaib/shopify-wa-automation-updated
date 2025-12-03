import makeWASocket from "@adiwajshing/baileys";

export type SocketType = ReturnType<typeof makeWASocket>;

export async function handleIncomingMessage(
  sock: SocketType,
  from: string,
  text: string
) {
  console.log("[flow] message from", from, "text:", text);

  try {
    await sock.sendMessage(from, {
      text: "Thanks! Hum aapka message receive kar liya hai. Hum jald reply karain ge.",
    });
  } catch (e) {
    console.warn("reply error", e);
  }
}

export default { handleIncomingMessage };
