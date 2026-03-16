import { useEffect, useState } from "react"
import api from "../../api/axios"
import '../styles/request.css'

function Requests() {
  const [requests, setRequests] = useState({
    sent: [],
    received: []
  })
  const [activeTab, setActiveTab] = useState('received')
  const [loading, setLoading] = useState(true)

  

  useEffect(() => {
    getRequests()
  }, [])

  const pendingCount = requests.received.filter(r => r.status === 'Pending').length

  function getRequests() {
    api.get("swaprequest/")
      .then(res => {
        console.log(res.data)
        setRequests(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  function updateStatus(requestId, status) {
    api.put("swaprequest/", {
      request_id: requestId,
      status: status
    })
    .then(() => {
      alert("Request " + status)
      getRequests()
    })
    .catch(err => console.log(err))
  }

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Accepted': return 'status-accepted'
      case 'Rejected': return 'status-rejected'
      case 'Pending': return 'status-pending'
      default: return 'status-pending'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Accepted': return '✓'
      case 'Rejected': return '✕'
      case 'Pending': return '⏳'
      default: return '⏳'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return <div className="loading">⏳ Loading requests...</div>
  }

  return (
    <div className="requests-container">

      <div className="requests-header">
        <div className="header-left">
          <div className="swap-icon">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"/>
            </svg>
          </div>
          <div className="header-title">
            <h2><span className="swap-highlight">Swap</span> Requests</h2>
          </div>
        </div>
        
        {pendingCount > 0 && (
          <div className="pending-badge">{pendingCount} pending</div>
        )}
      </div>
      
      <p className="header-subtitle">Manage your incoming and outgoing skill swap requests</p>

  
      <div className="requests-tabs">
        <button 
          className={`tab ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          Incoming
          {requests.received.length > 0 && (
            <span className="tab-count">{requests.received.length}</span>
          )}
        </button>
        <button 
          className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          Outgoing
        </button>
      </div>

    
      {activeTab === 'received' && (
        <div className="requests-list-wrapper">
          {requests.received.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <h3>No received requests yet</h3>
              <p>When someone wants to swap skills with you, it will appear here.</p>
            </div>
          ) : (
            <div className="requests-list">
              {requests.received.map((req) => (
                <div key={req.request_id} className="request-card">
                  <div className="request-header-row">
                    <div className="request-info">
                      <div className="requester-avatar online">
                        {req.requester?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="requester-details">
                        <h4>{req.requester}</h4>
                        {req.location && (
                          <span className="requester-location">
                            📍 {req.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="status-badge-wrapper">
                      <span className={`status-badge ${getStatusBadgeClass(req.status)}`}>
                        {getStatusIcon(req.status)} {req.status}
                      </span>
                    </div>
                  </div>

                  {req.offeredSkill && req.skill && (
                    <div className="skills-exchange">
                      <span className="skill-tag offered">{req.offeredSkill}</span>
                      <span className="skill-arrow">→</span>
                      <span className="skill-tag requested">{req.skill}</span>
                    </div>
                  )}

                  {req.message && (
                    <p className="request-message">"{req.message}"</p>
                  )}
                  
                  {req.created && (
                    <div className="request-date">
                      Received {formatDate(req.created)}
                    </div>
                  )}

                  {req.status === "Pending" && (
                    <div className="request-footer">
                      <div className="request-actions">
                        <button 
                          className="btn-decline"
                          onClick={() => updateStatus(req.request_id, "Rejected")}
                        >
                          ✕ Decline
                        </button>
                        <button 
                          className="btn-accept"
                          onClick={() => updateStatus(req.request_id, "Accepted")}
                        >
                          ✓ Accept
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sent Requests */}
      {activeTab === 'sent' && (
        <div className="requests-list-wrapper">
          {requests.sent.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <h3>No sent requests</h3>
              <p>Start exploring skills and send swap requests to begin learning!</p>
            </div>
          ) : (
            <div className="requests-list">
              {requests.sent.map((req) => (
                <div key={req.request_id} className="request-card">
                  <div className="request-header-row">
                    <div className="request-info">
                      <div className="requester-avatar">
                        {req.provider?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="requester-details">
                        <h4>{req.provider}</h4>
                        {req.location && (
                          <span className="requester-location">
                            📍 {req.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="status-badge-wrapper">
                      <span className={`status-badge ${getStatusBadgeClass(req.status)}`}>
                        {getStatusIcon(req.status)} {req.status}
                      </span>
                    </div>
                  </div>

                  <div className="skills-exchange">
  <span className="skill-tag requested">{req.skill}</span>
</div>

                  {req.created && (
                    <div className="request-date">
                      Sent {formatDate(req.created)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Requests