// admin/src/pages/Login.tsx
import React, { useState } from "react";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // POST to server login endpoint - server should set HTTP-only cookie
      const res = await api.post("/api/admin/login", { email, password });
      if (res.data?.ok) {
        // redirect to dashboard
        window.location.href = "/";
      } else {
        setError(res.data?.error || "Login failed");
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Login error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{maxWidth:420, margin:"40px auto", padding:20, borderRadius:8, boxShadow:"0 6px 20px rgba(0,0,0,0.06)"}}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:10}}>
          <label>Email</label><br />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={{width:"100%", padding:8}} />
        </div>
        <div style={{marginBottom:10}}>
          <label>Password</label><br />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" style={{width:"100%", padding:8}} />
        </div>
        {error && <div style={{color:"crimson", marginBottom:10}}>{error}</div>}
        <button type="submit" disabled={loading} style={{padding:"10px 20px"}}>{loading ? "Please wait…" : "Login"}</button>
      </form>
    </div>
  );
}
