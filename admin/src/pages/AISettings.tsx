// admin/src/pages/AISettings.tsx
import React, { useEffect, useState } from "react";
import { fetchQr, fetchBotStatus } from "../services/bot";

export default function AISettings(){
  const [qr, setQr] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadStatus() {
    try {
      const s = await fetchBotStatus();
      setStatus(s?.status || JSON.stringify(s));
    } catch (e) {
      console.warn("fetchBotStatus failed", e);
      setStatus("unknown");
    }
  }

  async function loadQr() {
    setLoading(true);
    try {
      const r = await fetchQr();
      if (r?.ok && r?.qr) {
        setQr(r.qr);
      } else {
        setQr(null);
      }
    } catch (e) {
      console.warn("fetchQr failed", e);
      setQr(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=> {
    loadStatus();
    loadQr();
    // optionally poll QR every 10s when not connected
    const t = setInterval(()=> loadQr(), 10000);
    return ()=> clearInterval(t);
  },[]);

  return (
    <div style={{padding:20}}>
      <h2>WhatsApp / Bot</h2>
      <div style={{marginBottom:12}}>Status: <strong>{status || "loading..."}</strong></div>

      <div style={{marginBottom:12}}>
        {qr ? (
          <div>
            <div style={{marginBottom:8}}>Scan QR from your phone:</div>
            {/* Use public QR image generator for quick rendering */}
            <img
              alt="Bot QR"
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=300x300`}
              style={{border:"1px solid #ddd", borderRadius:6}}
            />
            <div style={{marginTop:8, fontSize:12, color:"#666"}}>If QR looks broken, click "Refresh".</div>
          </div>
        ) : (
          <div>
            <p>{loading ? "Checking for QR…" : "No QR present right now."}</p>
            <button onClick={loadQr} style={{padding:"8px 12px"}}>Refresh QR</button>
          </div>
        )}
      </div>
    </div>
  );
}
