
import React, { useEffect, useState } from "react";
import axios from "axios";
export default function AISettings(){
  const [key,setKey]=useState("");
  const [category,setCategory]=useState("");
  const [links,setLinks]=useState([]);
  useEffect(()=>{fetchLinks()},[]);
  async function saveKey(){ alert("Put API key into server env (AI_API_KEY) for security."); }
  async function addDemo(){ try{ await axios.post((import.meta.env.VITE_API_BASE||"") + "/api/demo/links", { category, url: links[0] || "" }); fetchLinks(); }catch(e){console.error(e);} }
  async function fetchLinks(){ try{ const r = await axios.get((import.meta.env.VITE_API_BASE||"") + "/api/demo/search?category=all"); console.log(r); }catch(e){console.error(e);} }
  return <div>
    <h2>AI Settings</h2>
    <div className="card">
      <div><small>Note: For security, AI API key must be set in server environment (AI_API_KEY).</small></div>
      <div style={{marginTop:8}}><input placeholder="Demo category" value={category} onChange={e=>setCategory(e.target.value)}/></div>
      <div style={{marginTop:8}}><input placeholder="Demo link (url)" value={links[0]||""} onChange={e=>{const a=[e.target.value]; setLinks(a);}}/></div>
      <div style={{marginTop:8}}><button onClick={addDemo}>Add Demo Link</button></div>
    </div>
  </div>;
}
