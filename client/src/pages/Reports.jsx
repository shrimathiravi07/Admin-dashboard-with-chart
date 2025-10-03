import React from "react";
import { useSearchParams } from "react-router-dom";

export default function Reports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const reports = []; // optional: populate if maintaining history

  const filtered = reports.filter(r => {
    const t = q.toLowerCase(); return r.name.toLowerCase().includes(t) || r.type.toLowerCase().includes(t);
  });

  const download = (type) => {
    const url = `http://localhost:4000/api/reports/export?type=${type}`;
    const a = document.createElement("a"); a.href = url; a.download = `report.${type === "excel" ? "xlsx" : "pdf"}`;
    document.body.appendChild(a); a.click(); a.remove();
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h2>Reports & Export</h2>
        <input placeholder="Search reports" value={q} onChange={e => setSearchParams({ q: e.target.value })} style={{ maxWidth: 300 }} />
      </div>
      <div className="card">
        <p className="muted">Generate and download reports.</p>
        <div className="row">
          <button onClick={() => download("excel")} className="btn btn-primary">Download Excel</button>
          <button onClick={() => download("pdf")} className="btn btn-secondary">Download PDF</button>
        </div>
      </div>

      {/* Optional: render filtered list if reports are tracked */}
    </div>
  );
}
