// JobList.jsx

import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

import '../styles/joblist.css'

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("jobs/list/")
      .then(res =>{ setJobs(res.data)
        console.log(res.data)
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <style>{`

      `}</style>

      <div className="ss-wrapper">
        <div className="ss-container">
          <div className="ss-header">
            <h1 className="ss-title">
              <span className="ss-title-icon">💼</span>
              Available Jobs
            </h1>
            <p className="ss-count">{jobs.length} positions found</p>
          </div>

          {jobs.length === 0 ? (
            <div className="ss-empty">
              <div className="ss-empty-icon">🔍</div>
              <h3 className="ss-empty-title">No jobs yet</h3>
              <p className="ss-empty-desc">Check back later or create a new job posting.</p>
            </div>
          ) : (
            <div className="ss-grid">
              {jobs.map(job => (
                <div 
                  key={job.id} 
                  className="ss-card"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <div className="ss-card-header">
                    <h3 className="ss-card-title">{job.title}</h3>
                  </div>
                  <p className="ss-card-company">{job.company}</p>
                  <div className="ss-card-footer">
                    <span className="ss-tag">View Details</span>
                    <button 
                      className="ss-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/jobs/${job.id}`);
                      }}
                    >
                      Apply →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}