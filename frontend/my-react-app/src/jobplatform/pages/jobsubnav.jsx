
import { NavLink, useLocation } from "react-router-dom";
import "../styles/jobsubnav.css";

export default function JobsSubNavbar() {
  const location = useLocation();
  
  return (
    <nav className="jobs-sub-navbar">
      <div className="nav-container">
        <div className="nav-tabs">
          <NavLink 
            to="/jobs" 
            end
            className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}
          >
            <span className="tab-icon">📋</span>
            All Jobs
          </NavLink>
          
          <NavLink 
            to="/myapplylist"
            className={({ isActive }) => isActive ? 'nav-tab active' : 'nav-tab'}
          >
            <span className="tab-icon">✓</span>
            Applied
          </NavLink>
        </div>
        
        <div className="nav-divider"></div>
        
        <div className="nav-info">
          <span className="info-text">Browse and apply to opportunities</span>
        </div>
      </div>
    </nav>
  );
}