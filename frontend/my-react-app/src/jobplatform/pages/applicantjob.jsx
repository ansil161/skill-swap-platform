import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

import '../styles/applicant.css'

export default function Applicants() {
  const { id } = useParams();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api.get(`jobs/${id}/applicants/`)
      .then(res => setApps(res.data));
  }, [id]);

  return (
    <>
      
      <div className="ss-container">
        <h1 className="ss-header">Applicants</h1>

        {apps.length === 0 ? (
          <p className="ss-empty">No applicants yet.</p>
        ) : (
          apps.map(app => (
            <div key={app.id} className="ss-card">
              <p className="ss-user">{app.user}</p>
              <p className="ss-letter">{app.cover_letter}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
}