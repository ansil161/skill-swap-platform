import React, { useState, useEffect, useRef } from "react";
import { useChatWebSocket } from "../../hooks/websocketchga"; 
import api from "../../api/axios";                           
import "../styles/chat.css";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const ChatWindow = ({ conversationId, partnerName, currentUser }) => {
  const { messages: newMessages, sendMessage } = useChatWebSocket(conversationId);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;
    setMessages([])
    const fetchMessages = async () => {
      try {
        const res = await api.get(`chats/chat/${conversationId}/messages/`);
        setMessages(res.data);
      } catch (err) {
     toast.error(err.response?.data?.message);
      }
    };
    fetchMessages();
  }, [conversationId]);

 useEffect(() => {
  if (newMessages.length === 0) return;

  const lastMsg = newMessages[newMessages.length - 1];

  setMessages((prev) => {
    const exists = prev.some((m) => m.id === lastMsg.id);
    return exists ? prev : [...prev, lastMsg];
  });
}, [newMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

 
  const getContent = (msg) => msg.content || msg.message || "";
  const getTime = (msg) =>
    msg.timestamp
      ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "";
  const getSender = (msg) =>
  typeof msg.sender === "string" ? msg.sender : msg.sender?.username;

const isMe = (msg) => getSender(msg) === currentUser;

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
            <div className="ss-hd-s">Online</div>
          </div>
        </div>
      </div>

      <div className="ss-msgs">
{messages.map((msg, idx) => {
  console.log("MSG:", msg.sender, "CURRENT:", currentUser);

  return (
    <div key={msg.id || idx} className={`ss-mr ${isMe(msg) ? "me" : ""}`}>
      {!isMe(msg) && <div className="ss-avs">{getInitials(partnerName)}</div>}
      
      <div className="ss-bw">
        <div className={`ss-bbl ${isMe(msg) ? "me" : "them"}`}>
          {getContent(msg)}
        </div>

        {msg.timestamp && (
          <span className="ss-bt">{getTime(msg)}</span>
        )}
      </div>
    </div>
  );
})}
        <div ref={bottomRef} />
      </div>

      <div className="ss-inp-area">
        <div className="ss-inp-box">
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
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;