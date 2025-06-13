import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import DashboardIntro from '../components/DashboardIntro';
import { AuthContext } from '../context/AuthContext';
import Features from '../components/Features';
import './Dashboard.css';



const Dashboard = () => {
  const { isLoggedIn } = useContext(AuthContext);

  
  return (
    <div className="dashboard-container">
      {isLoggedIn ? (
        <>
          <DashboardIntro />
          <Features />
          <div className="slogan-section">
            <p className="slogan-text">
              "Good food is happiness on a plate. We bring happiness to your door. Hungry? Let's fix that."
            </p>
            <Link to="/menu" className="btn btn-primary menu-button">View Our Menu</Link>
          </div>
        </>
      ) : (
        <DashboardIntro />
      )}
    </div>
  );
};

export default Dashboard;
