const WebSocket = require("ws");
const urls = [
  "wss://web.whatsapp.com/ws",
  "wss://wweb-fx.whatsapp.net/ws",
  "wss://wapp.whatsapp.net/ws"
];
function attempt(u){
  console.log("Trying:", u);
  const ws = new WebSocket(u, { headers: { Origin: "https://web.whatsapp.com" }, handshakeTimeout: 15000 });
  ws.on("open", () => { console.log("OPEN", u); ws.terminate(); });
  ws.on("error", (e) => { console.error("ERR", u, e && e.message ? e.message : e); });
  ws.on("close", (code, reason) => { console.log("CLOSE", u, code, reason && reason.toString ? reason.toString() : reason); });
}
urls.forEach(attempt);
