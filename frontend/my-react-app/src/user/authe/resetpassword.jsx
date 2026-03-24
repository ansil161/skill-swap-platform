// ResetPassword.jsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import "../styles/resetpass.css";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      await api.post(`auth/password-reset-confirm/${uid}/${token}/`, { 
        password 
      });
      
      toast.error("Password reset successfully!");
      setPassword('');
      setConfirmPassword('');
     
      window.location.href = "/login"; 
    } catch (err) {
      const errorMsg = err.response?.data?.error
      toast.error(errorMsg);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2 className="reset-title">SkillSwap</h2>
        <p className="reset-subtitle">Enter your new password below</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              New Password
            </label>
            <input 
              id="password"
              type="password" 
              className="form-input"
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label">
              Confirm Password
            </label>
            <input 
              id="confirm-password"
              type="password" 
              className="form-input"
              placeholder="••••••••" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}