// client/src/pages/Users.jsx
import React, { useEffect, useState } from "react";
import { api } from "../services/apiClient";

const empty = { name: "", email: "", role: "viewer" };

export default function Users() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const role = localStorage.getItem("role");
  const canManage = role === "admin";

  const load = async () => {
    try {
      let res = await api.get("/users");
      if (!Array.isArray(res.data) || res.data.length === 0) {
        await api.post("/seed");
        res = await api.get("/users");
      }
      setList(res.data);
    } catch {
      // fallback if API unreachable
      setList([
        { id: "local-1", name: "Demo User", email: "demo@example.com", role: "viewer" }
      ]);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/users/${editing}`, form);
    } else {
      await api.post("/users", form);
    }
    setForm(empty);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    await api.delete(`/users/${id}`);
    load();
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h2>User Management</h2>
        {canManage && (
          <button onClick={() => { setForm(empty); setEditing(null); }} className="btn btn-primary">
            New User
          </button>
        )}
      </div>

      {canManage && (
        <form onSubmit={submit} className="card">
          <div className="row">
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="viewer">viewer</option>
              <option value="analyst">analyst</option>
              <option value="manager">manager</option>
              <option value="admin">admin</option>
            </select>
            <div className="row">
              <button className="btn btn-primary" type="submit">{editing ? "Update" : "Create"}</button>
              {editing && <button type="button" className="btn" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}
            </div>
          </div>
        </form>
      )}

      <div className="card" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {list.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  {canManage ? (
                    <div className="row">
                      <button className="btn" onClick={() => { setEditing(u.id); setForm({ name: u.name, email: u.email, role: u.role }); }}>Edit</button>
                      <button className="btn btn-danger" onClick={() => remove(u.id)}>Delete</button>
                    </div>
                  ) : <span className="muted">No access</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
