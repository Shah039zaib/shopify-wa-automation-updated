import React, { useEffect, useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_BASE || "";

export default function AuthGuard({ children }: any) {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(()=>{ axios.get(`${API}/api/admin/me`, { withCredentials:true }).then(res=> setOk(Boolean(res.data?.ok))).catch(()=>setOk(false)); },[]);
  if (ok === null) return <div>Checking...</div>;
  if (!ok) { window.location.href = "/login"; return null; }
  return children;
}
