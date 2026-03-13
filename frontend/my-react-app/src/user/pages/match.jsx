import { useEffect, useState } from "react"
import api from "../../api/axios"
import '../styles/match.css'

function Match() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [swapRequests, setSwapRequests] = useState({ sent: [], received: [] })

  useEffect(() => {
    getMatches()
    getCurrentUser()
    getSwapRequests()
  }, [])

  function isRequestSent(providerId, skillId) {
    return swapRequests.sent.some(
      req => req.provider_id === providerId && req.skill_id === skillId
    )
  }

  function getSwapRequests() {
    api.get("swaprequest/")
      .then(res => setSwapRequests(res.data))
      .catch(err => console.log(err))
  }

  function getCurrentUser() {
    api.get("profile/")
      .then((res) => setCurrentUser(res.data))
      .catch((err) => console.log(err))
  }

  function getMatches() {
    api.get("matching/")
      .then((res) => {
        setMatches(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err.response?.data)
        setLoading(false)
      })
  }

  function sendSwapRequest(providerId, skillId) {
    api.post("swaprequest/", {
      provider_id: providerId,
      skill_id: skillId
    })
    .then(() => {
      alert("Swap request sent successfully!")
      getSwapRequests()
    })
    .catch(err => {
      console.log(err.response?.data)
      alert("Failed to send request")
    })
  }

  const getCompatibility = (match) => {
    const userOffers = currentUser?.skills_offered || []
    const userWants = currentUser?.skills_wanted || []
    const matchOffers = match.skills_offered || []
    const matchWants = match.skills_wanted || []

    let score = 0

    userWants.forEach(skill => {
      if (matchOffers.includes(skill)) score += 50
    })

    matchWants.forEach(skill => {
      if (userOffers.includes(skill)) score += 50
    })

    return Math.min(score, 100)
  }

  const renderSkills = (skills, type) => {
    if (!skills) return null
    const skillArray = Array.isArray(skills) ? skills : [skills]
    
    if (skillArray.length === 0) {
      return <span className="skill-empty">None listed</span>
    }
    
    return skillArray.map((skill, index) => (
      <span key={`${type}-${index}`} className={`skill-tag ${type}`}>
        {skill}
      </span>
    ))
  }

  if (loading) {
    return <div className="loading">🔍 Finding your perfect skill matches...</div>
  }

  return (
    <div className="match-container">
      <div className="match-header">
        <h2>🎯 Recommended Skill Partners</h2>
        <p>Based on your skills and learning goals</p>
      </div>

      {!matches || matches.length === 0 ? (
        <div className="no-matches">
          <h3>😕 No matches found yet</h3>
          <p>Try adding more skills to your profile to find better matches!</p>
          <button className="btn-secondary" onClick={() => window.location.href='/profile'}>
            ✏️ Edit Profile
          </button>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((item, index) => {
            const compatibility = getCompatibility(item)
            
            return (
              <div key={item.id || index} className="match-card">
                <div className="match-header-section">
                  <div className="user-info">
                    <img 
                      src={item.photo ? `http://localhost:8000${item.photo}` : '/default-avatar.png'} 
                      alt={item.username} 
                      className="profile-avatar-edu" 
                      onError={(e) => { e.target.src = '/default-avatar.png' }}
                    />
                    <div>
                      <h3>{item.username}</h3>
                     <span className={`match-badge ${
  compatibility >= 80 ? 'high' : compatibility >= 50 ? 'medium' : ''
}`}>
  {compatibility}% Match
</span>
                    </div>
                  </div>
                  
                  {item.rating && (
                    <div className="user-rating">
                      <span className="stars">⭐</span>
                      <span className="rating-score">{item.rating}</span>
                      <span className="rating-count">({item.review_count || 0})</span>
                    </div>
                  )}
                </div>

                <div className="match-skills">
                  <div className="skill-section">
                    <h4>📚 Offers to Teach:</h4>
                    <div className="skills-list">
                      {renderSkills(item.offers, 'offer')}
                    </div>
                  </div>

                  <div className="skill-section">
                    <h4>🎓 Wants to Learn:</h4>
                    <div className="skills-list">
                      {renderSkills(item.learn, 'want')}
                    </div>
                  </div>
                </div>

                {item.experience && (
                  <div className="user-stats">
                    <span>💼 {item.experience} years exp.</span>
                    {item.completed_swaps && (
                      <span>✅ {item.completed_swaps} swaps</span>
                    )}
                  </div>
                )}

                <div className="match-actions">
                  {isRequestSent(item.id, item.skill_id) ? (
                    <button className="btn-disabled" disabled>
                      ✅ Request Sent
                    </button>
                  ) : (
                    <button 
                      className="btn-primary"
                      onClick={() => sendSwapRequest(item.id, item.skill_id)}
                    >
                      🤝 Send Swap Request
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Match