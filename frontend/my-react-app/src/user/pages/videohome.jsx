import { useParams } from "react-router-dom";
import VideoCall from "../component/videocall";

export default function VideoCallPage() {
  const { roomId } = useParams();

  return (
    <div>
      <h2>Video Call Room: {roomId}</h2>
      <VideoCall roomId={roomId} />
    </div>
  );
}