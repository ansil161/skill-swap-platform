import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../user/component/navbar";
import JobsSubNavbar from "./jobsubnav";
import '../styles/joblist.css';

export default function JobList() {
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  api.get("jobs/list/")
    .then(res => {
      setJobs(res.data);
      console.log(res.data)
      setLoading(false);
    })
    .catch(err => {
      console.log(err);
      setLoading(false);
    });
}, []);


  const getJobTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'full_time': return '#10b981';
      case 'part_time': return '#f59e0b';
      case 'internship': return '#8b5cf6';
      case 'freelance': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  const getJobTypeText = (type) => {
    const map = {
      'full time': 'Full Time',
      'part time': 'Part Time',
      'internship': 'Internship',
      'freelance': 'Freelance'
    };
    return map[type?.toLowerCase()] || type;
  };

  const parseSkills = (skillsStr) => {
    if (!skillsStr) return [];
    return skillsStr.split(',').map(s => s.trim()).filter(s => s);
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="job-page">
      <Navbar />
      <JobsSubNavbar/>
  
      
      <main className="job-main">
        <div className="job-header">
          <div className="job-header-content">
            <h1 className="job-title">Explore Opportunities</h1>
            <p className="job-subtitle">Find your next career move</p>
          </div>
          <div className="job-stats">
            <span className="job-count">{jobs.length} Jobs Available</span>
          </div>
        </div>

        {loading ? (
          <div className="job-loading">
            <div className="loading-dots">
              <span></span><span></span><span></span>
            </div>
            <p>Fetching opportunities...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="job-empty">
            <div className="empty-illustration">📭</div>
            <h3>No Jobs Posted Yet</h3>
            <p>Be the first to post or check back later</p>
          </div>
        ) : (
          <div className="job-grid">
            {jobs.map(job => {
              const alreadyApplied = job.is_applied
              console.log('alre',alreadyApplied)
              const skills = parseSkills(job.skills_required);
              const daysLeft = getDaysLeft(job.deadline);

              return (
                <article 
                  key={job.id} 
                  className={`job-card ${alreadyApplied ? 'applied' : ''}`}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <div className="job-card-header">
                    <div className="job-type-badge" style={{ 
                      backgroundColor: `${getJobTypeColor(job.job_type)}20`,
                      color: getJobTypeColor(job.job_type)
                    }}>
                      {getJobTypeText(job.job_type)}
                    </div>
                    {daysLeft !== null && daysLeft <= 3 && daysLeft >= 0 && (
                      <span className="urgent-tag">Closing Soon</span>
                    )}
                  </div>

                  <div className="job-card-body">
                    <h3 className="job-title-text">{job.title}</h3>
                    
                    <div className="job-company">
                      <span className="company-icon">🏢</span>
                      {job.company}
                    </div>

                    <div className="job-meta">
                      <div className="meta-item">
                        <span className="meta-icon">📍</span>
                        <span>{job.location}</span>
                      </div>
                      {job.deadline && (
                        <div className="meta-item">
                          <span className="meta-icon">⏰</span>
                          <span className={daysLeft <= 3 ? 'urgent' : ''}>
                            {daysLeft} days left
                          </span>
                        </div>
                      )}
                    </div>

                    {skills.length > 0 && (
                      <div className="job-skills">
                        {skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="skill-pill">{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="job-card-footer">
                    <div className="apply-status">
                      {alreadyApplied ? (
                        <span className="status-badge applied">✓ Applied</span>
                      ) : (
                        <span className="status-badge open">● Open</span>
                      )}
                    </div>
<button
  className="ss-btn"
  disabled={alreadyApplied}
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/jobs/${job.id}/apply`);
  }}
>
  {alreadyApplied ? "Already Applied" : "Apply Now"}
</button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
} 