import React, { useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_BASE || "";

export default function Login() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      const res = await axios.post(`${API}/api/admin/auth/login`, { password }, { withCredentials: true });
      if (res.data?.ok) { window.location.href = "/"; } else setErr(res.data?.error || "Login failed");
    } catch (e: any) { setErr(e.response?.data?.error || e.message || "Network error"); } finally { setLoading(false); }
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,.08)" }}>
      <h2>Admin Login</h2>
      <form onSubmit={submit}>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} style={{width:"100%",padding:8}} />
        </div>
        {err && <div style={{color:"red",marginTop:8}}>{err}</div>}
        <button type="submit" style={{marginTop:12}} disabled={loading}>{loading? "Please wait..." : "Login"}</button>
      </form>
    </div>
  );
}
