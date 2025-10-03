// 1) Imports
import express from "express";
import cors from "cors";
import morgan from "morgan";

// 2) Create app FIRST
const app = express();

// 3) Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// 4) Routes (put ALL your routes below this line)

// Health
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptimeSec: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Example stats route (replace with your real handler)
app.get("/api/stats", (req, res) => {
  res.json({ totalUsers: 1248, activeUsers: 317, revenue: 185250, transactions: 2360 });
});

// Example charts route (replace with your real handler)
app.get("/api/charts", (req, res) => {
  res.json({
    range: "7d",
    line: [{ label: "D1", value: 78 }, { label: "D2", value: 92 }],
    bar: [{ label: "D1", value: 42 }, { label: "D2", value: 58 }],
    pie: [{ label: "North", value: 34 }, { label: "South", value: 23 }, { label: "East", value: 21 }, { label: "West", value: 22 }],
    donut: [{ label: "Free", value: 52 }, { label: "Basic", value: 28 }, { label: "Pro", value: 20 }]
  });
});

// Keep adding: /api/users, /api/notifications, /api/reports/export, etc.

// 5) Start server LAST
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
