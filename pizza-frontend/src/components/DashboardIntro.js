import React from 'react';
import deskPizza from '../assets/images/desk.jpg';
import './DashboardIntro.css';

const DashboardIntro = () => {
  return (
    <div className="dashboard-intro-container">
      <div className="intro-text-content">
        <h1 className="intro-title">
          Hungry and in a hurry?
        </h1>
        <p className="intro-description">
          Get delicious meals from top local restaurants delivered to your door in no time!"
        </p>
      </div>
      <div className="intro-image-content">
        <img
          src={deskPizza}
          alt="Desk Pizza"
          className="intro-image"
        />
      </div>
      
    </div>
  );
};

export default DashboardIntro;
