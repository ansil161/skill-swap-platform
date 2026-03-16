
import { useState } from "react";
import api from "../../api/axios";
import "../styles/forgot.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    try {
      await api.post('password-reset/', { email });
      alert("Reset link sent! Please check your email.");
      setEmail('');
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Something went wrong. Please try again.";
      alert(errorMsg);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2 className="reset-title">SkillSwap</h2>
        <p className="reset-subtitle">Enter your email to reset your password</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input 
              id="email"
              type="email" 
              className="form-input"
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}