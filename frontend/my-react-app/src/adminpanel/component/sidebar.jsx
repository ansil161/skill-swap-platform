
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{ width: "220px", background: "#111", color: "#fff", height: "100vh", padding: "20px" }}>
      <h2>Admin</h2>

      <nav>
        <p><Link to="/admin">Dashboard</Link></p>
        <p><Link to="/admin/users">Users</Link></p>
        <p><Link to="/admin/swaps">Swaps</Link></p>
        <p><Link to="/admin/sessions">Sessions</Link></p>
      </nav>
    </div>
  );
}