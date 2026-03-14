import { useEffect, useState } from "react"
import api from "../../api/axios"
import '../styles/request.css'

function Requests() {
  const [requests, setRequests] = useState({
    sent: [],
    received: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRequests()
  }, [])

  console.log(requests)
  function getRequests() {
    api.get("swaprequest/")
      .then(res => {
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

  if (loading) {
    return <div className="loading">⏳ Loading requests...</div>
  }

  return (
    <div className="requests-container">
      <div className="requests-header">
        <h2>📥 Received Requests</h2>
        <p>Review and manage incoming skill swap requests</p>
      </div>

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
                <div className="request-info">
                  <div className="requester-avatar">
                    {req.requester?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="requester-details">
                    <h4>{req.requester}</h4>
                    <span className="request-skill">
                      📚 Wants to learn: <b>{req.skill}</b>
                    </span>
                  </div>
                </div>

                <div className="request-status-cell">
                  <span className={`status-badge ${getStatusBadgeClass(req.status)}`}>
                    {req.status}
                  </span>
                </div>

                <div className="request-actions-cell">
                  {req.status === "Pending" ? (
                    <div className="request-actions">
                      <button 
                        className="btn-accept"
                        onClick={() => updateStatus(req.request_id, "Accepted")}
                      >
                        ✅ Accept
                      </button>
                      <button 
                        className="btn-reject"
                        onClick={() => updateStatus(req.request_id, "Rejected")}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  ) : (
                    <span className="action-disabled">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <h2>📤 Sent Requests</h2>

{requests.sent.length === 0 ? (
  <div className="empty-state">
    <span className="empty-icon">📭</span>
    <h3>No sent requests</h3>
  </div>
) : (
  <div className="requests-list">

    {requests.sent.map((req) => (
      <div key={req.request_id} className="request-card">

        <div className="request-info">
          <div className="requester-avatar">
            {req.provider?.charAt(0)?.toUpperCase()}
          </div>

          <div className="requester-details">
            <h4>{req.provider}</h4>
            <span className="request-skill">
              📚 Skill: <b>{req.skill}</b>
            </span>
          </div>
        </div>

        <div className="request-status-cell">
          <span className={`status-badge ${getStatusBadgeClass(req.status)}`}>
            {req.status}
          </span>
        </div>

      </div>
    ))}

  </div>
)}
    </div>
  )
}

export default Requests