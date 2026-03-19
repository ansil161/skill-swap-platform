import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import ChatWindow from "../component/chathome";
import "../styles/chat.css";
import { getCurrentUser } from "../../utils/cookies";

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const ChatList = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [search, setSearch] = useState("");
  const currentUser = getCurrentUser()
  useEffect(() => {
    api
      .get("conversations/")
      .then((res) => {
        setConversations(res.data);
        console.log('hai',res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const activeConv = conversations.find((c) => c.id === activeConversation);

 const getPartnerName = (conv) => conv.partner_name;

  const filtered = conversations.filter((conv) =>
    getPartnerName(conv).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ss-root">
  
      <div className="ss-sidebar">
        <div className="ss-sb-head">
          <div className="ss-sb-title">
            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Messages
          </div>

          <div className="ss-search">
            <svg className="ss-search-icon" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="ss-conv-list">
          {filtered.length === 0 ? (
            <div style={{ padding: "24px 16px", color: "var(--t3)", fontSize: 13, textAlign: "center" }}>
              No conversations
            </div>
          ) : (
            filtered.map((conv) => {
              const name = getPartnerName(conv);
              return (
                <div
                  key={conv.id}
                  className={`ss-ci ${activeConversation === conv.id ? "active" : ""}`}
                  onClick={() => setActiveConversation(conv.id)}
                >
                  <div className="ss-av">
                    <div className="ss-avf">{getInitials(name)}</div>
                  </div>
                  <div className="ss-cm">
                    <div className="ss-cn">{name}</div>
                    <div className="ss-cp">{conv.last_message || "No messages yet"}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="ss-main">
        {activeConversation && activeConv ? (
           <ChatWindow
            key={activeConversation}
            conversationId={activeConversation}
            partnerName={getPartnerName(activeConv)}
            currentUser={currentUser}
          />
        ) : (
          <div className="ss-empty">
            <div className="ss-empty-icon">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p>Your conversations</p>
            <span>Select a conversation to start chatting</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;