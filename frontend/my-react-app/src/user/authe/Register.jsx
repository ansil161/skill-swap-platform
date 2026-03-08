import { useState } from "react"
import { Link } from "react-router-dom"
import "../styles/register.css"
import api from "../../api/axios"

function Register() {

    const [showPassword, setShowPassword] = useState(false)

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
       
        agreeToTerms: false
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
 

        api.post("Register/", {
            username: form.username,
            email: form.email,
            password: form.password,
            
        })
        .then((res) => {
            console.log(res.data)
            alert("User registered successfully")
            setForm('')
        })
        .catch((err) => {
            console.log(err.response?.data)
        })
    }

    return (
        <div className="register-page">
            <div className="register-container">

                <div className="register-form-section">

                    <div className="form-header">
                        <div className="back-wrapper">
                            <button className="back-btn"></button>
                            <span className="app-name">SkillSwap</span>
                        </div>
                        <button className="globe-btn"></button>
                    </div>

                    <div className="form-content">
                        <h2>Create new account</h2>

                        <form onSubmit={handleSubmit}>

                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <div className="input-wrapper">
                                    <span className="input-icon username-icon"></span>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email address</label>
                                <div className="input-wrapper">
                                    <span className="input-icon email-icon"></span>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <span className="input-icon password-icon"></span>

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                    />

                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        👁
                                    </button>
                                </div>

                                <p className="password-hint">
                                    Your password must be at least 8 characters long
                                </p>
                            </div>

                            <button type="submit" className="signup-btn">
                                Sign Up
                            </button>

                            <div className="divider">
                                <span>Already have an account?</span>
                            </div>

                            <Link to="/login" className="login-btn">
                                Login
                            </Link>

                            <p className="terms-text">
                                By continuing, you agree to{" "}
                                <a href="/terms">Terms & Conditions</a> &{" "}
                                <a href="/privacy">Privacy Policy</a>
                            </p>

                        </form>
                    </div>
                </div>

                <div className="register-promo-section">
                    <div className="promo-card">
                        <div className="promo-text">
                            <h1>
                                Exchange Skills,<br />
                                <span className="highlight">Build Community</span>
                            </h1>
                            <p>
                                Join thousands of learners sharing knowledge and growing together
                            </p>
                        </div>
                        <div className="promo-image"></div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Register