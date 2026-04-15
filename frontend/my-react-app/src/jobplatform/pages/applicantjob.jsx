import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import '../styles/applicant.css'

export default function Applicants() {
  const { id } = useParams();
  const [apps, setApps] = useState([]);
 

  useEffect(() => {
    api.get(`jobs/job/${id}/applicants/`)
      .then(res => {
        setApps(res.data);
        console.log(res.data);
      });
  }, [id]);

  const handleAction = (appId, action) => {
    api.patch(`jobs/application/${appId}/update/`, { status: action })
      .then(res => {
        setApps(prev => prev.map(a => a.id === appId ? { ...a, status: action } : a));
      })
      .catch(err => console.error(err));
  }

  return (
    <div className="ss-container">
      <h1 className="ss-header">Applicants</h1>

      {apps.length === 0 ? (
        <p className="ss-empty">No applicants yet.</p>
      ) : (
        apps.map(app => {
        
          let ats = null;

if (app.ats_feedback && app.ats_score) {
  try {
    ats = JSON.parse(app.ats_feedback);
  } catch (err) {
    console.error("Failed to parse ATS feedback", err);
  }
}

          return (
            <div key={app.id} className="ss-card">
              <h3 className="ss-user">
                {app.username} {app.status && <span className="ss-status">• {app.status}</span>}
              </h3>

              <p>
                <strong>Email:</strong> <a href={`mailto:${app.email}`} className="ss-link">{app.email}</a>
              </p>

              {app.cover_letter && (
                <>
                  <p><strong>Cover Letter:</strong></p>
                  <p className="ss-letter">{app.cover_letter}</p>
                </>
              )}

              {app.resume && (
                <p>
                  <a
  href={app.resume} 
  target="_blank"
  rel="noopener noreferrer"
  className="ss-resume-link"
>
  📄 View Resume
</a>
                </p>
              )}

            
              {app.ats_score && ats && (
                <div className="ss-ats">
                  <p><strong>ATS Score:</strong> {ats.ats_score}</p>
                  {ats.matched_skill && ats.matched_skill.length > 0 && (
                    <p><strong>Matched Skills:</strong> {ats.matched_skill.join(", ")}</p>
                  )}
                  {ats.missing_skill && ats.missing_skill.length > 0 && (
                    <p><strong>Missing Skills:</strong> {ats.missing_skill.join(", ")}</p>
                  )}
                  {ats.suggestion && ats.suggestion.length > 0 && (
                    <>
                      <p><strong>Suggestions:</strong></p>
                      <ul>
                        {ats.suggestion.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {!app.status || app.status === 'applied' ? (
                <div className="ss-card-actions">
                  <button 
                    className="ss-btn-action ss-accept" 
                    onClick={() => handleAction(app.id, 'accepted')}
                  >
                    Accept
                  </button>
                  <button 
                    className="ss-btn-action ss-reject" 
                    onClick={() => handleAction(app.id, 'rejected')}
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <p className="ss-status-badge">Status: <strong>{app.status}</strong></p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}