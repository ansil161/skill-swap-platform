
import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import ChatWindow from "../component/chathome";

const ChatList = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  useEffect(() => {
    api
      .get("conversations/")
      .then((res) => {
        setConversations(res.data);
        console.log(res.data)
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
 
      <div style={{ width: "250px", border: "1px solid #ccc", padding: "10px" }}>
        {conversations.length === 0 ? (
          <p>No conversations</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                backgroundColor: activeConversation === conv.id ? "#f0f0f0" : "white",
              }}
            >
              <strong>{conv.user2_name || conv.user1_name}</strong>
              <div style={{ fontSize: "12px", color: "#666" }}>
                {conv.last_message || "No messages yet"}
              </div>
            </div>
          ))
        )}
      </div>

   
      <div style={{ flex: 1 }}>
        {activeConversation ? (
          <ChatWindow conversationId={activeConversation} />
        ) : (
          <p>Select a conversation</p>
        )}
      </div>
    </div>
  );
};

export default ChatList;