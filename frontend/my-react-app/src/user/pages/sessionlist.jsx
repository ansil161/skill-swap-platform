import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; 
import '../styles/sessionlist.css'
import Navbar from "../component/navbar";

export default function SessionList() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("session/sessions/");
        setSessions(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const markCompleted = async (sessionId) => {
    try {
      const res = await api.put(`session/sessions/${sessionId}/`, { status: "completed" });
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? res.data : s))
      );
      toast.success("Session marked as completed!");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.detail || "Failed to update session status");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "badge-success";
      case "scheduled": return "badge-primary";
      case "cancelled": return "badge-danger";
      default: return "badge-neutral";
    }
  };

  if (loading) return <div className="session-container"><p className="loading-text">Loading sessions...</p></div>;

  return (
    <>
    <Navbar/>
  
    <div className="session-container">
     
      <header className="session-header">
        <h2>My Sessions</h2>
        <p className="subtitle">Manage and join your upcoming mentoring calls</p>
      </header>

      {sessions.length === 0 ? (
        <div className="empty-state">
          <p>No sessions scheduled yet.</p>
          <Link to="/schedule" className="btn-text">Schedule a Session</Link>
        </div>
      ) : (
        <div className="session-grid">
          {sessions.map((session) => (
            <div key={session.id} className="session-card">
              <div className="card-header">
                <span className={`badge ${getStatusBadgeClass(session.status)}`}>
                  {session.status}
                </span>
                <span className="time">
                  {new Date(session.scheduled_time).toLocaleDateString()} • {new Date(session.scheduled_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>

              <div className="card-body">
                <div className="info-row">
                  <span className="label">Mentor:</span>
                  <span className="value">{session.mentor_username}</span>
                </div>
                <div className="info-row">
                  <span className="label">Learner:</span>
                  <span className="value">{session.learner_username}</span>
                </div>
              </div>

              <div className="card-actions">
                {session.video_call_type === "google" ? (
                  <a href={session.google_meet_link} target="_blank" rel="noreferrer" className="btn btn-primary">
                    Join Google Meet
                  </a>
                ) : (
                  <Link to={`/video/${session.internal_room_id}?sessionId=${session.id}`} className="btn btn-primary">
                    Join Internal Call
                  </Link>
                )}

                {session.status !== "completed" && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => markCompleted(session.id)}
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
      </>
  );
}