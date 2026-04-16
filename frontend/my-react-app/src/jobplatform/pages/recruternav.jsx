import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../styles/recruternav.css";

export default function RecruiterNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

const handleLogout = () => {
  // remove JWT tokens
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");


  delete api.defaults.headers.common["Authorization"];


  toast.success("User logged out");


  navigate("/login");
};

  const isActive = (path) => location.pathname.includes(path);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>SkillSwap <span>Recruiter</span></h2>
      </div>

   <ul className="navbar-links">
  <li className={isActive("/dashrec") ? "active" : ""}>
    <span onClick={() => navigate("/dashrec")}>Dashboard</span>
  </li>

  <li className={isActive("/create-job") ? "active" : ""}>
    <span onClick={() => navigate("/create-job")}>
      Post Job
    </span>
  </li>

  <li className={isActive("/applications") ? "active" : ""}>
    <span onClick={() => navigate("/interviewsch" )}>
      Applicants
    </span>
  </li>

  <li className={isActive("/profile") ? "active" : ""}>
    <span onClick={() => navigate("/recriterprofile")}>
      Profile
    </span>
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