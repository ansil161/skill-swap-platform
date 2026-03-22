import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

export default function SessionList() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    api.get("session/sessions/")
      .then((res) => setSessions(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>My Sessions</h2>

      {sessions.length === 0 && <p>No sessions scheduled yet.</p>}

      {sessions.map((session) => (
        <div key={session.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <p><strong>Mentor:</strong> {session.mentor?.username}</p>
          <p><strong>Learner:</strong> {session.learner?.username}</p>
          <p><strong>Time:</strong> {new Date(session.scheduled_time).toLocaleString()}</p>

          {session.video_call_type === "google" ? (
            <a href={session.google_meet_link} target="_blank" rel="noreferrer">
              Join Google Meet
            </a>
          ) : (
        <Link to={`/video/${session.internal_room_id}`}>
  Join Internal Call
</Link>
          )}
        </div>
      ))}
    </div>
  );
}