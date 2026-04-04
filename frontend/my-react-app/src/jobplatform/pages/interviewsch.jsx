import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "../styles/interviewsch.css";
import RecruiterNavbar from '../pages/recruternav'

const InterviewSchedule = () => {
  const [applicants, setApplicants] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewLink, setInterviewLink] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get("jobs/interview", {
          withCredentials: true,
        });
        setApplicants(res.data);
        console.log(res.data)
      } catch (err) {
        setError("Failed to load applicants");
      }
    };

    fetchApplicants();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        `jobs/interview/${selectedApp.id}/`,
        {
          interview_date: interviewDate,
          interview_link: interviewLink,
        },
        { withCredentials: true }
      );

      setMessage(res.data.message);
      setSelectedApp(null);
      setInterviewDate("");
      setInterviewLink("");
    } catch (err) {
      setError("Failed to schedule interview");
    }
  };

  return (
    <div>
      <RecruiterNavbar/>
    <div className="schedule-container">
     
      <h2>📋 Accepted Applicants</h2>

      {/* 🔹 Applicants List */}
      {applicants.map((app) => (
        <div key={app.id} className="applicant-card">
          <p><strong>{app.username}</strong></p>
          <p>{app.job}</p>
          <p>Status: {app.status}</p>


          <button onClick={() => setSelectedApp(app)}>
            📅 Schedule Interview
          </button>
        </div>
      ))}


      {selectedApp && (
        <div className="schedule-card">
          <h3>Schedule for {selectedApp.user?.username}</h3>

          <form onSubmit={handleSubmit}>
            <input
              type="datetime-local"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              required
            />

            <input
              type="url"
              placeholder="Meeting Link"
              value={interviewLink}
              onChange={(e) => setInterviewLink(e.target.value)}
              required
            />

            <button type="submit">✅ Confirm</button>
          </form>
        </div>
      )}

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
    </div>
  );
};

export default InterviewSchedule;