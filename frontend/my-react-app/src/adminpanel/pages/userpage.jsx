import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../styles/table.css";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate=useNavigate()

  useEffect(() => {
    api.get("admin/users/")
      .then(res => { setUsers(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name = "") =>
    name.slice(0, 2).toUpperCase() || "?";

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">Users</h2>
          <p className="page-header__subtitle">{users.length} registered users</p>
        </div>
      </div>

      <div className="data-card">
        <div className="data-card__toolbar">
          <div className="search-input">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">👤</div>
            <p>No users found.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Swaps</th>
              </tr>
            </thead>
       <tbody>
  {filtered.map(u => (
    <tr key={u.id} onClick={() => navigate(`/skill/userdetail/${u.id}`)} style={{ cursor: "pointer" }}>
      <td>
        <div className="user-cell">
          <div className="user-cell__avatar">{initials(u.username)}</div>
          <div className="user-cell__name">{u.username}</div>
        </div>
      </td>
      <td style={{ color: "var(--text-secondary)" }}>{u.email}</td>
      <td>
        <span className="rating">★ {u.rating ?? "—"}</span>
      </td>
      <td>{u.swap_count ?? 0}</td>
    </tr>
  ))}
</tbody>
          </table>
        )}

        <div className="data-card__footer">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>
    </div>
  );
}