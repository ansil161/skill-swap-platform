// admin/pages/Sessions.jsx
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    api.get("admin/sessions/")
      .then(res => setSessions(res.data));
  }, []);

  return (
    <div>
      <h2>Sessions</h2>

      {sessions.map(s => (
        <div key={s.id}>
          {s.mentor_name} teaching {s.learner_name} - {s.status}
        </div>
      ))}
    </div>
  );
}