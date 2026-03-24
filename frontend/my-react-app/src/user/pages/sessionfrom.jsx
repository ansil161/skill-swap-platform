
import { useState } from "react";
import api from "../../api/axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function SessionScheduler() {
   const { swapRequestId } = useParams()

  console.log('hello',swapRequestId)
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
      
      toast.success(err.response?.data?.message ||"Session scheduled!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message ||"Error scheduling session");
    }
  };
 

  return (
    <form onSubmit={handleSubmit}>
      <h2>Schedule Session</h2>
      <label>
        Scheduled Time:
        <input type="datetime-local" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} required />
      </label>
      <br />
      <label>
        Video Call Type:
        <select value={videoType} onChange={(e) => setVideoType(e.target.value)}>
          <option value="internal">Internal</option>
          <option value="google">Google Meet</option>
        </select>
      </label>
      <br />
      {videoType === "google" && (
        <label>
          Google Meet Link:
          <input type="url" value={googleLink} onChange={(e) => setGoogleLink(e.target.value)} required />
        </label>
      )}
      <br />
      <button type="submit">Schedule</button>
    </form>
  );
}