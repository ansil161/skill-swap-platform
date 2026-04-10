import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../user/component/navbar";

import '../styles/joblist.css';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    api.get("jobs/list/")
      .then(res => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
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
      'full_time': 'Full time',
      'part_time': 'Part time',
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 14) return '1 week ago';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'applied') return job.is_applied;
    return true;
  });

  return (
    <div className="job-page">
      <Navbar />
     
      
      <div className={`layout-container ${selectedJob ? 'panel-open' : ''}`}>
        <main className="job-main">
          <div className="job-header">
            <div className="job-header-content">
              <h1 className="job-title">Explore opportunities</h1>
              <p className="job-subtitle">Find your next career move</p>
            </div>
            <div className="job-stats">
              <span className="job-count">{jobs.length} jobs available</span>
            </div>
          </div>

          <div className="job-filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All jobs
            </button>
            <button 
              className={`filter-btn ${filter === 'applied' ? 'active' : ''}`}
              onClick={() => setFilter('applied')}
            >
              Applied
            </button>
          </div>

          {loading ? (
            <div className="job-loading">
              <div className="loading-dots">
                <span></span><span></span><span></span>
              </div>
              <p>Fetching opportunities...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="job-empty">
              <div className="empty-illustration">📭</div>
              <h3>No Jobs Found</h3>
              <p>{filter === 'applied' ? "You haven't applied to any jobs yet" : "No jobs posted yet"}</p>
            </div>
          ) : (
            <div className="job-grid">
              {filteredJobs.map(job => {
                const alreadyApplied = job.is_applied;
                const skills = parseSkills(job.skills_required);
                const daysLeft = getDaysLeft(job.deadline);
                const isSelected = selectedJob?.id === job.id;

                return (
                  <article 
                    key={job.id} 
                    className={`job-card ${alreadyApplied ? 'applied' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="job-card-header">
                      <div className="job-type-badge" style={{ 
                        backgroundColor: `${getJobTypeColor(job.job_type)}15`,
                        color: getJobTypeColor(job.job_type)
                      }}>
                        {getJobTypeText(job.job_type)}
                      </div>
                      {daysLeft !== null && daysLeft <= 7 && daysLeft >= 0 && (
                        <span className={`days-left ${daysLeft <= 3 ? 'urgent' : ''}`}>
                          • {daysLeft} days left
                        </span>
                      )}
                    </div>

                    <div className="job-card-body">
                      <div className="company-logo">
                        <span className="logo-placeholder">🏢</span>
                      </div>
                      <div className="company-info">
                        <h3 className="job-title-text">{job.title}</h3>
                        <p className="company-name">{job.company}</p>
                      </div>
                      <div className="job-location">
                        <span className="location-icon">📍</span>
                        <span>{job.location || 'Remote'}</span>
                      </div>
                      {skills.length > 0 && (
                        <div className="job-skills-preview">
                          {skills.slice(0, 3).map((skill, i) => (
                            <span key={i} className="skill-tag">{skill}</span>
                          ))}
                          {skills.length > 3 && (
                            <span className="skill-more">+{skills.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="job-card-footer">
                      <div className="apply-status">
                        {alreadyApplied ? (
                          <span className="status-text applied">✓ Applied</span>
                        ) : (
                          <span className="status-text open">Open</span>
                        )}
                      </div>
                      <button className={`apply-btn ${alreadyApplied ? 'applied' : ''}`}>
                        {alreadyApplied ? 'Already applied' : 'Apply now'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>

     
        <aside className={`job-details-panel ${selectedJob ? 'open' : ''}`}>
          {selectedJob && (
            <div className="panel-inner">
              <button className="close-btn" onClick={() => setSelectedJob(null)}>✕</button>
              
              <header className="panel-header">
                <h2 className="panel-job-title">{selectedJob.title}</h2>
                <div className="panel-company-info">
                  <div className="panel-company-logo">🏢</div>
                  <div>
                    <p className="panel-company-name">{selectedJob.company}</p>
                  </div>
                </div>
                <div className="panel-badges">
                  <span className="panel-type-badge" style={{ 
                    backgroundColor: `${getJobTypeColor(selectedJob.job_type)}15`,
                    color: getJobTypeColor(selectedJob.job_type)
                  }}>
                    {getJobTypeText(selectedJob.job_type)}
                  </span>
                  <span className="panel-location-badge">
                    📍 {selectedJob.location || 'Remote'}
                  </span>
                  {getDaysLeft(selectedJob.deadline) !== null && (
                    <span className="panel-days-badge">
                      {getDaysLeft(selectedJob.deadline)} days left
                    </span>
                  )}
                </div>
              </header>

              <div className="panel-content">
                <div className="panel-section">
                  <h4 className="section-title">About the role</h4>
                  <p className="description-text">
                    {selectedJob.description }
                  </p>
                </div>

                <div className="panel-section">
                  <h4 className="section-title">Required skills</h4>
                  <div className="job-skills">
                    {parseSkills(selectedJob.skills_required).map((skill, i) => (
                      <span key={i} className="skill-pill">{skill}</span>
                    ))}
                  </div>
                </div>

              </div>

              <footer className="panel-footer">
                <button
                  className={`apply-button ${selectedJob.is_applied ? 'applied' : ''}`}
                  disabled={selectedJob.is_applied}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!selectedJob.is_applied) {
                      navigate(`/jobs/${selectedJob.id}/apply`);
                    }
                  }}
                >
                  {selectedJob.is_applied ? 'Already applied' : 'Apply now'}
                </button>
              </footer>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}