import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

import '../styles/recruterjob.css'

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("jobs/my/")
      .then(res => setJobs(res.data));
  }, []);

  return (
    <>


      <div className="ss-wrapper">
        <div className="ss-container">
          <div className="ss-header">
            <h1 className="ss-title">
              <span className="ss-title-icon">📋</span>
              My Jobs
            </h1>
            <span className="ss-count">{jobs.length}</span>
          </div>

          {jobs.length === 0 ? (
            <div className="ss-empty">
              <div className="ss-empty-icon">📭</div>
              <h3 className="ss-empty-title">No jobs posted yet</h3>
              <p className="ss-empty-desc">Create your first job posting to start receiving applicants.</p>
            </div>
          ) : (
            <div className="ss-list">
              {jobs.map(job => (
                <div 
                  key={job.id} 
                  className="ss-card"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <div className="ss-card-content">
                    <h3 className="ss-card-title">{job.title}</h3>
                    <div className="ss-card-meta">
                      <span className="ss-card-meta-item">Active</span>
                      <span className="ss-card-meta-item">View Details</span>
                    </div>
                  </div>
                  <button 
                    className="ss-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/jobs/${job.id}/applicants`);
                    }}
                  >
                    View Applicants →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}