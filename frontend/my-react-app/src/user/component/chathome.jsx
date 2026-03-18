import React, { useState, useEffect, useRef } from "react";
import { useChatWebSocket } from "../../hooks/websocketchga"; 
import api from "../../api/axios";                           
import "../styles/chat.css";

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const ChatWindow = ({ conversationId, partnerName }) => {

  const { messages: newMessages, sendMessage } = useChatWebSocket(conversationId);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const taRef = useRef(null);

 
  useEffect(() => {
    if (!conversationId) return;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`chat/${conversationId}/messages/`);
        setMessages(res.data);
        console.log(res.data);
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
    if (taRef.current) taRef.current.style.height = "22px";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = "22px";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const getSender  = (msg) => msg.sender?.username || msg.sender || "";
  const getContent = (msg) => msg.content || msg.message || "";
  const getTime    = (msg) =>
    msg.timestamp
      ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "";


  const isMe = (msg) => getSender(msg).toLowerCase() === "alex";

  const initials = getInitials(partnerName);

  return (
    <>

      <div className="ss-hd">
        <div className="ss-hd-l">
          <div className="ss-av">
            <div className="ss-avf">{initials}</div>
            <div className="ss-dot" />
          </div>
          <div>
            <div className="ss-hd-n">{partnerName}</div>
            <div className="ss-hd-s">
              <b />
              Online
            </div>
          </div>
        </div>

        <div className="ss-hd-r">
          <button className="ss-ib" title="Schedule session">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="3" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </button>
          <button className="ss-ib" title="View profile">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </button>
          <button className="ss-ib" title="More options">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="1.2" />
              <circle cx="12" cy="12" r="1.2" />
              <circle cx="19" cy="12" r="1.2" />
            </svg>
          </button>
        </div>
      </div>

   
      <div className="ss-msgs">
        {messages.map((msg) => (
          <div key={msg.id} className={`ss-mr ${isMe(msg) ? "me" : ""}`}>
            {!isMe(msg) && <div className="ss-avs">{initials}</div>}
            <div className="ss-bw">
              <div className={`ss-bbl ${isMe(msg) ? "me" : "them"}`}>
                {getContent(msg)}
              </div>
              {getTime(msg) && <span className="ss-bt">{getTime(msg)}</span>}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="ss-inp-area">
        <div className="ss-inp-box">
          <button className="ss-ab" title="Attach file">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.42 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
          <button className="ss-ab" title="Emoji">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 13s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
            </svg>
          </button>
          <textarea
            ref={taRef}
            className="ss-ta"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
          />
          <button className="ss-send" onClick={handleSend} disabled={!input.trim()}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="m22 2-11 11M22 2 15 22l-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;