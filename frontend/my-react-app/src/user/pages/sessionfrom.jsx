import { useState } from "react";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./SessionScheduler.css";

export default function SessionScheduler() {
  const { swapRequestId } = useParams();
  const navigate = useNavigate();

  const [scheduledTime, setScheduledTime] = useState("");
  const [videoType, setVideoType] = useState("internal");
  const [googleLink, setGoogleLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      swap_request: swapRequestId,
      scheduled_time: scheduledTime,
      video_call_type: videoType,
      google_meet_link: videoType === "google" ? googleLink : null,
    };

    try {
      const res = await api.post("session/sessions/", data);
      toast.success(res.data?.message || "Session scheduled successfully!");
      navigate("/sessions");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to schedule session");
    }
  };

  return (
    <div className="session-scheduler">
      <h2 className="scheduler-title">Schedule Skill Swap Session</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="scheduledTime">Scheduled Time</label>
          <input
            id="scheduledTime"
            type="datetime-local"
            className="form-control"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="videoType">Video Call Platform</label>
          <select
            id="videoType"
            className="form-control"
            value={videoType}
            onChange={(e) => setVideoType(e.target.value)}
          >
            <option value="internal">Built-in Session</option>
            <option value="google">Google Meet</option>
          </select>
        </div>

        {videoType === "google" && (
          <div className="form-group fade-in">
            <label htmlFor="googleLink">Google Meet Link</label>
            <input
              id="googleLink"
              type="url"
              className="form-control"
              value={googleLink}
              onChange={(e) => setGoogleLink(e.target.value)}
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              required
            />
          </div>
        )}

        <button type="submit" className="btn-submit">
          Confirm Schedule
        </button>
      </form>
    </div>
  );
}
