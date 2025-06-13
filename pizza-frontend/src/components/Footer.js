import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer>
    <div className="container footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Mozzino's Pizza</h3>
          <p>Delicious pizzas made with love</p>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@mozzinos.com</p>
          <p>Phone: (555) 123-4567</p>
        </div>
        <div className="footer-section">
          <h3>Hours</h3>
          <p>Mon-Sat: 11am - 10pm</p>
          <p>Sunday: 12pm - 9pm</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Mozzino's Pizza. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
