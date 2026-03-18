import { useEffect, useRef, useState } from "react";

export const useChatWebSocket = (conversationId) => {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!conversationId) return;

    if (socketRef.current) {
      socketRef.current.close();
    }

    const socket = new WebSocket(
  `ws://localhost:8000/ws/chat/${conversationId}/`
);



    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected for conversation", conversationId);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Received:", data);

      setMessages((prev) => [...prev, data]);
    };

    socket.onclose = () => {
      console.log("❌ WebSocket disconnected for conversation", conversationId);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      socket.close();
    };
  }, [conversationId]);

  const sendMessage = (text) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error("⚠️ WebSocket not connected");
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        message: text,
      })
    );
  };

  return { messages, sendMessage };
};