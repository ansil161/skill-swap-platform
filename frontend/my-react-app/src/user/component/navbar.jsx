import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';  
import '../styles/navbar.css';
import api from '../../api/axios';
import NotificationBell from './notification';

import { 
  faBolt, faThLarge, faSearch, faExchangeAlt, 
  faCalendar, faMagic, faSun, faBell, faChevronDown, 
  faUser, faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const[user,setuser]=useState(null)
  const dropdownRef = useRef(null);
  const navigate = useNavigate();  
  const location = useLocation();  

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  
  useEffect(() => {

    api.get('user/profile/')
    .then((res)=>{
      setuser(res.data)
      console.log(res.data)

    })
    .catch(err=>{
      console.log(err?.response?.data)
      setuser(null)
    })
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

    
  }, []);

  
  const isActive = (path) => {
    return location.pathname === path;
  };

  
  const handleNavigate = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  
  const handleLogout = () => {
    api.post('auth/logout/')
    .then((res)=>{
      toast.success('user is log out')
      navigate('/login')
    })
    .catch(err=>{
      toast.error(err.response?.data?.message);
      console.log(err?.response?.message?.data)
    })
    
    
  };

  return (
    <nav className="navbar-container">
    
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <div className="logo-icon">
          <FontAwesomeIcon icon={faBolt} />
        </div>
        <span className="brand-name">SkillSwap</span>
      </div>

      <ul className="nav-menu">
        <li>
          <div 
            className={`nav-item ${isActive('/dash') ? 'active' : ''}`} 
            onClick={() => navigate('/dash')}
          >
            <FontAwesomeIcon icon={faThLarge} />
            <span>Dashboard</span>
          </div>
        </li>
        <li>
          <div 
            className={`nav-item ${isActive('/match') ? 'active' : ''}`} 
            onClick={() => navigate('/match')}
          >
            <FontAwesomeIcon icon={faSearch} />
            <span>Explore</span>
          </div>
        </li>
        <li>
          <div 
            className={`nav-item ${isActive('/request') ? 'active' : ''}`} 
            onClick={() => navigate('/request')}
          >
            <FontAwesomeIcon icon={faExchangeAlt} />
            <span>Requests</span>
          </div>
        </li>
        <li>
          <div 
            className={`nav-item ${isActive("/sessions" ) ? 'active' : ''}`} 
            onClick={() => navigate("/sessions" )}
          >
            <FontAwesomeIcon icon={faCalendar} />
            <span>Sessions</span>
          </div>
        </li>
        <li>
          <div 
            className={`nav-item ${isActive("/jobs") ? 'active' : ''}`} 
            onClick={() => navigate("/jobs")}
          >
            <FontAwesomeIcon icon={faMagic} />
            <span>jobs</span>
          </div>
        </li>
      </ul>

    
  <div className="navbar-right">
  <NotificationBell/>
  {user ? (
    <div className="user-dropdown-wrapper" ref={dropdownRef}>
      <div className="user-trigger" onClick={toggleDropdown}>
        <img 
          src={`http://127.0.0.1:8000${user?.profile_picture || '/media/default-avatar.png'}`}
          alt={user?.username} 
          className="user-avatar" 
        />
        <span className="user-name">{user?.username}</span>
        <FontAwesomeIcon 
          icon={faChevronDown} 
          className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} 
        />
      </div>

      <div className={`dropdown-menu ${isDropdownOpen ? 'active' : ''}`}>
        <div className="dropdown-header">
          <div className="dropdown-user-name">{user?.username}</div>
          <div className="dropdown-user-email">{user?.email}</div>
        </div>

        <div className="dropdown-item" onClick={() => handleNavigate('/profile')}>
          <FontAwesomeIcon icon={faUser} />
          <span>My Profile</span>
        </div>

        <div className="dropdown-item sign-out" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Sign Out</span>
        </div>
      </div>
    </div>
  ) : (
    <button className="login-btn" onClick={() => navigate('/login')}>
      Login
    </button>
  )}
</div>
    </nav>
  );
};

export default Navbar;