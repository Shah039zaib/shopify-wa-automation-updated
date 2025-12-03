// bot/src/index.ts
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@adiwajshing/baileys";
import P from "pino";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
import { handleIncomingMessage } from "./flowService"; // your handler
import { runLocalOcr } from "./ocrLocal"; // optional

dotenv.config();
const log = P();
const SESSION_DIR = process.env.SESSION_DIR || "./bot_sessions";
const SERVER_HEALTH_URL = (process.env.APP_BASE_URL || process.env.SERVER_URL || "").replace(/\/$/, "") + "/health";
const HEALTH_PING_INTERVAL_MS = Number(process.env.HEALTH_PING_INTERVAL_MS || 4 * 60 * 1000); // 4 minutes

let lastConnectionState: string | undefined = undefined;
let lastConnectedAt = 0;

async function startBot() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

    const sock = makeWASocket({
      printQRInTerminal: false, // we handle QR differently in UI
      auth: state,
      logger: log
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async (m) => {
      const messages = m.messages;
      for (const msg of messages) {
        if (!msg.message) continue;
        const from = msg.key.remoteJid!;
        const text = (msg.message?.conversation) || (msg.message?.extendedTextMessage?.text) || "";
        try {
          await handleIncomingMessage(sock, from, text);
        } catch (e) {
          console.error("handleIncomingMessage error:", e);
        }
      }
    });

    sock.ev.on("connection.update", async (update: any) => {
      const { connection, lastDisconnect } = update;
      console.log("connection.update:", connection);
      lastConnectionState = connection;

      if (connection === "open") {
        lastConnectedAt = Date.now();
        console.log("WA connected");
        // push session to server if configured
        if (process.env.ALLOW_REMOTE_SESSION === "true" && process.env.APP_BASE_URL) {
          try {
            const authState = state;
            await axios.post(`${process.env.APP_BASE_URL}/api/session`, { session: authState });
            console.log("Session posted to server for persistence.");
          } catch (e) {
            console.warn("Could not post session to server:", e);
          }
        }
      } else if (connection === "close") {
        const code = lastDisconnect?.error?.output?.statusCode;
        console.log("Connection closed, reason:", code);
        // if logged out remove session files? For now try reconnect unless logged out
        if (code !== DisconnectReason.loggedOut) {
          console.log("Attempting reconnect...");
          // small delay before restarting
          setTimeout(() => {
            startBot().catch(err => {
              console.error("startBot reconnect failed:", err);
              // If reconnect repeatedly fails, exit to let Render restart
              process.exit(1);
            });
          }, 3000);
        } else {
          console.log("Logged out - remove session and re-scan.");
        }
      }
    });

    // Periodic keepalive ping to server so Render doesn't sleep the bot process
    setInterval(async () => {
      try {
        if (SERVER_HEALTH_URL) {
          await fetch(SERVER_HEALTH_URL, { method: "GET", keepalive: true }).catch(() => {});
          // optional log
          console.log("Pinged server health.");
        }
      } catch (e) {
        console.warn("Health ping failed", e);
      }
    }, HEALTH_PING_INTERVAL_MS);

    // Watchdog: if not connected for long -> restart process so Render will re-deploy
    const WATCHDOG_INTERVAL_MS = 60 * 1000; // check every minute
    setInterval(() => {
      const now = Date.now();
      // if lastConnectedAt too old and connection state is not 'open'
      if (lastConnectionState && lastConnectionState !== "open" && (now - lastConnectedAt) > (1000 * 60 * 10)) {
        console.error("Watchdog: bot not connected for >10m. Exiting to trigger restart.");
        process.exit(1);
      }
    }, WATCHDOG_INTERVAL_MS);

    // process-level handlers
    process.on("uncaughtException", (err) => {
      console.error("Uncaught exception:", err);
      // allow crash to restart or attempt graceful exit
      setTimeout(()=>process.exit(1), 1000);
    });
    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled Rejection:", reason);
      setTimeout(()=>process.exit(1), 1000);
    });

  } catch (e) {
    console.error("Bot start error:", e);
    process.exit(1);
  }
}

startBot();
