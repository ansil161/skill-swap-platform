import { useEffect, useState } from "react"
import api from "../../api/axios"
import '../styles/match.css'
import Navbar from "../component/navbar"

function Match() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [swapRequests, setSwapRequests] = useState({ sent: [], received: [] })
  const [apiMessage, setApiMessage] = useState(null)

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
    api.get("swaps/swaprequest/")
      .then(res => setSwapRequests(res.data))
      .catch(err => console.log(err))
  }

  function getCurrentUser() {
    api.get("user/profile/")
      .then((res) => setCurrentUser(res.data))
      .catch((err) => console.log(err))
  }

  function getMatches() {
    api.get("swaps/matching/")
      .then((res) => {
        setMatches(res.data)
        console.log(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err.response?.data)
        setApiMessage(err.response?.data?.message || "Failed to load matches")
        setLoading(false)
      })
  }

  function sendSwapRequest(providerId, skillId) {
    api.post("swaps/swaprequest/", {
      provider_id: providerId,
      skill_id: skillId
    })
    .then((res) => {
      setApiMessage(res.data.message || "Swap request sent successfully!")
      getSwapRequests()
      setTimeout(() => setApiMessage(null), 3000)
    })
    .catch(err => {
      setApiMessage(err.response?.data?.message || "Failed to send request")
      setTimeout(() => setApiMessage(null), 3000)
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

  const renderSkillTags = (skills, type) => {
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
    <div className="explore-container">
      <Navbar/>
      <div className="explore-header">
        <h1 className="explore-title">Explore</h1>
        <p className="explore-subtitle">Find skilled people to swap knowledge with</p>
      </div>


      {apiMessage && (
        <div className={`api-message ${apiMessage.includes('success') || apiMessage.includes('sent') ? 'success' : 'error'}`}>
          {apiMessage}
        </div>
      )}

{/*      
      <div className="search-filters">
        <div className="search-bar">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input 
            type="text" 
            placeholder="Search by name, skill, or bio..."
            className="search-input"
          />
        </div>
        
        <div className="filter-dropdowns">
          <select className="filter-select">
            <option>All Categories</option>
          </select>
          
          <select className="filter-select">
            <option>Top Rated</option>
          </select>
        </div>
      </div> */}

      <div className="results-count">
        {matches.length} people found
      </div>

      {matches.length === 0 ? (
        <div className="no-matches">
          <h3>😕 No matches found</h3>
          <p>Try adding more skills to your profile to find better matches!</p>
        </div>
      ) : (
        <div className="matches-grid-explore">
          {matches.map((item, index) => {
            const compatibility = getCompatibility(item)
            
            return (
              <div key={item.id || index} className="match-card-explore">
                <div className="card-header">
                  <div className="user-info-header">
                    <img 
                      src={item.photo ? `http://localhost:8000${item.photo}` : '/default-avatar.png'} 
                      alt={item.username} 
                      className="profile-avatar-explore" 
                      onError={(e) => { e.target.src = '/default-avatar.png' }}
                    />
                    <div className="user-details">
                      <h3 className="user-name">{item.username}</h3>
                      <span className={`match-percentage ${
                        compatibility >= 80 ? 'high' : compatibility >= 50 ? 'medium' : 'low'
                      }`}>
                        {compatibility}% match
                      </span>
                    </div>
                  </div>
                  
             
                  {item.location && (
                    <div className="user-location">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>

                {item.rating && (
                  <div className="user-rating-explore">
                    <div className="stars-container">
                      {Array(Math.floor(item.rating)).fill().map((_, i) => (
                        <span key={i} className="star">⭐</span>
                      ))}
                      {Array(5 - Math.floor(item.rating)).fill().map((_, i) => (
                        <span key={`empty-${i}`} className="star empty">☆</span>
                      ))}
                    </div>
                    <span className="rating-count">({item.review_count || 0})</span>
                  </div>
                )}

                {item.bio && (
                  <p className="user-bio">{item.bio}</p>
                )}

                <div className="skills-section">
                  <div className="skill-category">
                    <h4 className="category-title">OFFERS</h4>
                    <div className="skills-list-explore">
                      {renderSkillTags(item.offers, 'offer')}
                    </div>
                  </div>

                  <div className="skill-category">
                    <h4 className="category-title">WANTS</h4>
                    <div className="skills-list-explore">
                      {renderSkillTags(item.learn, 'want')}
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="user-stats-explore">
                    {item.experience && (
                      <span className={`level-badge ${
                        item.experience >= 10 ? 'expert' : item.experience >= 5 ? 'specialist' : 'beginner'
                      }`}>
                        {item.experience >= 10 ? `Lv.${Math.floor(item.experience/2)} Expert` : 
                         item.experience >= 5 ? `Lv.${Math.floor(item.experience/2)} Specialist` : 
                         'Lv.1 Beginner'}
                      </span>
                    )}
                    {item.completed_swaps && (
                      <span className="sessions-count">{item.completed_swaps} sessions</span>
                    )}
                  </div>
                  
                  {isRequestSent(item.id, item.skill_id) ? (
                    <button className="btn-request-sent" disabled>
                      ✓ Request Sent
                    </button>
                  ) : (
                    <button 
                      className="btn-request-swap"
                      onClick={() => sendSwapRequest(item.id, item.skill_id)}
                    >
                      Request Swap
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
