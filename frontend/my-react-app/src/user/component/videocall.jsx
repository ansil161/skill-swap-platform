import React, { useEffect, useRef, useState } from "react";

export default function VideoCall({ roomId }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    let ws;
    let localStream;
    let peerConnection;

    const start = async () => {
      try {
        // ✅ dynamic ws protocol
        const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
        ws = new WebSocket(`${wsProtocol}://localhost:8000/ws/video/${roomId}/`);

        ws.onopen = async () => {
          setStatus("connected");

          // 🎥 get camera
          localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          localVideoRef.current.srcObject = localStream;

          // 🔗 peer connection
          peerConnection = new RTCPeerConnection({
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" }
            ],
          });

          // send tracks
          localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
          });

          // receive remote
          peerConnection.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
          };

          // ICE candidates
          peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
              ws.send(JSON.stringify({
                type: "candidate",
                candidate: event.candidate,
              }));
            }
          };

          // ✅ ONLY FIRST USER CREATES OFFER
          const isInitiator = window.location.search.includes("creator=true");

          if (isInitiator) {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            ws.send(JSON.stringify({
              type: "offer",
              offer: offer,
            }));
          }

          // connection status
          peerConnection.onconnectionstatechange = () => {
            setStatus(peerConnection.connectionState);
          };
        };

        ws.onmessage = async (event) => {
          const data = JSON.parse(event.data);

          if (!peerConnection) return;

          // 📩 OFFER RECEIVED
          if (data.type === "offer") {
            await peerConnection.setRemoteDescription(data.offer);

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            ws.send(JSON.stringify({
              type: "answer",
              answer: answer,
            }));
          }

          // 📩 ANSWER RECEIVED
          if (data.type === "answer") {
            await peerConnection.setRemoteDescription(data.answer);
          }

          // 📩 ICE
          if (data.type === "candidate") {
            try {
              await peerConnection.addIceCandidate(data.candidate);
            } catch (err) {
              console.error(err);
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

    // ✅ CLEANUP
    return () => {
      if (ws) ws.close();
      if (peerConnection) peerConnection.close();
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };

  }, [roomId]);

  return (
    <div>
      <h3>Status: {status}</h3>

      <div style={{ display: "flex", gap: "20px" }}>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          style={{ width: 300, border: "2px solid black" }}
        />

        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ width: 300, border: "2px solid black" }}
        />
      </div>
    </div>
  );
}