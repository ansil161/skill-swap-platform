import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";

import '../styles/apply.css'

export default function ApplyJob() {
  const { id } = useParams(); 
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();

    if (!resume) {
      alert("Please upload your resume before applying.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job", id); 
    if (coverLetter.trim()) {
      formData.append("cover_letter", coverLetter); 
    }

    try {
      setLoading(true);
      await api.post(`jobs/apply/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Applied Successfully!");
      setResume(null);
      setCoverLetter("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to apply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ss-wrapper">
      <div className="ss-card">
        <h1 className="ss-title">Apply for Job</h1>
        <p className="ss-subtitle">Upload your resume and optionally add a cover letter</p>

        <form className="ss-form" onSubmit={handleApply}>
          <div className="ss-form-group">
            <label className="ss-label" htmlFor="resume">Upload Resume (PDF/DOC)</label>
            <input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              required
            />
          </div>

          <div className="ss-form-group">
            <label className="ss-label" htmlFor="coverLetter">Cover Letter (Optional)</label>
            <textarea
              id="coverLetter"
              className="ss-textarea"
              placeholder="Write your cover letter here (optional)..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
            <div className="ss-char-count">{coverLetter.length} characters</div>
          </div>

          <button className="ss-btn" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}