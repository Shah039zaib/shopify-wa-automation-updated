
import React, { useEffect, useState } from "react";
import axios from "axios";
export default function Dashboard(){
  const [stats,setStats]=useState({leads:0,pendingPayments:0});
  useEffect(()=>{fetchStats()},[]);
  async function fetchStats(){
    try{
      const r = await axios.get((import.meta.env.VITE_API_BASE||"") + "/api/admin/stats");
      setStats(r.data.stats||{leads:0,pendingPayments:0});
    }catch(e){console.error(e);}
  }
  return <div>
    <h2>Dashboard</h2>
    <div className="card">
      <div>Total Leads: {stats.leads}</div>
      <div>Pending Payment Candidates: {stats.pendingPayments}</div>
    </div>
  </div>;
}
