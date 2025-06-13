import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../config';
import logo from '../assets/images/f2.png';
import './Login.css'; // Import the CSS file

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, form);
      // Temporarily store the token to fetch user data
      localStorage.setItem('token', res.data.token);
      // Fetch user data
      const userRes = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${res.data.token}` }
      });
      if (userRes.data.user.role === 'admin') {
        localStorage.removeItem('token');
        setMessage('Admin login is not allowed here. Please use the Admin Panel.');
        return;
      }
      await login(res.data.token); // This stores the token and fetches user data
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (err) {
      setMessage(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page-wrapper">
      <form
        onSubmit={handleSubmit}
        className="login-form-container"
      >
        <img src={logo} alt="Mozzinoz" className="login-logo" />
        <h2 className="login-title">
          Welcome Back!
        </h2>
        <div className="login-subtitle">
          Login to your Mozzino'z account
        </div>

        <div className="form-group">
          <label>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>
            Password
          </label>
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="form-input"
            />
            <span
              onClick={() => setShowPassword(s => !s)}
              className="password-toggle"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
        </div>
        <div className="forgot-password-link">
          <button
            type="button"
            onClick={() => alert('Forgot password functionality coming soon!')}
          >
            Forgot password?
          </button>
        </div>
        <button
          type="submit"
          className="login-button"
        >
          Login
        </button>
        {message && (
          <div className="message-box">
            {message}
          </div>
        )}
        <div className="divider-text">
          — Don't have an account? —
        </div>
        <button
          type="button"
          className="signup-button"
          onClick={() => navigate('/register')}
        >
          Sign Up
        </button>
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(40px);}
              to { opacity: 1; transform: translateY(0);}
            }
          `}
        </style>
      </form>
    </div>
  );
};

export default Login;
