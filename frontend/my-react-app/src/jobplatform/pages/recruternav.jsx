

import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./recruiterNavbar.css";

export default function RecruiterNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("logout/", {}, { withCredentials: true }); 
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>SkillSwap Recruiter</h2>
      </div>

      <ul className="navbar-links">
        <li className={isActive("/dashboard") ? "active" : ""}>
          <Link to="/recruiter/dashboard">Dashboard</Link>
        </li>

        <li className={isActive("/create-job") ? "active" : ""}>
          <Link to="/recruiter/create-job">Post Job</Link>
        </li>

        <li className={isActive("/applications") ? "active" : ""}>
          <Link to="/recruiter/applications">Applicants</Link>
        </li>

        <li className={isActive("/profile") ? "active" : ""}>
          <Link to="/recruiter/profile">Profile</Link>
        </li>
      </ul>

      <div className="navbar-actions">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}