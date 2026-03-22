
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get("admin/dashboard/")
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: "20px" }}>
        <Card title="Users" value={stats.total_users} />
        <Card title="Swaps" value={stats.total_swaps} />
        <Card title="Accepted" value={stats.accepted_swaps} />
        <Card title="Sessions" value={stats.total_sessions} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ padding: "20px", background: "#eee", borderRadius: "10px" }}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}