export default function StatCard({ title, value, hint }) {
  return (
    <div className="card">
      <div className="muted">{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{value}</div>
      {hint ? <div className="muted" style={{ marginTop: 4 }}>{hint}</div> : null}
    </div>
  );
}
