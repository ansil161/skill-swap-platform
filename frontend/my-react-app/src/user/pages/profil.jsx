import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import "../styles/profile.css";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("schedule");
  const [scheduleView, setScheduleView] = useState("daily");
  const [editMode, setEditMode] = useState(false);
  const [skillsOffered, setSkillsOffered] = useState([]);
const [skillsWanted, setSkillsWanted] = useState([]);

const [newSkillOffered, setNewSkillOffered] = useState("");
const [newSkillWanted, setNewSkillWanted] = useState("");
const [profileImage, setProfileImage] = useState(null);
const [acceptedSwapRequests, setAcceptedSwapRequests] = useState([]);
const [selectedSwapRequestId, setSelectedSwapRequestId] = useState("");
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    experience: "",
    github_link: "",
    portfolio_link: "",
    title: "",
    skills_offered: [],
    skills_wanted: [],
    swap_terms: "1 hour for 1 hour"
  });
const [sessions, setSessions] = useState([]);
const navigate = useNavigate();





  const reviewsData = [
    {
      id: 1,
      author: "Kathryn Murphy",
      avatar: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      date: "2 days ago",
      skill: "React Development",
      comment: "Absolutely brilliant skill swap! Robert's deep knowledge of React, coupled with his engaging teaching style, made every session a pleasure!",
    },
  ];
const addSkillOffered = () => {
  if (!newSkillOffered.trim()) return;


  const tempSkill = {
    id: Date.now(),        
    skill_name: newSkillOffered
  };


  setSkillsOffered([...skillsOffered, tempSkill]);
  setNewSkillOffered("");

  
  api.post("skilloffer/", {
   
    skills: tempSkill.skill_name,
    experience_level: 1
  })
  .then((res) => {
   
    setSkillsOffered((prevSkills) =>
      prevSkills.map((skill) =>
        skill.id === tempSkill.id ? res.data : skill
      )
    );
  })
  .catch((err) => {
    console.log(err.response?.data?.message);
 
    setSkillsOffered((prevSkills) =>
      prevSkills.filter((skill) => skill.id !== tempSkill.id)
    );
    alert("Error adding skill");
  });
};

const addSkillWanted = () => {
  if (!newSkillWanted.trim()) return;

  const tempSkill = {
    id: Date.now(),
    skill_name: newSkillWanted
  };

  setSkillsWanted([...skillsWanted, tempSkill]);
  setNewSkillWanted("");

  api.post("skillwant/", {
    
    name: tempSkill.skill_name,
   
  })
  .then((res) => {
    setSkillsWanted((prevSkills) =>
      prevSkills.map((skill) =>
        skill.id === tempSkill.id ? res.data : skill
      )
    );
  })
  .catch((err) => {
    console.log(err.response?.data?.message);
    setSkillsWanted((prevSkills) =>
      prevSkills.filter((skill) => skill.id !== tempSkill.id)
    );
    alert("Error adding skill");
  });
};

