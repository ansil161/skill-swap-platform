import { useState, useEffect, useRef } from "react";
import axios from "axios";
import api from "../../api/axios";

export default function Chat({ conversationId, userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    api.get(`/chat/${conversationId}/message/`).then(res => {
      setMessages(res.data.map(msg => ({
        message: msg.message,
        sender: msg.sender_id
      })));
      scrollToBottom();
    });
  }, [conversationId]);

 
  useEffect(() => {
    socketRef.current = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${conversationId}/`
    );

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    };

    socketRef.current.onopen = () => console.log("WebSocket connected!");
    socketRef.current.onerror = (err) => console.log("WebSocket error:", err);

    return () => socketRef.current.close();
  }, [conversationId]);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  const sendMessage = () => {
    if (input.trim() === "") return;
    socketRef.current.send(JSON.stringify({
      message: input,
      sender: userId
    }));
    setInput("");
  };

  return (
    <div style={{ width: "400px", border: "1px solid #ccc", padding: "10px" }}>
      <h3>Chat</h3>
      <div
        ref={chatBoxRef}
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: "5px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>User {msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
        style={{ width: "300px" }}
      />
      <button onClick={sendMessage} style={{ marginLeft: "5px" }}>
        Send
      </button>
    </div>
  );
}