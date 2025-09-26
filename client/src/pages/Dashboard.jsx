// client/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { api } from "../services/apiClient";
import StatCard from "../components/StatCard";
import { BarChartBox, LineChartBox, PieChartBox, DonutChartBox } from "../components/charts/Charts";

const DEFAULT_STATS = { totalUsers: 12, activeUsers: 7, revenue: 18250, transactions: 236 };
const DEFAULT_SERIES = {
  line:  ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((l,i)=>({ label:l, value:[65,72,58,90,84,76,88][i] })),
  bar:   ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((l,i)=>({ label:l, value:[30,45,28,60,55,40,52][i] })),
  pie:   [{ label:"North", value:32 },{ label:"South", value:24 },{ label:"East", value:22 },{ label:"West", value:22 }],
  donut: [{ label:"Free", value:48 },{ label:"Basic", value:30 },{ label:"Pro", value:22 }]
};

export default function Dashboard() {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [series, setSeries] = useState(DEFAULT_SERIES);

  const load = async () => {
    try {
      const [s, c] = await Promise.all([api.get("/stats"), api.get("/charts")]);
      const gotSeries = c.data || DEFAULT_SERIES;
      const isEmptyCharts = !gotSeries.line?.length || !gotSeries.bar?.length || !gotSeries.pie?.length || !gotSeries.donut?.length;
      if (isEmptyCharts) {
        await api.post("/seed");
        const [s2, c2] = await Promise.all([api.get("/stats"), api.get("/charts")]);
        setStats(s2.data || DEFAULT_STATS);
        setSeries(c2.data || DEFAULT_SERIES);
      } else {
        setStats(s.data || DEFAULT_STATS);
        setSeries(gotSeries);
      }
    } catch {
      setStats(DEFAULT_STATS);
      setSeries(DEFAULT_SERIES);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="grid grid-4">
        <StatCard title="Total Users" value={stats.totalUsers} hint="All registered users" />
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
