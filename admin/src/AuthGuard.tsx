import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE || "";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await axios.get(`${API}/api/admin/leads`, { withCredentials: true, timeout: 5000 });
        setOk(true);
      } catch (e) {
        setOk(false);
      }
    })();
  }, []);

  if (ok === null) return <div>Checking session...</div>;
  if (!ok) {
    // redirect to login
    window.location.href = "/login";
    return null;
  }
  return <>{children}</>;
}
