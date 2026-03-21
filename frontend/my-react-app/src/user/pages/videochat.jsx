import { useEffect, useRef, useState } from "react";

const VideoCall = ({ roomName }) => {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const pc = useRef(new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] }));
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8000/ws/webrtc/${roomName}/`);

    ws.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "offer") {
        await pc.current.setRemoteDescription(data);
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answer);
        ws.current.send(JSON.stringify(answer));
      } else if (data.type === "answer") {
        await pc.current.setRemoteDescription(data);
      } else if (data.type === "candidate") {
        await pc.current.addIceCandidate(data.candidate);
      }
    };

    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideo.current.srcObject = stream;
      stream.getTracks().forEach(track => pc.current.addTrack(track, stream));

      pc.current.ontrack = (event) => {
        remoteVideo.current.srcObject = event.streams[0];
      };

      pc.current.onicecandidate = (event) => {
        if (event.candidate) {
          ws.current.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
        }
      };

      // create offer if first user
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      ws.current.send(JSON.stringify(offer));
    };

    init();
  }, [roomName]);

  return (
    <>
      <video ref={localVideo} autoPlay muted />
      <video ref={remoteVideo} autoPlay />
    </>
  );
};

export default VideoCall;