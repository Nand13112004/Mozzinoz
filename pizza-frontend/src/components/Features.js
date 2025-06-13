import React from 'react';
import { FaLeaf, FaRocket, FaUtensils } from 'react-icons/fa';
import './Features.css';

const Features = () => {
  return (
    <div className="features-section">
      <div className="container features-grid">
        <div className="feature-item card">
          <FaLeaf className="feature-icon" />
          <h3 className="feature-title">Fresh Ingredients</h3>
          <p className="feature-description">Only the best, handpicked ingredients go into every meal we deliver.</p>
        </div>
        <div className="feature-item card">
          <FaRocket className="feature-icon" />
          <h3 className="feature-title">Superfast Delivery</h3>
          <p className="feature-description">Get your favorite dishes at your doorstep in under 30 minutes — guaranteed.</p>
        </div>
        <div className="feature-item card">
          <FaUtensils className="feature-icon" />
          <h3 className="feature-title">Curated by Top Chefs</h3>
          <p className="feature-description">Every bite is a masterpiece crafted by culinary experts.</p>
        </div>
      </div>
    </div>
  );
};

export default Features; 