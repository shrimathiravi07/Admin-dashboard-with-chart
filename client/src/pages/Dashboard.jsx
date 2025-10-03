import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/apiClient";
import StatCard from "../components/StatCard";
import { BarChartBox, LineChartBox, PieChartBox, DonutChartBox } from "../components/charts/Charts";

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const range = searchParams.get("range") ?? "7d";
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, revenue: 0, transactions: 0 });
  const [series, setSeries] = useState({ line: [], bar: [], pie: [], donut: [] });

  const load = async () => {
    const [s, c] = await Promise.all([api.get("/stats"), api.get(`/charts?range=${range}`)]);
    setStats(s.data); setSeries(c.data);
  };

  useEffect(() => { load(); }, [range]);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div className="row" style={{ alignItems: "center" }}>
          <label className="muted">Range</label>
          <select value={range} onChange={e => setSearchParams({ range: e.target.value })}>
            <option value="7d">Last 7 days</option>
            <option value="14d">Last 14 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={load}>Refresh</button>
      </div>

      <div className="grid grid-4">
        <StatCard title="Total Users" value={stats.totalUsers} hint="All registered" />
        <StatCard title="Active Users" value={stats.activeUsers} hint="Last 24h" />
        <StatCard title="Revenue" value={`₹${stats.revenue}`} hint="Today" />
        <StatCard title="Transactions" value={stats.transactions} hint="Today" />
      </div>

      <div className="grid grid-2">
        <BarChartBox data={series.bar} />
        <LineChartBox data={series.line} />
        <PieChartBox data={series.pie} />
        <DonutChartBox data={series.donut} />
      </div>
    </div>
  );
}
