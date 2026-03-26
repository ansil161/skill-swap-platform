import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../styles/recruterprf.css";
import RecruiterNavbar from "./recruternav";

export default function RecruiterProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("jobs/recruiter/profile/")
      .then(res => {
        setProfile(res.data);
        console.log(res.data)
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-wrapper">
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {profile?.username?.charAt(0).toUpperCase() || "R"}
          </div>
          <h1>{profile?.username}</h1>
          <p className="role">Recruiter</p>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <span className="label">Email</span>
            <span className="value">{profile?.email}</span>
          </div>

          <div className="detail-item">
            <span className="label">Company</span>
            <span className="value">{profile?.company}</span>
          </div>
        </div>
      </div>
    </div>
  );
}