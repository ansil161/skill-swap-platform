

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

import '../styles/jobdeatail.css'

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`jobs/${id}/`)
      .then(res => setJob(res.data));
  }, [id]);

  if (!job) return <p>Loading...</p>;
  console.log(job)

  return (
    <>
      

      <div className="ss-wrapper">
        <div className="ss-container">
          <div className="ss-card">
            <span className="ss-badge">Open Position</span>
            
            <h1 className="ss-title">{job.title}</h1>
            
            <div className="ss-company">
              <div className="ss-company-icon">
                {job.company?.charAt(0)?.toUpperCase() }
              </div>
              {job.company}
            </div>

            <div className="ss-meta">
              <span className="ss-meta-item">{job.job_type}</span>
             
            </div>

            <h2 className="ss-section-title">About the Role</h2>
            <p className="ss-description">{job.description}</p>

            <button className="ss-btn" onClick={() => navigate(`/jobs/${id}/apply`)}>
              Apply Now
              <span className="ss-btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}