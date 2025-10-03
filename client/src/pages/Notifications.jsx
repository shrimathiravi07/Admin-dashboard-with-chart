import React, { useEffect, useState } from "react";
import { api } from "../services/apiClient";

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);

  const load = async () => {
    const res = await api.get("/notifications");
    setNotifs(res.data);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <h2>Notifications</h2>
      <div className="grid" style={{ gap: 8 }}>
        {notifs.map(n => (
          <div key={n.id} className={`alert ${n.type === "error" ? "error" : "info"}`}>
            <div>{n.message}</div>
            <div className="muted">{new Date(n.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
