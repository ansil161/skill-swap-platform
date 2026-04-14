import React from 'react';
import '../styles/login.css'
import { useState } from 'react';
import api from '../../api/axios';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from "@react-oauth/google"
import { toast } from 'react-toastify';
function Login() {

const [state, setState] = useState({
    email: '',
    password: ''
})


const nav=useNavigate()

const handleChange = (e) => {
    setState({
        ...state,
        [e.target.name]: e.target.value
    })
}

const handleLogin = (e) => {
    e.preventDefault()

    api.post('auth/Login/', state)
    .then((res)=>{

            localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    console.log('refrs',res.data.refresh)
        console.log('haiuser',res.data)
        const role = res.data.user.role
        console.log('iwa',role)
        if(role === 'recruiter'){
            nav("/dashrec");

        } else if(role=='admin'){
            nav("/admin")

        }
        else {
            nav('/dash');
        }

        toast.success("Login successful");
     
        
    })
    .catch((err)=>{
        console.log(err.response.data)
        toast.error(err.response?.data?.message || "Registration failed");
    })
}


const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
        api.post("auth/google-login/", {
            token: tokenResponse.access_token
        }).then((response) => {
            // IMPORTANT: You must save the tokens here too!
            // Note: Make sure your backend GoogleLogin view returns 'access' and 'refresh' in the JSON body
            if (response.data.access) {
                localStorage.setItem("access", response.data.access);
                localStorage.setItem("refresh", response.data.refresh);
                nav("/dash");
            }
        }).catch(err => {
            console.error("Google Login Failed", err);
        });
    }
});

    return (
        <div className="login-container">
            
  
            <div className="login-left-panel">
                <div className="illustration-wrapper">
                    <div className="floating-card">
                        <div className="card-header">
                            <div className="avatar-placeholder">S</div>
                            <div className="status-badge">Active</div>
                        </div>
                        <div className="chat-bubble left">
                            <p>I can teach you React JS!</p>
                        </div>
                        <div className="chat-bubble right">
                            <p>Great! I can teach you UI Design.</p>
                        </div>
                        <button className="accept-btn">Accept Swap</button>
                    </div>
                  
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>
                </div>

                <div className="left-text-content">
    <h2>
        Facilitate interaction between <span className="highlight-blue">Mentors</span> and <span className="highlight-purple">Students</span> online
    </h2>
    <p>Join the community and start swapping skills today.</p>
</div>
            </div>

    
            <div className="login-right-panel">
                <div className="form-wrapper">
                    <div className="logo-area">
                        <div className="logo-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </div>
                        <h1 className="brand-name">SkillSwap</h1>
                    </div>

                    <div className="header-text">
    <h3>Hi, welcome back!</h3>
    <p>Please sign in to continue</p>
</div>

                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="input-group">
                            <label htmlFor="email" >Email Address</label>
                            <div className="input-field-wrapper">
                                <span className="input-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                                </span>
                                <input type="email" id="email" name="email" placeholder="Enter your email" value={state.email} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-field-wrapper">
                                <span className="input-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </span>
                                <input type="password" id="password" name="password" placeholder="Enter your password" value={state.password} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-actions">
                           
                            <a href="/forgote" className="forgot-link">Forgot password?</a>
                        </div>

                        <button type="submit" className="submit-btn" >Sign In</button>

                        <div className="divider">
                            <span>Or login with</span>
                        </div>

<div className="social-login">
    
   <button 
    type="button" 
    className="social-btn google"
    onClick={() => googleLogin()}
>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
    </button>

   

{/*   
    <button type="button" className="social-btn facebook">
        <svg viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
    </button> */}

   
    {/* <button type="button" className="social-btn apple">
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.02 3.98-.87 1.72.17 2.99.87 3.81 2.09-3.34 1.63-2.77 6.31.58 7.64-.66 1.69-1.58 3.37-3.45 3.37zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
    </button> */}
</div>

                        <div className="footer-text">
                            Don't have an account? <Link to='/register'>Sign up</Link>
                        </div>
                    </form  >
                </div>
            </div>
        </div>
    );
}

export default Login;