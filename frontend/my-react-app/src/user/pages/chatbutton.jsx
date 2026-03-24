import { useNavigate, useLocation } from "react-router-dom";
import "../styles/chatButton.css";

export default function ChatButton() {
  const navigate = useNavigate();
  const location = useLocation();

  
  if (location.pathname === "/chat") return null;

  return (
    <button
      className="chat-float-btn"
      onClick={() => navigate("/chat")}
    >
      💬
    </button>
  );
}