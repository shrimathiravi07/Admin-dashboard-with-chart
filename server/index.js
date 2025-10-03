import express from "express";
import cors from "cors";
import morgan from "morgan";
import { nanoid } from "nanoid";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/** ----- Seeding ----- **/
const seedUsers = [
  { id: nanoid(), name: "Alice Johnson", email: "alice@example.com", role: "admin" },
  { id: nanoid(), name: "Bob Martin", email: "bob@example.com", role: "manager" },
  { id: nanoid(), name: "Carol Singh", email: "carol@example.com", role: "analyst" },
  { id: nanoid(), name: "David Kim", email: "david@example.com", role: "viewer" },
  { id: nanoid(), name: "Eva Thomas", email: "eva@example.com", role: "manager" },
  { id: nanoid(), name: "Faisal Khan", email: "faisal@example.com", role: "analyst" },
  { id: nanoid(), name: "Grace Lee", email: "grace@example.com", role: "viewer" },
  { id: nanoid(), name: "Hari Prasad", email: "hari@example.com", role: "analyst" },
  { id: nanoid(), name: "Indu Nair", email: "indu@example.com", role: "manager" },
  { id: nanoid(), name: "Jai Verma", email: "jai@example.com", role: "viewer" },
  { id: nanoid(), name: "Kala Devi", email: "kala@example.com", role: "analyst" },
  { id: nanoid(), name: "Leo Mathew", email: "leo@example.com", role: "viewer" }
];

const seedNotifications = [
  { id: nanoid(), type: "info",  message: "Welcome to the Admin Dashboard.", createdAt: Date.now() - 1000 * 60 * 60 },
  { id: nanoid(), type: "info",  message: "Daily sync completed successfully.", createdAt: Date.now() - 1000 * 60 * 30 },
  { id: nanoid(), type: "error", message: "Retry: Minor latency detected in reports.", createdAt: Date.now() - 1000 * 60 * 10 }
];

const seedCharts = (() => {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const line = [65, 72, 58, 90, 84, 76, 88].map((v, i) => ({ label: labels[i], value: v }));
  const bar  = [30, 45, 28, 60, 55, 40, 52].map((v, i) => ({ label: labels[i], value: v }));
  const pie  = [
    { label: "North", value: 32 },
    { label: "South", value: 24 },
    { label: "East",  value: 22 },
    { label: "West",  value: 22 }
  ];
  const donut = [
    { label: "Free",  value: 48 },
    { label: "Basic", value: 30 },
    { label: "Pro",   value: 22 }
  ];
  return { line, bar, pie, donut };
})();

let users = [];
let notifications = [];

function seedData(reset = false) {
  if (reset) {
    users = [];
    notifications = [];
  }
  if (users.length === 0) users = seedUsers.map(u => ({ ...u }));
  if (notifications.length === 0) notifications = seedNotifications.map(n => ({ ...n }));
}
seedData(false);

function computeStats() {
  return {
    totalUsers: users.length,
    activeUsers: Math.min(7, Math.max(1, users.length - 1)),
    revenue: 18250,
    transactions: 236
  };
}

/** ----- Friendly roots ----- **/
app.get("/", (req, res) => {
  res.send("API running. Use /api/... endpoints. React dev runs at http://localhost:5173.");
});
app.get("/api", (req, res) => {
  res.json({
    ok: true,
    users: users.length,
    notifications: notifications.length,
    endpoints: ["/api/stats", "/api/charts", "/api/users", "/api/notifications", "/api/reports/export", "POST /api/seed"]
  });
});

/** ----- Seed endpoint ----- **/
app.post("/api/seed", (req, res) => {
  seedData(true);
  res.json({ ok: true, users: users.length, notifications: notifications.length });
});

/** ----- Stats + Charts (non-empty) ----- **/
app.get("/api/stats", (req, res) => {
  res.json(computeStats());
});

app.get("/api/charts", (req, res) => {
  res.json(seedCharts);
});

/** ----- Users CRUD ----- **/
app.get("/api/users", (req, res) => res.json(users));

app.post("/api/users", (req, res) => {
  const { name, email, role = "viewer" } = req.body || {};
  const u = { id: nanoid(), name, email, role };
  users.push(u);
  notifications.unshift({ id: nanoid(), type: "info", message: `User created: ${name}`, createdAt: Date.now() });
  res.status(201).json(u);
});

app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body || {};
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return res.sendStatus(404);
  users[idx] = { ...users[idx], name, email, role };
  notifications.unshift({ id: nanoid(), type: "info", message: `User updated: ${name}`, createdAt: Date.now() });
  res.json(users[idx]);
});

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return res.sendStatus(404);
  const removed = users.splice(idx, 1)[0];
  notifications.unshift({ id: nanoid(), type: "error", message: `User deleted: ${removed.name}`, createdAt: Date.now() });
  res.json({ ok: true });
});

/** ----- Notifications ----- **/
app.get("/api/notifications", (req, res) => res.json(notifications));

app.post("/api/notifications", (req, res) => {
  const { type = "info", message } = req.body || {};
  const n = { id: nanoid(), type, message, createdAt: Date.now() };
  notifications.unshift(n);
  res.status(201).json(n);
});

/** ----- Reports: Excel + PDF ----- **/
app.get("/api/reports/export", async (req, res) => {
  const type = (req.query.type || "excel").toLowerCase();

  if (type === "excel") {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Users");
    ws.addRow(["ID", "Name", "Email", "Role"]);
    users.forEach(u => ws.addRow([u.id, u.name, u.email, u.role]));
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");
    await wb.xlsx.write(res);
    res.end();
    return;
  }

  if (type === "pdf") {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);
    doc.fontSize(16).text("Users Report", { underline: true });
    doc.moveDown();
    users.forEach(u => doc.fontSize(12).text(`- ${u.name} | ${u.email} | ${u.role}`));
    doc.end();
    return;
  }

  res.status(400).json({ error: "Unsupported type" });
});

/** ----- Start ----- **/
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
