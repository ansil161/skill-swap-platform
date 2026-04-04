import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../styles/dashboard.css"; 

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);


  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [recruiters, setRecruiters] = useState([]);

  useEffect(() => {
    
    api.get("admin/dashboard/")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

  
    api.get("admin/users/")
      .then((res) => {
       
        const recs = res.data.filter((u) => u.role === "recruiter");
        setRecruiters(recs);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCreateRecruiter = async (e) => {
    e.preventDefault();
    setCreating(true);
    setMessage("");

    try {
      const res = await api.post("admin/create-recruiter/", {
        username,
        email,
        password,
        role: "recruiter",
      });
      setMessage(res.data.message);

      setRecruiters((prev) => [...prev, { username, email, role: "recruiter" }]);

      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setMessage(
        err.response?.data?.role || err.response?.data?.email || err.message
      );
    }

    setCreating(false);
  };

  return (
    <div className="dashboard-container">
    
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back — here's what's happening on SkillSwap.
          </p>
        </div>
      </header>


      <section className="stats-section">
        {loading ? (
          <div className="stats-loading">Loading stats...</div>
        ) : (
          <div className="stats-grid">
            {Object.entries(stats).map(([key, value]) => (
              <div className="stat-card" key={key}>
                <span className="stat-label">
                  {key.replace(/_/g, " ").toLowerCase()}
                </span>
                <span className="stat-value">{value}</span>
              </div>
            ))}
          </div>
        )}
      </section>

     
      <section className="card create-recruiter-card">
        <div className="card-header">
          <h2>Create Recruiter</h2>
        </div>
        <div className="card-body">
          {message && (
            <div className={`alert ${message.toLowerCase().includes('error') || message.toLowerCase().includes('invalid') ? 'alert-error' : 'alert-success'}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleCreateRecruiter} className="form-grid">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" disabled={creating} className="btn btn-primary">
                {creating ? "Creating..." : "Create Recruiter"}
              </button>
            </div>
          </form>
        </div>
      </section>

    
      <section className="card">
        <div className="card-header">
          <h2>Existing Recruiters</h2>
        </div>
        <div className="card-body">
          {recruiters.length === 0 ? (
            <p className="text-empty">No recruiters found.</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {recruiters.map((r, index) => (
                    <tr key={index}>
                      <td className="font-medium">{r.username}</td>
                      <td>{r.email}</td>
                      <td>
                        <span className="role-badge">{r.role}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}