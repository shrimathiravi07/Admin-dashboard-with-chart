import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/apiClient";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const load = async () => { const res = await api.get("/notifications"); setItems(res.data); };
  useEffect(() => { load(); const id = setInterval(load, 10000); return () => clearInterval(id); }, []);

  const filtered = items.filter(n => {
    const t = q.toLowerCase(); return n.message.toLowerCase().includes(t) || n.type.toLowerCase().includes(t);
  });

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <input placeholder="Search message/type" value={q} onChange={e => setSearchParams({ q: e.target.value })} style={{ flex: 1, maxWidth: 360 }} />
      </div>
      <div className="grid" style={{ gap: 8 }}>
        {filtered.map(n => (
          <div key={n.id} className={`alert ${n.type === "error" ? "error" : "info"}`}>
            <div>{n.message}</div>
            <div className="muted">{new Date(n.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
