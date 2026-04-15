import React, { useEffect, useRef, useState } from "react";
import "../styles/videocall.css";
import api from '../../api/axios'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function VideoCall({ roomId, sessionid }) {
  console.log('sessionid',sessionid)
   const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);

  const [status, setStatus] = useState("connecting");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [callDuration, setCallDuration] = useState(0);

  const localStreamRef = useRef(null);
  let timerRef = useRef(null);
  const navigate=useNavigate()

  useEffect(() => {
    let ws;
    
    let isInitiator = false;

    const start = async () => {
      try {
        if (localStreamRef.current) return;

        const token = localStorage.getItem("access");
        const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
        ws = new WebSocket( `${wsProtocol}://skillexchange.duckdns.org/ws/video/${roomId}/?token=${token}`);
        


        ws.onopen = async () => {
          setStatus("connected");

          timerRef.current = setInterval(() => {
            setCallDuration((prev) => prev + 1);
          }, 1000);

          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          localStreamRef.current = stream;
          localVideoRef.current.srcObject = stream;

         pcRef.current = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

        stream.getTracks().forEach((track) => pcRef.current.addTrack(track, stream));

          pcRef.current.ontrack = (event) => {
  remoteVideoRef.current.srcObject = event.streams[0];
};

          pcRef.current.onicecandidate = (event) => {
            if (event.candidate) {
              ws.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
            }
          };

          pcRef.current.onconnectionstatechange = () => {
  setStatus(pcRef.current.connectionState);
};
        };

ws.onmessage = async (event) => {
  const data = JSON.parse(event.data);
  if (!pcRef.current) return;

  
  if (data.type === "role") {
    isInitiator = data.initiator;

    if (
      isInitiator &&
      pcRef.current.signalingState === "stable"
    ) {
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);

      ws.send(JSON.stringify({ type: "offer", offer }));
    }
  }

  if (data.type === "offer") {
    await pcRef.current.setRemoteDescription(data.offer);

    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);

    ws.send(JSON.stringify({ type: "answer", answer }));
  }

  
  if (data.type === "answer") {
    await pcRef.current.setRemoteDescription(data.answer);
  }

  if (data.type === "candidate") {
    try {
      await pcRef.current.addIceCandidate(data.candidate);
    } catch (err) {
      console.error("ICE error:", err);
    }
  }
};

        ws.onerror = () => setStatus("error");
        ws.onclose = () => setStatus("disconnected");
      } catch (err) {
        console.error(err);
        setStatus("failed");
      }
    };

    start();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (ws) ws.close();
      if (pcRef.current) pcRef.current.close();

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    };
  }, [roomId]);

  const toggleMic = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setMicOn((v) => !v);
  };

  const toggleCam = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setCamOn((v) => !v);
  };

  const STATUS_COLOR = {
    connected: "vc-status--connected",
    connecting: "vc-status--connecting",
    disconnected: "vc-status--muted",
    error: "vc-status--error",
    failed: "vc-status--error",
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const endCall = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setStatus("disconnected");
    setShowFeedback(true);
  };

const submitFeedback = async () => {
  try {
    await api.post("session/feedbacks/", { 
      session:  parseInt(sessionid),  
      rating:parseInt(rating),
      feedback:feedback || '',
      
     
    });

    toast.success("Feedback submitted!");
    setShowFeedback(false);
    navigate("/sessions")
  } catch (err) {
    console.error(err);
    toast.error(
  err?.response?.data?.session?.[0] || 
  err?.response?.data?.error || 
  "Failed to submit feedback"
);
  }
};
const skipFeedback = () => {
  setShowFeedback(false);
  navigate("/sessions");
};

 
  return (
    <div className="vc-wrap">
 
      <div className="vc-header">
        <span className="vc-room">Room · {roomId}</span>
        <div className={`vc-status ${STATUS_COLOR[status] ?? ""}`}>
          <span className="vc-status-dot" />
          <span className="vc-status-text">{status}</span>
        </div>
      </div>

   
      <div className="vc-feeds">
        <div className="vc-feed">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="vc-video"
          />
          <span className="vc-feed-label">You</span>
          {!micOn && (
            <span className="vc-feed-muted" title="Mic off">
              <MicOffIcon />
            </span>
          )}
        </div>

        <div className="vc-feed">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="vc-video"
          />
          <span className="vc-feed-label">Remote</span>
        </div>
      </div>

    
      <div className="vc-controls">
        <button
          className={`vc-btn ${!micOn ? "vc-btn--off" : ""}`}
          onClick={toggleMic}
          title={micOn ? "Mute mic" : "Unmute mic"}
        >
          {micOn ? <MicIcon /> : <MicOffIcon />}
        </button>

        <button
          className={`vc-btn ${!camOn ? "vc-btn--off" : ""}`}
          onClick={toggleCam}
          title={camOn ? "Turn off camera" : "Turn on camera"}
        >
          {camOn ? <CamIcon /> : <CamOffIcon />}
        </button>

     <button className="vc-btn vc-btn--end" title="End call" onClick={endCall}>
  <EndCallIcon />
</button>

        <button className="vc-btn" title="Share screen">
          <ScreenIcon />
        </button>
      </div>
            
      {showFeedback && (
        <div className="vc-feedback-overlay">
          <div className="vc-feedback-card">
            <h2>Call Ended</h2>
            <p>Duration: {formatTime(callDuration)}</p>

            <h3>How was your experience?</h3>

            <div className="vc-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={star <= rating ? "active" : ""}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              placeholder="Write your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <div className="vc-feedback-actions">
              <button className="vc-submit" onClick={submitFeedback}>
                Submit
              </button>
              <button className="vc-skip" onClick={() => skipFeedback()}>
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


const MicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1a3 3 0 0 1 3 3v4a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3z" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M3 8a5 5 0 0 0 10 0M8 13v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const MicOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1a3 3 0 0 1 3 3v2M5 5v3a3 3 0 0 0 5.12 2.12M3 8a5 5 0 0 0 8.54 3.54M8 13v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const CamIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="4" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M11 7l4-2v6l-4-2V7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
);

const CamOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1 4.5A1.5 1.5 0 0 1 2.5 3H7M11 7l4-2v6l-3-1.5M2 13h8.5A1.5 1.5 0 0 0 12 11.5V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const EndCallIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.28" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="23" y1="1" x2="1" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ScreenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M6 14h4M8 12v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);