useEffect(() => {
  api.get("sessionswap-requests/?status=accepted") 
    .then((res) => setAcceptedSwapRequests(res.data))
    .catch((err) => console.log(err.response?.data));
}, []);

  useEffect(() => {
    api.get(`profile/`)
      .then((res) => {
        const profile = res.data;
        setData(profile);
        setFormData({
          bio: profile.bio || "",
          location: profile.location || "",
          experience: profile.experience || "",
          github_link: profile.github_link || "",
          portfolio_link: profile.portfolio_link || "",
          title: profile.title || "",
          skills_offered: profile.skills_offered || [],
          skills_wanted: profile.skills_wanted || [],
          swap_terms: profile.swap_terms || "1 hour for 1 hour"
        });
      })
      .catch((err) => {
        console.log(err.response?.data);
      });
      api.get('skilloffer/')
.then((res)=>{
  setSkillsOffered(res.data)
})

api.get('skillwant/')
.then((res)=>{
  setSkillsWanted(res.data)
})

api.get("sessions/")
.then((res)=>{
  setSessions(res.data)
})
.catch((err)=>{
  console.log(err.response?.data)
})
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
const handleSubmit = (e) => {
  e.preventDefault();

  const form = new FormData();

  form.append("bio", formData.bio);
  form.append("location", formData.location);
  form.append("experience", formData.experience);
  form.append("github_link", formData.github_link);
  form.append("portfolio_link", formData.portfolio_link);
  form.append("title", formData.title);
  form.append("swap_terms", formData.swap_terms);

  if (profileImage) {
    form.append("profile_picture", profileImage);
  }

  api.patch(`profile/`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  .then((res) => {
    alert("Profile updated successfully!");
    setData(res.data.data);
    setEditMode(false);
  })
  .catch((err) => {
    console.log(err.response?.data);
    alert("Error updating profile");
  });
};

 const deleteOfferedSkill = (skillId) => {

  api.delete(`skilloffer/${skillId}/`)
  .then(() => {

    setSkillsOffered((prevSkills) =>
      prevSkills.filter((skill) => skill.id !== skillId)
    );

  })
  .catch((err) => {
    console.log(err.response?.data);
    alert("Error deleting offered skill");
  });

};

const deleteWantedSkill = (skillId) => {

  api.delete(`skillwant/${skillId}/`)
  .then(() => {

    setSkillsWanted((prevSkills) =>
      prevSkills.filter((skill) => skill.id !== skillId)
    );

  })
  .catch((err) => {
    console.log(err.response?.data);
    alert("Error deleting wanted skill");
  });

};
  const renderStars = (rating) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  const getRatingPercentage = (rating) => {
    return (rating / 5) * 100;
  };

  if (!data) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Profile...</p>
      </div>
    );
  }

 

  return (
    <div className="profile-page">

      <div className="profile-header-edu">
        <div className="profile-left">
          <div className="profile-avatar-container">
           {data.profile_picture && (
  <img 
    src={`http://localhost:8000${data.profile_picture}`} 
    alt={data.username} 
    className="profile-avatar-edu" 
  />
)}
            <span className="top-swapper-badge">TOP Swapper</span>
          </div>
          
          <div className="profile-info-edu">
            <div className="name-section">
              <h1>{data.username}</h1>
              {data.is_verified && <span className="verified-badge">✓</span>}
            </div>
            <p className="profile-title">{formData.title || "Skill Swap Partner"}</p>
            
            <div className="profile-stats-grid">
              <div className="stat-item">
                <span className="stat-icon">🔄</span>
                <span>{formData.experience || "0"}+ Years Experience</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">✓</span>
                <span>232 Swaps Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📚</span>
                <span>34 Skills Offered</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">👥</span>
                <span>250+ Swap Partners</span>
              </div>
            </div>

            {editMode && (
              <button className="edit-profile-btn" onClick={() => setEditMode(!editMode)}>
                Cancel Edit
              </button>
            )}
          </div>
        </div>

     
        <div className="rating-section">
          <div className="rating-header">
            <h3>Feedback (236)</h3>
            <button className="view-all-btn">View All →</button>
          </div>
          
          <div className="overall-rating-edu">
            <div className="rating-big">
              <div className="rating-number-large">4.9</div>
              <div className="stars-large">{renderStars(4.9)}</div>
              <div className="review-count">236 reviews</div>
            </div>
            
            <div className="rating-breakdown-edu">
              <div className="rating-bar-item">
                <span className="rating-label">Expertise</span>
                <div className="rating-bar-container">
                  <div className="rating-bar-fill" style={{ width: '98%' }}></div>
                </div>
                <span className="rating-value">4.9</span>
              </div>
              
              <div className="rating-bar-item">
                <span className="rating-label">Communication</span>
                <div className="rating-bar-container">
                  <div className="rating-bar-fill" style={{ width: '84%' }}></div>
                </div>
                <span className="rating-value">4.2</span>
              </div>
              
              <div className="rating-bar-item">
                <span className="rating-label">Reliability</span>
                <div className="rating-bar-container">
                  <div className="rating-bar-fill purple" style={{ width: '96%' }}></div>
                </div>
                <span className="rating-value">4.8</span>
              </div>
              
              <div className="rating-bar-item">
                <span className="rating-label">Teaching Skill</span>
                <div className="rating-bar-container">
                  <div className="rating-bar-fill purple" style={{ width: '98%' }}></div>
                </div>
                <span className="rating-value">4.9</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="bio-section-edu">
        <p>{formData.bio || "Enhance your skills through collaborative learning! I believe in mutual growth through skill sharing. Whether you're a beginner or advanced, I'm here to help you master new technologies while learning from you!"}</p>
      </div>

   
<div className="skills-section-edu">

  <div className="skills-column">
    <h4>Skills I Offer</h4>

    <div className="skill-tags">
{skillsOffered.map((skill) => (
  <span key={skill.id} className="skill-tag offered">

    {skill.skills}

    <button
      onClick={() => deleteOfferedSkill(skill.id)}
      style={{ marginLeft: "6px" }}
    >
      ❌
    </button>

  </span>
))}

    </div>

    <input
    type="text"
    placeholder="Add skill"
    value={newSkillOffered}
    onChange={(e)=>setNewSkillOffered(e.target.value)}
    />

    <button onClick={addSkillOffered}>
      Add
    </button>

  </div>



  <div className="skills-column">

    <h4>Skills I Want</h4>

    <div className="skill-tags">

{skillsWanted.map((skill) => (
  <span key={skill.id} className="skill-tag wanted">

    {skill.name}

    <button
      onClick={() => deleteWantedSkill(skill.id)}
      style={{ marginLeft: "6px" }}
    >
      ❌
    </button>

  </span>
))}

    </div>

    <input
    type="text"
    placeholder="Add skill"
    value={newSkillWanted}
    onChange={(e)=>setNewSkillWanted(e.target.value)}
    />

    <button onClick={addSkillWanted}>
      Add
    </button>

  </div>

</div>


      {editMode && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit} className="edit-form-edu">
              <div className="form-group">
                <label>Title</label>
                <input
                  name="title"
                  placeholder="e.g., Full Stack Developer"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  name="location"
                  placeholder="e.g., London, UK"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="experience"
                  placeholder="5"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
  <label>Profile Photo</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => setProfileImage(e.target.files[0])}
  />
</div>

              <div className="form-group">
                <label>Swap Terms</label>
                <input
                  name="swap_terms"
                  placeholder="1 hour for 1 hour"
                  value={formData.swap_terms}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>GitHub Profile</label>
                <input
                  name="github_link"
                  placeholder="https://github.com/username"
                  value={formData.github_link}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Portfolio Link</label>
                <input
                  name="portfolio_link"
                  placeholder="https://yourportfolio.com"
                  value={formData.portfolio_link}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  placeholder="Tell us about yourself and what skills you want to swap..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setEditMode(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      <div className="tabs-section-edu">
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === "schedule" ? "active" : ""}`}
            onClick={() => setActiveTab("schedule")}
          >
            Swap Schedule
          </button>
          <button 
            className={`tab-btn ${activeTab === "skills" ? "active" : ""}`}
            onClick={() => setActiveTab("skills")}
          >
            My Skills (34)
          </button>
          <button 
            className={`tab-btn ${activeTab === "feedback" ? "active" : ""}`}
            onClick={() => setActiveTab("feedback")}
          >
            Feedback
          </button>
          <button 
            className={`tab-btn ${activeTab === "sessions" ? "active" : ""}`}
            onClick={() => setActiveTab("sessions")}
          >
            Sessions
          </button>
        </div>
       <div className="schedule-session-dropdown">
  {acceptedSwapRequests.length === 0 ? (
    <p>No accepted swap requests to schedule.</p>
  ) : (
    <>
      <select
        value={selectedSwapRequestId}
        onChange={(e) => setSelectedSwapRequestId(e.target.value)}
      >
        <option value="">Select a swap request</option>
        {acceptedSwapRequests.map((sr) => (
          <option key={sr.id} value={sr.id}>
            {sr.partner.user.username} - {sr.skill_name}
          </option>
        ))}
      </select>

      <button
        className="add-event-btn"
        disabled={!selectedSwapRequestId}
        onClick={() => navigate(`/schedule/${selectedSwapRequestId}`)}
      >
        + Schedule Session
      </button>
    </>
  )}
</div>
      </div>

   
      <div className="main-content-edu">
        <div className="content-left">
          {activeTab === "schedule" && (
            <>
              <div className="schedule-header">
                <h3>Swap Schedule</h3>
                <div className="schedule-view-tabs">
                  <button 
                    className={`view-tab ${scheduleView === "daily" ? "active" : ""}`}
                    onClick={() => setScheduleView("daily")}
                  >
                    Daily
                  </button>
                  <button 
                    className={`view-tab ${scheduleView === "weekly" ? "active" : ""}`}
                    onClick={() => setScheduleView("weekly")}
                  >
                    Weekly
                  </button>
                  <button 
                    className={`view-tab ${scheduleView === "monthly" ? "active" : ""}`}
                    onClick={() => setScheduleView("monthly")}
                  >
                    Monthly
                  </button>
                  <button 
                    className={`view-tab ${scheduleView === "list" ? "active" : ""}`}
                    onClick={() => setScheduleView("list")}
                  >
                    List
                  </button>
                </div>
              </div>

             <div className="schedule-grid">
  {sessions.length === 0 && <p>No scheduled swaps yet</p>}
  {sessions.map((session, index) => {
    const sessionDate = new Date(session.date); 
    const day = sessionDate.toLocaleDateString("en-US", { weekday: "short" });
    const date = sessionDate.toLocaleDateString();
    const time = sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const partners = session.partners_count || 0; 
    const skill = session.skill_name || "Skill Swap"; 

    return (
      <div key={index} className="schedule-card">
        <div className="schedule-day">
          <span className="day-name">{day}</span>
          <span className="day-date">{date}</span>
        </div>
        <div className="schedule-time">{time}</div>
        <div className="schedule-subject">{skill}</div>
        {partners > 0 && (
          <div className="student-avatars">
            {Array.from({ length: Math.min(partners, 3) }).map((_, i) => (
              <div key={i} className="mini-avatar"></div>
            ))}
            {partners > 3 && <span className="more-students">+{partners - 3}</span>}
          </div>
        )}
      </div>
    );
  })}
</div>
            </>
          )}

          {activeTab === "skills" && (
            <div className="tab-content-edu">
              <h3>My Skills Portfolio</h3>
              <div className="skills-detail-grid">
                {["React", "Node.js", "UI/UX Design", "JavaScript", "Python", "MongoDB", "PostgreSQL", "Docker"].map((skill, index) => (
                  <div key={index} className="skill-card-edu">
                    <h4>{skill}</h4>
                    <p>Level: Advanced</p>
                    <p className="availability">Available for swap</p>
                    <div className="skill-progress">
                      <div className="progress-bar" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "feedback" && (
            <div className="feedback-section-edu">
              <h3>All Feedback</h3>
              {reviewsData.map((review) => (
                <div key={review.id} className="feedback-card-edu">
                  <div className="feedback-header-edu">
                    <img src={review.avatar} alt={review.author} className="feedback-avatar-edu" />
                    <div className="feedback-info-edu">
                      <h4>{review.author}</h4>
                      <div className="feedback-stars-edu">{renderStars(review.rating)}</div>
                      <span className="feedback-date-edu">{review.date}</span>
                      <span className="feedback-skill-tag">{review.skill}</span>
                    </div>
                  </div>
                  <p className="feedback-comment-edu">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

        {activeTab === "sessions" && (
  <div className="tab-content-edu">
    <h3>Swap Session History</h3>

    <div className="sessions-list">

      {sessions.length === 0 && (
        <p>No sessions yet</p>
      )}

      {sessions.map((session) => (
        <div key={session.id} className="session-item">

          <div className="session-date">
            {session.date}
          </div>

          <div className="session-details">
            <h4>Skill Swap Session</h4>

            <p>
              Duration: {session.duration} minutes
            </p>

            <p>
              Status: {session.status}
            </p>

          </div>

        </div>
      ))}

    </div>
  </div>
)}
        </div>

       
        <div className="content-right">
   
          <div className="reviews-sidebar">
            <h4>Recent Feedback</h4>
            {reviewsData.map((review) => (
              <div key={review.id} className="review-card-edu">
                <div className="review-header-edu">
                  <img src={review.avatar} alt={review.author} className="review-avatar-edu" />
                  <div className="review-author-info-edu">
                    <h4>{review.author}</h4>
                    <div className="review-stars-edu">{renderStars(review.rating)}</div>
                    <span className="review-skill-tag-edu">{review.skill}</span>
                  </div>
                </div>
                <p className="review-comment-edu">{review.comment}</p>
              </div>
            ))}
          </div>


          <div className="classroom-section">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800" 
              alt="Skill Swap Session" 
              className="classroom-image" 
            />
          </div>

  
          <div className="price-section">
            <span className="price-label">Swap Terms</span>
            <span className="price-value">{formData.swap_terms}</span>
          </div>

          <div className="quick-links-section">
            <h4>Quick Links</h4>
            {formData.github_link && (
              <a href={formData.github_link} target="_blank" rel="noreferrer" className="quick-link">
                <span>🔗</span> GitHub Profile
              </a>
            )}
            {formData.portfolio_link && (
              <a href={formData.portfolio_link} target="_blank" rel="noreferrer" className="quick-link">
                <span>🌐</span> Portfolio
              </a>
            )}
            <button className="quick-link" onClick={() => setEditMode(true)}>
              <span>✏️</span> Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;