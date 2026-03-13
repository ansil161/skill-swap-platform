import { useEffect, useState } from "react"
import api from "../../api/axios"
import '../styles/match.css'

function Match() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    getMatches()
    getCurrentUser()
  }, [])

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
  console.log(matches)

  function sendSwapRequest(matchedUserId) {
    api.post("swaprequest/", {
      receiver: matchedUserId,
      message: "I'd like to swap skills with you!"
    })
      .then(() => {
        alert("Swap request sent successfully!")
      })
      .catch((err) => {
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

  if (loading) {
    return <div className="loading">Finding your perfect skill matches...</div>
  }

  return (
    <div className="match-container">
      <div className="match-header">
        <h2>🎯 Recommended Skill Partners</h2>
        <p>Based on your skills and learning goals</p>
      </div>

      {matches && matches.length === 0 ? (
        <div className="no-matches">
          <h3>No matches found yet</h3>
          <p>Try adding more skills to your profile to find better matches!</p>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((item, index) => {
            const compatibility = getCompatibility(item)
            
            return (
              <div key={index} className="match-card">
                <div className="match-header-section">
                  <div className="user-info">
                   <img 
    src={`http://localhost:8000${item.photo}`} 
    alt={item.username} 
    className="profile-avatar-edu" 
  />
                    <div>
                      <h3>{item.username}</h3>
                      <span className="match-badge">
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
                     
                        <span key={index} className="skill-tag offer">
                          {item.offers}
                        </span>
                    
                    </div>
                  </div>

                  <div className="skill-section">
                    <h4>🎓 Wants to Learn:</h4>
                    <div className="skills-list">
                      
                        <span key={index} className="skill-tag want">
                          {item.learn}
                        </span>
                     
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
                  <button 
                    className="btn-primary"
                    onClick={() => sendSwapRequest(item.id)}
                  >
                    🤝 Send Swap Request
                  </button>
                  <button className="btn-secondary">
                    View Profile
                  </button>
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