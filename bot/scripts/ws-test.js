// bot/scripts/ws-test.js
const WebSocket = require("ws");

const url = "wss://wweb-fx.whatsapp.net/ws"; // alternative WA endpoint try
// also try: wss://web.whatsapp.com/ws

function attempt(u){
  console.log("Trying:", u);
  const ws = new WebSocket(u, {
    headers: { Origin: "https://web.whatsapp.com" },
    handshakeTimeout: 15000
  });

  ws.on("open", () => {
    console.log("OPEN");
    ws.terminate();
  });
  ws.on("error", (e) => {
    console.error("ERR", e && e.message ? e.message : e);
  });
  ws.on("close", (code, reason) => {
    console.log("CLOSE", code, reason && reason.toString ? reason.toString() : reason);
  });
}

attempt("wss://web.whatsapp.com/ws");
attempt("wss://wapp.whatsapp.net/ws");
attempt("wss://wweb-fx.whatsapp.net/ws");
