import { useEffect, useState } from "react";
import api from "../../../api/axios";
import '../../styles/dashrecruter.css'
import RecruiterNavbar from "../../../jobplatform/pages/recruternav";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav=useNavigate()

  useEffect(() => {
    api.get("jobs/list/")
      .then(res =>{ setJobs(res.data)
        console.log(res.data,'dashrec')

      })

      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
 
    <div className="rd-container">
         <RecruiterNavbar/>
      <div className="rd-wrapper">
        

        <div className="rd-header">
          <div className="rd-title-group">
            <h1>Recruiter Dashboard</h1>
            <p>Manage your active job postings</p>
          </div>
          <button className="rd-btn-primary" onClick={() => nav("/create-job")}>
            <span>+</span> Create Job
          </button>
          
        </div>

    
        {loading ? (
          <div className="rd-loading">Loading your jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="rd-empty">
            <p style={{ margin: '0 0 1rem 0' }}>No jobs posted yet</p>
            <button 
              style={{ background: 'none', border: 'none', color: '#000', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }} 
              onClick={() => window.location.href = "/create-job"}
            >
              Post your first job
            </button>
          </div>
        ) : (
          <div className="rd-grid">
            {jobs.map(job => (
              <div key={job.id} className="rd-card">
                <h3>{job.title}</h3>
                <div className="rd-card-meta">Job ID: #{job.id}</div>
               <button 
  className="rd-btn-secondary" 
  onClick={() => nav(`/jobs/${job.id}/applicants`)}
>
  View Applicants
</button>
   <button
      className= "rd-btn-secondary"
      onClick={async () => {
        if(window.confirm("Are you sure you want to delete this job?")) {
          try {
            await api.delete(`jobs/job/${job.id}/delete/`);
            setJobs(prev => prev.filter(j => j.id !== job.id));
            toast.success('job is deleted')
          } catch (err) {
            console.error(err);
            toast.error("Failed to delete job");
          }
        }
      }}
    >
      Delete Job
    </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}