import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import Navbar from '../component/navbar';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import '../styles/dashboard.css';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const[user,setuser]=useState(null)
  const[skillwa,setskillwa]=useState([])
  const[skilloff,setskilloff]=useState([])
  const[match,setmatch]=useState(null)
  const[progress,setprogress]=useState([])
  const [sessions, setSessions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigate=useNavigate

  useEffect(()=>{
       api.get('user/profile/')
    .then((res)=>{
      setuser(res.data)
      

    })
    .catch(err=>{
      console.log(err?.response?.data)
    })

          api.get('skills/skillwant/')
    .then((res)=>{
      setskillwa(res.data)
    

    })
    .catch(err=>{
      console.log(err?.response?.data)
    })
              api.get('skills/skilloffer/')
    .then((res)=>{
      setskilloff(res.data)
      

    })
    .catch(err=>{
      console.log(err?.response?.data)
    })

    
           api.get('swaps/matching/')
    .then((res)=>{
      setmatch(res.data)
      console.log('matck',res.data)

    })
    .catch(err=>{
      console.log(err?.response?.data)
    })


  },[])


  const pointsChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Points',
        data: [120, 250, 350, 420],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const activityChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sessions',
        data: [1, 0, 2, 1, 0, 1, 0],
        backgroundColor: '#667eea',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: true, color: '#f0f0f0' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="dashboard">
      <Navbar />
      
   
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            {/* <div className="avatar-container">
              <div className="user-icon">
                <i className="fas fa-user"></i>
              </div>
              <span className="status-indicator"></span>
            </div> */}
            <div className="user-details">
              <h1 className="welcome-text">Welcome back, {user?.username}!</h1>
              <div className="user-badges">
                <span className="badge badge-purple">Lv4 Practitioner</span>
                <span className="points-text">420 points</span>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={()=>nav}>
              <i className="fas fa-user-plus"></i>
              <span>Find Partners</span>
            </button>
            <button className="btn btn-primary">
              <i className="fas fa-exchange-alt"></i>
              <span>Requests</span>
              <span className="notification-badge">0</span>
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">

        <div className="progress-card">
          <div className="progress-header">
            <div>
              <p className="progress-label">Level Progress</p>
              <h2 className="progress-title">Practitioner → Specialist</h2>
            </div>
            {/* <div className="progress-stats">
              <p className="progress-current">420 / 500 pts</p>
              <p className="progress-remaining">80 pts to next level</p>
            </div> */}
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: '84%' }}></div>
          </div>
        </div>

      
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-purple">
              <i className="fas fa-bolt"></i>
            </div>
            <div className="stat-content">
              <span className="stat-value">{user?.swap_count}</span>
              <span className="stat-label">Swap Count</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <span className="stat-value">3</span>
              <span className="stat-label">Sessions Completed</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-orange">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <span className="stat-value">0</span>
              <span className="stat-label">Pending Requests</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-yellow">
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-content">
              <span className="stat-value">{user?.rating}★</span>
              <span className="stat-label">Avg. Rating</span>
            </div>
          </div>
        </div>

     
        <div className="content-grid">
          <div className="content-left">
        
            <div className="skills-section">
              <div className="skills-column">
                <h3 className="skills-title">SKILLS I OFFER</h3>
                <div className="skills-list">
  {skilloff?.map((item) => (
    <span key={item.id} className="skill-tag skill-tag-purple">
      {item.skills}
    </span>
  ))}
</div>
              </div>
              <div className="skills-column">
                <h3 className="skills-title">SKILLS I WANT</h3>
               <div className="skills-list">
  {skillwa?.map((item) => (
    <span key={item.id} className="skill-tag">
      {item.name}
    </span>
  ))}
</div>
              </div>
            </div>

      
            <div className="dual-grid">
        
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Learning Progress</h3>
                  <button className="link-button">View all</button>
                </div>
                <div className="progress-list">

{progress?.length === 0 ? (

  <p className="no-data">No learning progress yet</p>

) : (

  progress.map((p, index) => (
    <div className="progress-item" key={index}>

      <div className="progress-item-header">
        <span className="progress-item-title">{p.skill}</span>
        <span className="progress-item-count">
          {p.completed}/{p.total} sessions
        </span>
      </div>

      <div className="progress-item-bar">
        <div
          className="progress-item-fill"
          style={{ width: `${p.percentage}%` }}
        ></div>
      </div>

      {p.last_session && (
        <p className="progress-item-date">
          Last session: {p.last_session}
        </p>
      )}

    </div>
  ))

)}

