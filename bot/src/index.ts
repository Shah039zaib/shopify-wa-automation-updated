// bot/src/index.ts
import express from "express";
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  WASocket
} from "@whiskeysockets/baileys";
import P from "pino";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { handleIncomingMessage } from "./flowService";

dotenv.config();

const PORT = Number(process.env.PORT || process.env.APP_PORT || 10000);

async function startBot() {
  const sessionDir = path.join(process.cwd(), "bot_sessions");
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const { version } = await fetchLatestBaileysVersion();

  const logger = P({ level: "silent" });
  const sock: WASocket = makeWASocket({
    version,
    printQRInTerminal: false, // deprecated message suppressed
    auth: state,
    logger
  } as any);

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async (event: any) => {
    try {
      const messages = event.messages || [];
      for (const msg of messages) {
        if (!msg.message) continue;
        if (msg.key?.fromMe) continue;
        const from = msg.key.remoteJid;
        const text =
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          msg.message?.imageMessage?.caption ||
          "";
        await handleIncomingMessage(sock as any, from, text);
      }
    } catch (e) {
      console.error("messages.upsert error:", e);
    }
  });

  sock.ev.on("connection.update", async (update: any) => {
    try {
      const { connection, lastDisconnect, qr } = update;
      console.log("connection.update:", connection);

      // If QR present, print to logs so you can scan from Render logs
      if (update.qr) {
        console.log("QR:", update.qr);
      }

      if (connection === "open") {
        console.log("Bot connected.");
        if (process.env.ALLOW_REMOTE_SESSION === "true" && process.env.APP_BASE_URL) {
          try {
            await axios.post(
              `${process.env.APP_BASE_URL}/api/session`,
              {
                name: process.env.SESSION_NAME || "default",
                sessionJson: JSON.stringify(state)
              },
              {
                headers: { "x-session-key": process.env.SESSION_API_KEY || "" },
                timeout: 10000
              }
            );
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
          process.exit(1);
        }
      }
    } catch (e) {
      console.error("connection.update handler error:", e);
    }
  });

  return sock;
}

async function startServerAndBot() {
  // Start Express health server (so Render sees an open port)
  const app = express();
  app.get("/", (_req, res) => res.json({ ok: true, message: "Server running." }));
  app.get("/health", (_req, res) => res.json({ ok: true, timestamp: Date.now() }));

  app.listen(PORT, () => {
    console.log(`Health server listening on port ${PORT}`);
  });

  // Start bot (no await to keep server running)
  startBot().catch((e) => {
    console.error("Bot start error:", e);
    process.exit(1);
  });
}

startServerAndBot();
