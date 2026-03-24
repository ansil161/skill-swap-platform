import { useEffect, useRef, useState } from "react";

export const useChatWebSocket = (conversationId) => {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const messageIdsRef = useRef(new Set());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

 
    if (socketRef.current) {
      socketRef.current.close();
    }

    const socket = new WebSocket(`ws://localhost:8000/ws/chat/${conversationId}/`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected", conversationId);
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (!data.id || !messageIdsRef.current.has(data.id)) {
        setMessages((prev) => [...prev, data]);
        if (data.id) messageIdsRef.current.add(data.id);
      }
    };

    socket.onclose = () => {
      console.log("❌ WebSocket disconnected");
      setIsConnected(false);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      setIsConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [conversationId]);

  const sendMessage = (text) => {
    const socket = socketRef.current;

    if (!socket) {
      console.error("⚠️ No socket");
      return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
      console.error("⚠️ Socket not ready:", socket.readyState);
      return;
    }

    socket.send(JSON.stringify({ message: text }));
  };

  return { messages, sendMessage, isConnected };
};