</div>
              </div>

        
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <i className="fas fa-magic"></i>
                     Matches
                  </h3>
                  <button className="link-button">See more</button>
                </div>
               <div className="matches-list">
                {match?.map((m) => (
                  <div className="match-item" key={m.id}>
                    <div className="match-info">
  <img
    src={`http://127.0.0.1:8000${m.photo}`}
    className="match-avatar"
  />

  <div className="match-details">
    <p className="match-name">{m.username}</p>
    <p className="match-skill">
      {m.offers} ↔ {m.learn.join(", ")}
    </p>
  </div>
</div>
              
                    {/* <span className="match-percentage">96%</span> */}
                  </div>
                ))}
              </div>
                <button className="btn btn-outline btn-full">
                  <i className="fas fa-robot"></i>
                  View more
                </button>
              </div>
            </div>

           
<div className="card">
  <div className="card-header">
    <h3 className="card-title">
      <i className="fas fa-star"></i>
      Recent Reviews
    </h3>
  </div>

  <div className="reviews-list">

    {reviews.length === 0 ? (

      <p className="no-data">No reviews yet</p>

    ) : (

      reviews.map((r, index) => (

        <div className="review-item" key={index}>

          <div className="review-header">
            <div className="reviewer-info">
              <div>
                <p className="reviewer-name">{r.name}</p>

                <div className="review-stars">
                  {[1,2,3,4,5].map((star) => (
                    <i
                      key={star}
                      className={
                        star <= r.rating
                        ? "fas fa-star"
                        : "far fa-star"
                      }
                    ></i>
                  ))}
                </div>

              </div>
            </div>
          </div>

          <p className="review-text">{r.comment}</p>

          <p className="review-date">{r.date}</p>

        </div>

      ))

    )}

  </div>
</div>

            {/* <div className="dual-grid">
              <div className="card">
                <h3 className="card-title">
                  <i className="fas fa-chart-line"></i>
                  Points Growth
                </h3>
                <div className="chart-container">
                  <Line data={pointsChartData} options={chartOptions} />
                </div>
              </div>

              <div className="card">
                <h3 className="card-title">
                  <i className="fas fa-calendar-alt"></i>
                  Session Activity
                </h3>
                <div className="chart-container">
                  <Bar data={activityChartData} options={chartOptions} />
                </div>
              </div>
            </div> */}
          </div>

          <div className="content-right">
          
<div className="card">
  <div className="card-header">
    <h3 className="card-title">
      <i className="fas fa-clock"></i>
      Upcoming Sessions
    </h3>
  </div>

  {sessions.length === 0 ? (

    <p className="no-data">No upcoming sessions</p>

  ) : (

    sessions.map((s, index) => (
      <div className="session-item" key={index}>
        <div className="session-info">
          <div className="session-details">

            <p className="session-title">
              {s.skill} with {s.partner}
            </p>

            <p className="session-time">
              <i className="far fa-calendar"></i>
              {s.type} · {s.date} {s.time}
            </p>

            <span className="session-tag">
              {s.skill}
            </span>

          </div>
        </div>
      </div>
    ))

  )}

</div>

     
            <div className="quick-actions-card">
              <h3 className="card-title text-white">Quick Actions</h3>
              <div className="quick-actions-list">
                <button className="quick-action-btn">
                  <i className="fas fa-plus-circle"></i>
                  New Session
                </button>
                <button className="quick-action-btn">
                  <i className="fas fa-search"></i>
                  Find Learning Partner
                </button>
                <button className="quick-action-btn">
                  <i className="fas fa-certificate"></i>
                  View Achievements
                </button>
              </div>
            </div>

           
<div className="card">
  <h3 className="card-title">Notifications</h3>

  <div className="notifications-list">

    {notifications.length === 0 ? (

      <p className="no-data">No notifications</p>

    ) : (

      notifications.map((n, index) => (
        <div
          key={index}
          className={`notification-item notification-${n.type}`}
        >
          <span className="notification-dot"></span>

          <div className="notification-content">
            <p className="notification-text">
              {n.message}
            </p>

            <p className="notification-time">
              {n.time}
            </p>
          </div>
        </div>
      ))

    )}

  </div>
</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;