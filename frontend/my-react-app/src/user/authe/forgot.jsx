
import { useState } from "react";
import api from "../../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('password-reset/', { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        placeholder="Enter your email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <button type="submit">Send Reset Link</button>
      <p>{message}</p>
    </form>
  );
}