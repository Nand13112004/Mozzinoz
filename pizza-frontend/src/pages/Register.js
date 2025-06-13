import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../config';
import logo from '../assets/images/f2.png';
import './Register.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, form);
      setMessage("Registration successful! Please check your email to verify your account.");
      setTimeout(() => {
        navigate('/login');
      }, 5000); 
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-page-wrapper">
      <form
        onSubmit={handleSubmit}
        className="register-form-container"
      >
        <img src={logo} alt="Mozzinoz" className="register-logo" />
        <h2 className="register-title">
          Create Account
        </h2>
        <div className="register-subtitle">
          Join Mozzino'z and get your first slice!
        </div>

        <div className="form-group">
          <label>
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your name"
            className="form-input"
          />
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
              placeholder="Create a password"
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
        {message && (
          <div className="message-box">
            {message}
          </div>
        )}
        <button
          type="submit"
          className="register-button"
        >
          Register
        </button>
        <div className="divider-text">
          — Already have an account? —
        </div>
        <button
          type="button"
          className="login-button"
          onClick={() => navigate('/login')}
        >
          Login
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

export default Register;