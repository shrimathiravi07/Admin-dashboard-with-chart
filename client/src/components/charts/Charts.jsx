import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#4f46e5", "#22c55e", "#ef4444", "#f59e0b", "#06b6d4"];

export function BarChartBox({ data }) {
  return (
    <div className="card" style={{ height: 320 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Bar Chart</div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LineChartBox({ data }) {
  return (
    <div className="card" style={{ height: 320 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Line Chart</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PieChartBox({ data }) {
  return (
    <div className="card" style={{ height: 320 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Pie Chart</div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" outerRadius={100}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutChartBox({ data }) {
  return (
    <div className="card" style={{ height: 320 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Donut Chart</div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" innerRadius={60} outerRadius={100}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
