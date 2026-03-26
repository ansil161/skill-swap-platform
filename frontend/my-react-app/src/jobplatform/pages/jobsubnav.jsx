// JobsSubNavbar.jsx
import { NavLink } from "react-router-dom";
import "../styles/jobsubnav.css";

export default function JobsSubNavbar() {
  return (
    <div className="jobs-sub-navbar">
      
      <div className="left">
        <NavLink to="/jobs" end>All Jobs</NavLink>
        <NavLink to="/myapplylist">Applied</NavLink>

      </div>

    
    </div>
  );
}