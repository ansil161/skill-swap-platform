import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelope, faCheck, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import api from "../../api/axios";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("noti/notifications/");
      setNotifications(res.data);
      const unread = res.data.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const connectWebSocket = () => {
    const ws = new WebSocket("wss://skillexchange.duckdns.org/ws/notifications/");

    ws.onopen = () => console.log("WebSocket connected");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newNotification = {
        id: Date.now(),
        message: data.message,
        is_read: false,
        created_at: new Date().toISOString(),
        type: data.type || 'default'
      };
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    ws.onclose = () => {
      console.log(" WebSocket disconnected... reconnecting");
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (err) => {
      console.error("WS error:", err);
      ws.close();
    };

    setSocket(ws);
  };

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchNotifications();
    connectWebSocket();
    return () => socket?.close();
  }, []);

  const markAsRead = async () => {
    try {
      await api.patch("noti/notiread/");
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDropdown = () => {
    const newState = !open;
    setOpen(newState);
    if (newState && unreadCount > 0) {
      markAsRead();
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      message: faEnvelope,
      request: faBell,
      default: faBell
    };
    return icons[type] || icons.default;
  };

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      
      <button
        className={`notification-btn ${open ? 'active' : ''}`}
        onClick={toggleDropdown}
        aria-label="Notifications"
      >
        <FontAwesomeIcon icon={faBell} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>


      <div className={`notification-dropdown ${open ? 'active' : ''}`}>
        
     
        <div className="notification-header">
          <h4>Notifications</h4>
          {unreadCount > 0 && (
            <button className="mark-all-read" onClick={markAsRead}>
              <FontAwesomeIcon icon={faCheck} /> Mark all read
            </button>
          )}
        </div>

 
        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="notification-empty">
              <FontAwesomeIcon icon={faBell} />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`notification-item ${!n.is_read ? 'unread' : ''}`}
                onClick={() => {
                
                  if (!n.is_read) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                    setNotifications(prev => 
                      prev.map(item => 
                        item.id === n.id ? { ...item, is_read: true } : item
                      )
                    );
                  }
                }}
              >
                <div className="notification-icon">
                  <FontAwesomeIcon icon={getNotificationIcon(n.type)} />
                </div>
                <div className="notification-content">
                  <p className="notification-message">{n.message}</p>
                  <span className="notification-time">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
                {!n.is_read && <div className="notification-dot" />}
              </div>
            ))
          )}
        </div>

      
        <div className="notification-footer">
          <a href="/notifications" onClick={(e) => { e.preventDefault(); /* navigate */ }}>
            View all notifications <FontAwesomeIcon icon={faExternalLinkAlt} />
          </a>
        </div>
      </div>
    </div>
  );
}