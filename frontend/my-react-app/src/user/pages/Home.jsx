import React, { useState } from 'react';
import '../styles/home.css';
import { useNavigate } from "react-router-dom";
import Navbar from '../component/navbar';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  function handlelogin(){
    navigate('/login');
  }

  return (
    <div className="homepage">
      

      <Navbar />


      <section className="hero-section" id="home">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Learn & Grow Together<br />
              <span className="highlight">In Our Community</span>
            </h1>
            <p className="hero-description">
              Join a thriving community where you can swap skills, build connections, 
              and grow together. Share your knowledge and learn from others.
            </p>
            
            <div className="hero-buttons">
              <button className="btn-primary">
                Join Our Community
                <span className="btn-icon">→</span>
              </button>
              <button className="btn-secondary">
                <span className="play-icon">▶</span>
                See How It Works
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10k+</span>
                <span className="stat-label">Community Members</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Active Groups</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50k+</span>
                <span className="stat-label">Skills Exchanged</span>
              </div>
            </div>
          </div>

          <div className="hero-images">
            <div className="profile-card profile-card-1">
              <div className="profile-image">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" alt="Community Member" />
              </div>
              <div className="profile-info">
                <span className="profile-name">Marcus Johnson</span>
                <span className="profile-skill">Teaching: Web Dev</span>
              </div>
            </div>

            <div className="profile-card profile-card-2">
              <div className="profile-image">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" alt="Community Member" />
              </div>
              <div className="profile-info">
                <span className="profile-name">Sarah Williams</span>
                <span className="profile-skill">Learning: Design</span>
              </div>
            </div>

            <div className="floating-card">
              <div className="card-icon">👥</div>
              <div className="card-text">
                <span className="card-title">Join Community</span>
                <span className="card-subtitle">Connect & Learn</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section" id="community">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">Build Connections, Share Knowledge</h2>
            <p className="section-subtitle">
              Our community-driven platform helps you learn and grow together
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3 className="feature-title">Skill Exchange</h3>
              <p className="feature-description">
                Trade your expertise with community members. Teach what you know, learn what you don't.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Study Groups</h3>
              <p className="feature-description">
                Join or create study groups with like-minded learners. Collaborate and motivate each other.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3 className="feature-title">Community Forums</h3>
              <p className="feature-description">
                Ask questions, share resources, and engage in discussions with our active community.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Peer Mentoring</h3>
              <p className="feature-description">
                Get matched with peers for one-on-one mentoring sessions. Learn at your own pace.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3 className="feature-title">Community Events</h3>
              <p className="feature-description">
                Participate in workshops, webinars, and networking events organized by the community.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3 className="feature-title">Achievement Badges</h3>
              <p className="feature-description">
                Earn badges for contributions, help others, and showcase your community impact.
              </p>
            </div>
          </div>
        </div>
      </section>

    
      <section className="how-it-works-section" id="how-it-works">
        <div className="how-it-works-container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Join our community in three simple steps
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Join the Community</h3>
              <p className="step-description">
                Create your profile and tell us what skills you can teach and what you want to learn.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Connect & Match</h3>
              <p className="step-description">
                Find community members with complementary skills. Connect and schedule learning sessions.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Learn & Teach</h3>
              <p className="step-description">
                Start exchanging knowledge. Teach others your expertise while learning new skills.
              </p>
            </div>
          </div>
        </div>
      </section>

  
      <section className="impact-section">
        <div className="impact-container">
          <div className="impact-content">
            <h2 className="impact-title">Join Our Growing Community</h2>
            <p className="impact-description">
              Be part of a movement where everyone is both a teacher and a learner. 
              Share your knowledge, gain new skills, and build lasting connections.
            </p>
            <ul className="impact-list">
              <li>✓ Free to join and participate</li>
              <li>✓ Supportive and inclusive community</li>
              <li>✓ Learn at your own pace</li>
              <li>✓ Build your personal network</li>
              <li>✓ Make a difference by helping others</li>
            </ul>
            <button className="btn-impact">Become a Member</button>
          </div>
          <div className="impact-image">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" alt="Community learning together" />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="logo-icon">◆</span>
            <span className="logo-text">SkillSwap</span>
            <p className="footer-tagline">Learn. Teach. Grow Together.</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Community</h4>
              <a href="#forums">Forums</a>
              <a href="#groups">Study Groups</a>
              <a href="#events">Events</a>
              <a href="#mentors">Mentors</a>
            </div>
            
            <div className="footer-column">
              <h4>Platform</h4>
              <a href="#how-it-works">How It Works</a>
              <a href="#features">Features</a>
              <a href="#success-stories">Success Stories</a>
            </div>
            
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#help">Help Center</a>
              <a href="#contact">Contact Us</a>
              <a href="#community-guidelines">Community Guidelines</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 SkillSwap Community. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;