
import React, { useEffect, useState } from "react";
import axios from "axios";
export default function PaymentCandidates(){
  const [candidates,setCandidates]=useState<any[]>([]);
  useEffect(()=>{fetch()},[]);
  async function fetch(){
    try{ const r = await axios.get((import.meta.env.VITE_API_BASE||"") + "/api/payment/candidates"); setCandidates(r.data.candidates||[]); }catch(e){console.error(e);}
  }
  async function confirm(id){ try{ await axios.post((import.meta.env.VITE_API_BASE||"") + `/api/payment/${id}/confirm`); fetch(); }catch(e){console.error(e);} }
  return <div>
    <h2>Payment Candidates</h2>
    <div className="card">
      <button onClick={fetch}>Refresh</button>
      <div style={{marginTop:12}}>
        {candidates.map(c=>(
          <div key={c.id} className="card">
            <div>Client: {c.client_id}</div>
            <div>OCR: {c.ocr_text?.slice(0,200)}</div>
            <div>Confidence: {c.confidence}</div>
            <div><img src={(import.meta.env.VITE_API_BASE||"") + c.screenshot_url} style={{maxWidth:300}}/></div>
            <div style={{marginTop:8}}><button onClick={()=>confirm(c.id)}>Confirm Payment</button></div>
          </div>
        ))}
      </div>
    </div>
  </div>;
}
