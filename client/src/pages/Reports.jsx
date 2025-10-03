import React from "react";

export default function Reports() {
  const download = (type) => {
    const url = `http://localhost:4000/api/reports/export?type=${type}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `report.${type === "excel" ? "xlsx" : "pdf"}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      <h2>Reports & Export</h2>
      <div className="card">
        <p className="muted">Generate and download reports.</p>
        <div className="row">
          <button onClick={() => download("excel")} className="btn btn-primary">Download Excel</button>
          <button onClick={() => download("pdf")} className="btn btn-secondary">Download PDF</button>
        </div>
      </div>
    </div>
  );
}
