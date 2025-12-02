
import React, { useEffect, useState } from "react";
import axios from "axios";
export default function PaymentMethods(){
  const [methods,setMethods]=useState<any[]>([]);
  const [name,setName]=useState(""); const [number,setNumber]=useState(""); const [receiver,setReceiver]=useState("");
  useEffect(()=>{fetchMethods()},[]);
  async function fetchMethods(){
    try{ const r = await axios.get((import.meta.env.VITE_API_BASE||"") + "/api/admin/payment/methods"); setMethods(r.data.methods||[]); }catch(e){console.error(e);}
  }
  async function addMethod(){
    try{
      await axios.post((import.meta.env.VITE_API_BASE||"") + "/api/admin/payment/methods", { name, number, receiver });
      setName(""); setNumber(""); setReceiver(""); fetchMethods();
    }catch(e){console.error(e);}
  }
  return <div>
    <h2>Payment Methods</h2>
    <div className="card">
      <div><input placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/></div>
      <div style={{marginTop:8}}><input placeholder="Number" value={number} onChange={e=>setNumber(e.target.value)}/></div>
      <div style={{marginTop:8}}><input placeholder="Receiver" value={receiver} onChange={e=>setReceiver(e.target.value)}/></div>
      <div style={{marginTop:8}}><button onClick={addMethod}>Add</button></div>
      <div style={{marginTop:12}}>
        {methods.map(m=> <div key={m.id} className="card">{m.name} — ****{m.number_encrypted?.slice(-4)}</div>)}
      </div>
    </div>
  </div>;
}
