import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../styles/createjob.css";

export default function CreateJob() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "",
    skills_required: "",
    location: "",
    job_type: "",
    deadline: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault(); 
    api.post("jobs/create/", form)
      .then(() => {
        alert("Job Created")
        setForm({
        title: "",
        description: "",
        company: "",
        skills_required: "",
        location: "",
        job_type: "",
        deadline: ""
    });
        

        
      })
      .catch(err => console.log(err?.error?.response));
  };

  useEffect(() => {
    api.get("jobs/userdeatails/")
      .then((res) => console.log(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="ss-wrapper">
      <div className="ss-card">
        <div className="ss-header">
          <h1 className="ss-title">Create Job</h1>
          <p className="ss-subtitle">Post a new opportunity on SkillSwap</p>
        </div>

        <form className="ss-form" onSubmit={handleSubmit}>
          <div className="ss-row">
            <div className="ss-input-group">
              <label className="ss-label">Job Title</label>
              <input
                type="text"
                className="ss-input"
                placeholder="e.g. Frontend Developer"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="ss-input-group">
              <label className="ss-label">Company</label>
              <input
                type="text"
                className="ss-input"
                placeholder="e.g. TechCorp"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="ss-input-group">
            <label className="ss-label">Description</label>
            <textarea
              className="ss-textarea"
              placeholder="Describe the role, requirements, and perks..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

         
          <div className="ss-row">
            <div className="ss-input-group">
              <label className="ss-label">Skills Required</label>
              <input
                type="text"
                className="ss-input"
                placeholder="e.g. React, Python, Design"
                value={form.skills_required}
                onChange={e => setForm({ ...form, skills_required: e.target.value })}
              />
            </div>
            <div className="ss-input-group">
              <label className="ss-label">Location</label>
              <input
                type="text"
                className="ss-input"
                placeholder="e.g. Remote, New York"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>

          <div className="ss-row">
            <div className="ss-input-group">
              <label className="ss-label">Job Type</label>
              <select
                className="ss-input"  
                value={form.job_type}
                onChange={e => setForm({ ...form, job_type: e.target.value })}
              >
                <option value="">Select type</option>
                <option value="full time">Full Time</option>
                <option value="part time">Part Time</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div className="ss-input-group">
              <label className="ss-label">Deadline</label>
              <input
                type="date"
                className="ss-input"
                value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="ss-btn">
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}