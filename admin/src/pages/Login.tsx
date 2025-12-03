// admin/src/pages/Login.tsx  (debug version)
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_BASE || "";

export default function Login() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await axios.post(`${API}/api/admin/auth/login`, { password }, { withCredentials: true, timeout: 8000 });
      if (res.data?.ok) {
        navigate("/", { replace: true });
      } else {
        setErr(JSON.stringify(res.data || "Unknown response"));
      }
    } catch (error: any) {
      // Detailed debug info
      if (error.response) {
        // response received but server returned error
        setErr(`Response error: ${error.response.status} ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // request made but no response (network / CORS / blocked)
        setErr(`No response from server. Possible network/CORS issue. error.request exists.`);
      } else {
        setErr(`Axios error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 24 }}>
      <h2>Admin Login</h2>
      <form onSubmit={submit}>
        <div><label>Password</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} style={{width:"100%",padding:8}} /></div>
        {err && <div style={{color:"red",marginTop:8,whiteSpace:"pre-wrap"}}>{err}</div>}
        <button type="submit" style={{marginTop:12}} disabled={loading}>{loading? "Please wait..." : "Login"}</button>
      </form>
      <div style={{marginTop:12, fontSize:12, color:"#666"}}>API: {API || "<EMPTY>"}</div>
    </div>
  );
}
