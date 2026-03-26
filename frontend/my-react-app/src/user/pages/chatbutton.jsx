import { useNavigate, useLocation } from "react-router-dom";
import "../styles/chatButton.css";

export default function ChatButton() {
  const navigate = useNavigate();
  const location = useLocation();


  const excludedPaths = [
    "/chat",
    "/dashrec",
    "/admin",
    "/admin/users",
    "/admin/swaps",
    "/admin/sessions",
    '/forgote',
    "/create-job",
    '/login'
  ];

  if (excludedPaths.includes(location.pathname)) return null;

  return (
    <button
      className="chat-float-btn"
      onClick={() => navigate("/chat")}
    >
      💬
    </button>
  );
}