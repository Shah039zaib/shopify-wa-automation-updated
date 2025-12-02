import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  WASocket
} from "@adiwajshing/baileys";
import P from "pino";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { handleIncomingMessage } from "./flowService";

dotenv.config();

async function start() {
  const sessionDir = path.join(process.cwd(), "bot_sessions");
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const { version } = await fetchLatestBaileysVersion();

  const logger = P({ level: "silent" }); // avoid TS logger type issues

  const sock: WASocket = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: state,
    logger
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      for (const msg of messages) {
        if (!msg.message) continue;
        if (msg.key && msg.key.fromMe) continue;
        const from = msg.key.remoteJid!;
        const text =
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          (msg.message?.imageMessage?.caption ?? "") ||
          "";
        await handleIncomingMessage(sock, from, text);
      }
    } catch (e) {
      console.error("messages.upsert error:", e);
    }
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    console.log("connection.update:", connection);
    if (connection === "open") {
      console.log("Bot connected.");
      if (process.env.ALLOW_REMOTE_SESSION === "true" && process.env.APP_BASE_URL) {
        try {
          await axios.post(`${process.env.APP_BASE_URL}/api/session`, { name: process.env.SESSION_NAME || "default", sessionJson: JSON.stringify(state) }, {
            headers: { "x-session-key": process.env.SESSION_API_KEY || "" },
            timeout: 10000
          });
          console.log("Session posted to server.");
        } catch (e) {
          console.warn("Session post failed:", e);
        }
      }
    }
    if (connection === "close") {
      const code = (lastDisconnect?.error as any)?.output?.statusCode || 0;
      console.warn("Connection closed code:", code);
      if (code === DisconnectReason.loggedOut) {
        console.error("Logged out. Remove local session files and re-scan QR.");
        process.exit(0);
      } else {
        console.log("Restarting process to force reconnect.");
        process.exit(1); // Render will restart
      }
    }
  });
}

start().catch((e) => {
  console.error("Start error:", e);
  process.exit(1);
});
