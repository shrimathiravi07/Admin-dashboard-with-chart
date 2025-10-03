import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Link, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import Reports from "./pages/Reports.jsx";
import Notifications from "./pages/Notifications.jsx";
import "./index.css";

if (!localStorage.getItem("role")) localStorage.setItem("role", "admin");

function useHealth() {
  const [ok, setOk] = React.useState(true);
  React.useEffect(() => {
    let cancel = false;
    const tick = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/health", { cache: "no-store" });
        if (!cancel) setOk(res.ok);
      } catch {
        if (!cancel) setOk(false);
      }
    };
    tick();
    const id = setInterval(tick, 20000);
    return () => { cancel = true; clearInterval(id); };
  }, []);
  return ok;
}

const Icons = {
  dashboard: (<svg viewBox="0 0 24 24" width="16" height="16"><path d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z" fill="currentColor"/></svg>),
  users: (<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-7 9a7 7 0 0 1 14 0z" fill="currentColor"/></svg>),
  reports: (<svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 3h14v18H5z M8 7h8 M8 11h8 M8 15h5" stroke="currentColor" fill="none"/></svg>),
  bell: (<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11a6 6 0 0 0-12 0v5l-2 2h16z" fill="currentColor"/></svg>)
};

function StatusDot({ ok }) {
  const color = ok ? "#16a34a" : "#dc2626";
  const text = ok ? "API: Online" : "API: Offline";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 10, height: 10, borderRadius: 999, background: color }} />
      <span className="muted">{text}</span>
    </span>
  );
}

function Layout() {
  const ok = useHealth();
  return (
    <div className="layout">
      <aside className="aside">
        <div style={{ padding: 16, fontWeight: 600 }}>Admin Dashboard</div>
        <nav className="nav" style={{ padding: 12 }}>
          <Link to="/"><span aria-hidden>{Icons.dashboard}</span><span>Dashboard</span></Link>
          <Link to="/users"><span aria-hidden>{Icons.users}</span><span>Users</span></Link>
          <Link to="/reports"><span aria-hidden>{Icons.reports}</span><span>Reports</span></Link>
          <Link to="/notifications"><span aria-hidden>{Icons.bell}</span><span>Notifications</span></Link>
        </nav>
      </aside>
      <main className="main">
        <header className="top">
          <div>Phase 3/4</div>
          <StatusDot ok={ok} />
        </header>
        <div className="content"><Outlet /></div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
