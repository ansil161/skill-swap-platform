
import React, { useState } from "react";
import { useChatWebSocket } from "../../hooks/websocketchga";

const ChatWindow = ({ conversationId }) => {
  const { messages, sendMessage } = useChatWebSocket(conversationId);
  const [input, setInput] = useState("");

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
        {messages.map((msg, index) => (
          <div key={index}>
            <b>{msg.sender}: </b>
            {msg.message}
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