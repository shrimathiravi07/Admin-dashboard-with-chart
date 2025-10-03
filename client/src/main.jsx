import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Link, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import Reports from "./pages/Reports.jsx";
import Notifications from "./pages/Notifications.jsx";
import "./index.css";

if (!localStorage.getItem("role")) localStorage.setItem("role", "admin");

function Layout() {
  return (
    <div className="layout">
      <aside className="aside">
        <div style={{ padding: 16, fontWeight: 600 }}>Admin Dashboard</div>
        <nav className="nav" style={{ padding: 12 }}>
          <Link to="/">Dashboard</Link>
          <Link to="/users">Users</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/notifications">Notifications</Link>
        </nav>
      </aside>
      <main className="main">
        <header className="top">
          <div>Dashboard</div>
          <div className="muted">Role: {localStorage.getItem("role")}</div>
        </header>
        <div className="content">
          <Outlet />
        </div>
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
