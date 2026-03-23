

import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";

import '../styles/apply.css'


export default function ApplyJob() {
  const { id } = useParams();
  const [coverLetter, setCoverLetter] = useState("");

  const handleApply = () => {
    api.post(`jobs/${id}/apply/`, {
      cover_letter: coverLetter
    })
    .then(() => alert("Applied Successfully"))
    .catch(err => console.log(err));
  };

  return (
    <>
      

      <div className="ss-wrapper">
        <div className="ss-card">
          <h1 className="ss-title">Apply for Job</h1>
          <p className="ss-subtitle">Tell them why you're the perfect fit</p>

          <div className="ss-form-group">
            <label className="ss-label" htmlFor="coverLetter">Cover Letter</label>
            <textarea
              id="coverLetter"
              className="ss-textarea"
              placeholder="Write your cover letter here..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
            <div className="ss-char-count">{coverLetter.length} characters</div>
          </div>

          <button className="ss-btn" onClick={handleApply}>
            Submit Application
          </button>
        </div>
      </div>
    </>
  );
}