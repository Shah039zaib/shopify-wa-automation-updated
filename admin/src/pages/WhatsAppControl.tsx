
import React, { useEffect, useState } from "react";
import axios from "axios";
export default function WhatsAppControl(){
  const [session, setSession] = useState<any>(null);
  useEffect(()=>{fetchSession()},[]);
  async function fetchSession(){
    try{ const r = await axios.get((import.meta.env.VITE_API_BASE||"") + "/api/session"); setSession(r.data.session); }catch(e){console.error(e);}
  }
  async function clearSession(){
    if(!confirm("Clear remote sessions?")) return;
    try{ await axios.post((import.meta.env.VITE_API_BASE||"") + "/api/admin/demo/clear"); fetchSession(); }catch(e){console.error(e);}
  }
  return <div>
    <h2>WhatsApp Control</h2>
    <div className="card">
      <div>Remote session enabled: {process.env.ALLOW_REMOTE_SESSION}</div>
      <div>Latest session: {session ? "Exists" : "No session"}</div>
      <div style={{marginTop:8}}><button onClick={fetchSession}>Refresh</button> <button onClick={clearSession} style={{background:"#ff5a5f"}}>Clear Demo Links</button></div>
    </div>
  </div>;
}
