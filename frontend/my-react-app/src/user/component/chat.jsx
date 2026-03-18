import { useState, useEffect, useRef } from "react";
import api from "../../api/axios";

export default function Chat({ conversationId, userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const chatBoxRef = useRef(null);


  useEffect(() => {
    api.get(`/chat/${conversationId}/message/`)
      .then(res => {
        setMessages(res.data.map(msg => ({
          message: msg.message,
          sender: msg.sender_id
        })));
      });
  }, [conversationId]);

 
  useEffect(() => {
    socketRef.current = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${conversationId}/`
    );

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data]);
    };

    socketRef.current.onerror = (err) => {
      console.log("WebSocket error:", err);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => socketRef.current.close();
  }, [conversationId]);

  
  const sendMessage = () => {
    if (input.trim() === "") return;

    socketRef.current.send(JSON.stringify({
      message: input,
      sender: userId  
    }));

    setInput("");
  };

  return (
    <div>
      <h3>Chat</h3>

      <div style={{ height: "300px", overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.sender === userId ? "Me" : "Other"}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}