
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
export default function LeadDetail(){
  const {id} = useParams();
  const [lead,setLead]=useState<any>(null);
  useEffect(()=>{fetchLead()},[]);
  async function fetchLead(){
    try{
      const r = await axios.get((import.meta.env.VITE_API_BASE||"") + "/api/leads/" + id);
      setLead(r.data.lead);
    }catch(e){console.error(e);}
  }
  async function setStatus(status){
    try{ await axios.put((import.meta.env.VITE_API_BASE||"") + "/api/leads/" + id + "/status", { status }); fetchLead(); }catch(e){console.error(e);}
  }
  return <div>
    <h2>Lead Detail</h2>
    {lead ? <div className="card">
      <div><strong>{lead.business_name}</strong></div>
      <div>Phone: {lead.phone}</div>
      <div>Status: {lead.status}</div>
      <div style={{marginTop:8}}>
        <button onClick={()=>setStatus("in_progress")}>In Progress</button>
        <button onClick={()=>setStatus("packaged")}>Packaged</button>
        <button onClick={()=>setStatus("advance_paid")}>Advance Paid</button>
      </div>
    </div> : <div>Loading...</div>}
  </div>;
}
