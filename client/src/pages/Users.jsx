import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/apiClient";
import JiggleButton from "../components/JiggleButton";

export default function Users() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", role: "viewer" });
  const [editing, setEditing] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const role = localStorage.getItem("role");
  const canManage = role === "admin";

  const load = async () => {
    const res = await api.get("/users");
    setList(res.data);
  };
  useEffect(() => { load(); }, []);

  const filtered = list.filter(u => {
    const t = q.toLowerCase();
    return u.name.toLowerCase().includes(t) || u.email.toLowerCase().includes(t) || u.role.toLowerCase().includes(t);
  });

  const submit = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/users/${editing}`, form);
    } else {
      await api.post("/users", form);
    }
    setForm({ name: "", email: "", role: "viewer" });
    setEditing(null);
    load();
  };

  const remove = async (id) => { await api.delete(`/users/${id}`); load(); };

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <input
          placeholder="Search name, email, role"
          value={q}
          onChange={e => setSearchParams({ q: e.target.value })}
          style={{ flex: 1, maxWidth: 360 }}
        />
        {canManage && (
          <JiggleButton onClick={() => { setForm({ name: "", email: "", role: "viewer" }); setEditing(null); }}>
            New User
          </JiggleButton>
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
            <JiggleButton type="submit">{editing ? "Update" : "Create"}</JiggleButton>
            {editing && <button type="button" className="btn" onClick={() => { setEditing(null); setForm({ name: "", email: "", role: "viewer" }); }}>Cancel</button>}
          </div>
        </form>
      )}

      <div className="card" style={{ overflowX: "auto" }}>
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
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
