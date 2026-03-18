import React, { useState, useEffect } from "react";
import { useChatWebSocket } from "../../hooks/websocketchga";
import api from "../../api/axios";

const ChatWindow = ({ conversationId }) => {
  const { messages: newMessages, sendMessage } = useChatWebSocket(conversationId);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`chat/${conversationId}/messages/`);
        setMessages(res.data); 
        console.log(res.data)
      } catch (err) {
        console.error("Failed to fetch previous messages:", err);
      }
    };

    fetchMessages();
  }, [conversationId]);


  useEffect(() => {
    if (newMessages.length === 0) return;
    setMessages((prev) => [...prev, newMessages[newMessages.length - 1]]);
  }, [newMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div style={{ padding: "10px" }}>
      <h3>Chat</h3>

      <div
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid #ccc",
          marginBottom: "10px",
          padding: "5px",
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id}>
            <b>{msg.sender.username || msg.sender}: </b>
            {msg.content || msg.message}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "80%", marginRight: "5px" }}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatWindow;