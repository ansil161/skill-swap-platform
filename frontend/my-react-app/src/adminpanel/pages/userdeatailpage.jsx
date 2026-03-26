import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../styles/userdeatail.css"; 

export default function UserDetail() {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api.get(`admin/userdeatail/${user_id}/`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user_id]);

  const toggleStatus = () => {
    if (!user) return;

    setUpdating(true);
    const newStatus = !user.user_active;
    api.patch(`admin/userdeatail/${user_id}/`, { status: newStatus })
      .then((res) => {
        setUser((prev) => ({ ...prev, user_active: newStatus }));
        setUpdating(false);
      })
      .catch((err) => {
        console.error(err);
        setUpdating(false);
      });
  };

  if (loading) return <div className="empty-state">Loading user details…</div>;
  if (!user) return <div className="empty-state">User not found.</div>;

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <button onClick={() => navigate(-1)} className="btn btn-back">
          ← Back
        </button>
        <h1>User Details</h1>
      </div>

      {/* User Info Card */}
      <div className="card user-profile-card">
        <div className="card-header">
          <h2>{user.username}</h2>
          <span className={`status-badge ${user.user_active ? "active" : "inactive"}`}>
            {user.user_active ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="card-body">
          <div className="info-grid">
            <div className="info-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className="info-item">
              <label>Rating</label>
              <p>{user.rating ?? "—"}</p>
            </div>
          </div>
          
          <div className="action-bar">
            <button
              onClick={toggleStatus}
              disabled={updating}
              className={`btn btn-toggle ${user.user_active ? "btn-danger" : "btn-success"}`}
            >
              {updating ? "Processing..." : user.user_active ? "Deactivate User" : "Activate User"}
            </button>
          </div>
        </div>
      </div>

      {/* Sessions Table Card */}
      <div className="card">
        <div className="card-header">
          <h3>Sessions</h3>
        </div>
        <div className="card-body">
          {user.sessions.length === 0 ? (
            <p className="text-muted">No sessions found.</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Mentor</th>
                    <th>Learner</th>
                    <th>Status</th>
                    <th>Scheduled Time</th>
                  </tr>
                </thead>
                <tbody>
                  {user.sessions.map((s) => (
                    <tr key={s.id}>
                      <td><span className="role-tag">{s.role}</span></td>
                      <td>{s.mentor}</td>
                      <td>{s.learner}</td>
                      <td>{s.status}</td>
                      <td>{new Date(s.scheduled_time).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Swap Requests Table Card */}
      <div className="card">
        <div className="card-header">
          <h3>Swap Requests</h3>
        </div>
        <div className="card-body">
          {user.swaps.length === 0 ? (
            <p className="text-muted">No swaps found.</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Requester</th>
                    <th>Provider</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {user.swaps.map((s) => (
                    <tr key={s.id}>
                      <td><span className="role-tag">{s.role}</span></td>
                      <td>{s.requester}</td>
                      <td>{s.provider}</td>
                      <td>{s.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}