import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    await fetchUserData();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log("Token in fetchUserData:", token);
      if (token) {
        const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user);
        console.log("Fetched user:", res.data.user);
      }
    } catch (err) {
      setUser(null);
      console.error("Error fetching user:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
