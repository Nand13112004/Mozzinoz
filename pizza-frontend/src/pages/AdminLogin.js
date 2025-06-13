import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from '../config';
import './AdminLogin.css';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/admin-login`, form);
      // Temporarily store the token to fetch user data
      localStorage.setItem('token', res.data.token);
      // Fetch user data
      const userRes = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${res.data.token}` }
      });
      if (userRes.data.user.role !== 'admin') {
        localStorage.removeItem('token');
        setMessage('User login is not allowed here. Please use the User Login page.');
        return;
      }
      await login(res.data.token);
      navigate("/admin_dashboard");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <div className="admin-login-page-wrapper">
      <form onSubmit={handleSubmit} className="admin-login-form-container">
        <h2 className="admin-login-title">Admin Login</h2>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="admin-login-button">
          Login
        </button>
        {message && <div className="message-box">{message}</div>}
      </form>
    </div>
  );
};

export default AdminLogin;
