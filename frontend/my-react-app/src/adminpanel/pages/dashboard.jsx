import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../styles/dashboard.css";



export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("admin/dashboard/")
      .then(res => { setStats(res.data); setLoading(false);
        console.log(res.data)
       })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  return (
    <div>
      <div className="dashboard__header">
        <h1 className="dashboard__title">Dashboard</h1>
        <p className="dashboard__subtitle">Welcome back — here's what's happening on SkillSwap.</p>
      </div>

    <div className="stats-grid">
  {loading ? (
    <p>Loading...</p>
  ) : (
    Object.entries(stats).map(([key, value]) => (
      <div className="stat-card" key={key}>
        <p>{key.replace(/_/g, " ").toUpperCase()}</p>
        <h2>{value}</h2>
      </div>
    ))
  )}
</div>
    </div>
  );
}