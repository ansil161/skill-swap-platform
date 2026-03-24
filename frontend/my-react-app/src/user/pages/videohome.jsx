import { useParams } from "react-router-dom";
import VideoCall from "../component/videocall";
import { useLocation } from "react-router-dom";

export default function VideoCallPage() {
  const { roomId } = useParams();
   const location = useLocation();
  

  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get("sessionId");

  return (
    <div>
      <h2>Video Call Room: {roomId}</h2>
      <VideoCall roomId={roomId} sessionid={sessionId} />
    </div>
  );
}