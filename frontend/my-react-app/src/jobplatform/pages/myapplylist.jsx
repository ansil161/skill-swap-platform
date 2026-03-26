import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../user/component/navbar";
import '../styles/myapplylist.css'
import JobsSubNavbar from "./jobsubnav";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("jobs/my-application/")
      .then(res => setApplications(res.data))

      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      case 'reviewed': return 'status-reviewed';
      default: return 'status-pending';
    }
  };

  return (
    <div className="app-page">
      <Navbar />
      <JobsSubNavbar/>
      
      <main className="app-main">
        <div className="app-header">
          <h1 className="app-title">My Applications</h1>
          <p className="app-subtitle">Track the status of your job searches</p>
        </div>

        {loading ? (
          <div className="app-loading">
            <div className="loading-spinner"></div>
            <p>Loading your history...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="app-empty">
            <div className="empty-icon">📁</div>
            <h3>No applications yet</h3>
            <p>Start your journey by applying to available jobs!</p>
          </div>
        ) : (
          <div className="app-grid">
            {applications.map(app => (
              <div key={app.id} className="app-card">
                <div className="app-card-header">
                  <span className={`app-status-badge ${getStatusClass(app.status)}`}>
                    {app.status || 'Pending'}
                  </span>
                  <span className="app-date">{new Date(app.applied_at).toLocaleDateString()}</span>
                </div>

                <div className="app-card-body">
                  <h3 className="app-job-title">{app.job_title}</h3>
                  <div className="app-company">
                    <span className="icon">🏢</span> {app.company}
                  </div>
                </div>

                <div className="app-card-footer">
                  <div className="app-resume">
                    <span className="icon">📄</span> My_Resume.pdf
                  </div>

                  <button className="view-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}