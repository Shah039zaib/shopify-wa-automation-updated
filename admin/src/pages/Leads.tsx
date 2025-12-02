
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
export default function Leads(){
  const [leads,setLeads]=useState<any[]>([]);
  useEffect(()=>{fetchLeads()},[]);
  async function fetchLeads(){
    try{
      const r = await axios.get((import.meta.env.VITE_API_BASE||"") + "/api/leads");
      setLeads(r.data.leads||[]);
    }catch(e){console.error(e);}
  }
  async function clearAll(){
    if(!confirm("Clear all leads?")) return;
    try{ await axios.post((import.meta.env.VITE_API_BASE||"") + "/api/leads/clear/all"); fetchLeads(); }catch(e){console.error(e);}
  }
  return <div>
    <h2>Leads</h2>
    <div className="card">
      <button onClick={fetchLeads}>Refresh</button>
      <button onClick={clearAll} style={{marginLeft:8,background:"#ff5a5f"}}>Clear All</button>
      <div style={{marginTop:12}}>
        {leads.map(l=>(
          <div key={l.id} className="card">
            <div><strong>{l.business_name||"—"}</strong> — {l.phone}</div>
            <div>Status: {l.status}</div>
            <div style={{marginTop:8}}>
              <Link to={"/leads/"+l.id}><button>Open</button></Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>;
}
