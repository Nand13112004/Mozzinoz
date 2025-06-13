import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/images/f2.png';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header>
      <div className="container header-container">
        <div className="logo-container">
          <img
            src={logo}
            alt="Pizza Logo"
            className="logo"
          />
          <span className="logo-text">Mozzino's Pizza</span>
        </div>
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          &#8942; {/* Unicode for three vertical dots */}
        </button>
        <nav className={`main-nav ${mobileMenuOpen ? 'mobile-menu-active' : ''}`}>
          <ul className="nav-list">
            {isLoggedIn ? (
              <>
                {user?.role === 'user' && (
                  <>
                    <li><Link to="/dashboard" className="nav-link" onClick={toggleMobileMenu}>Dashboard</Link></li>
                    <li><Link to="/menu" className="nav-link" onClick={toggleMobileMenu}>Menu</Link></li>
                    <li><Link to="/cart" className="nav-link" onClick={toggleMobileMenu}>Cart</Link></li>
                    <li><Link to="/orders" className="nav-link" onClick={toggleMobileMenu}>My Orders</Link></li>
                  </>
                )}
                {user?.role === 'admin' && (
                  <>
                    <li><Link to="/admin_dashboard" className="nav-link" onClick={toggleMobileMenu}>Admin Dashboard</Link></li>
                    <li><Link to="/admin/orders" className="nav-link" onClick={toggleMobileMenu}>Manage Orders</Link></li>
                    <li><Link to="/admin/inventory" className="nav-link" onClick={toggleMobileMenu}>Inventory</Link></li>
                  </>
                )}
                <li>
                  <button onClick={() => { handleLogout(); toggleMobileMenu(); }} className="nav-link logout-btn">Logout</button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="nav-link" onClick={toggleMobileMenu}>Login</Link></li>
                <li><Link to="/register" className="nav-link" onClick={toggleMobileMenu}>Register</Link></li>
                <li><Link to="/admin" className="nav-link" onClick={toggleMobileMenu}>Admin Panel</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;