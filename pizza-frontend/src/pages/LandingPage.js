import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import offer1Img from '../assets/images/offer1.png';
import offer2Img from '../assets/images/offer2.jpg';
import offer3Img from '../assets/images/offer3.jpg';
import offer4Img from '../assets/images/offer4.jpg';
import offer5Img from '../assets/images/offer5.jpg';
import logo from '../assets/images/f2.png'; 

import { useNavigate } from 'react-router-dom'; 
import './LandingPage.css'; // Import the CSS file

const LandingPage = () => {
  const offerImages = [offer1Img, offer2Img, offer3Img, offer4Img, offer5Img];

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const navigate = useNavigate(); 

  return (
    <div className="landing-page-wrapper">
      <section className="landing-section">
        <div className="text-content">
          <div className="logo-brand-container">
            <img src={logo} alt="Mozzinoz" className="brand-logo" />
            <div>
              <h1 className="brand-title">Mozzino'z</h1>
              <div className="brand-slogan">It's Love at First Slice!</div>
            </div>
          </div>
          <p className="description-text">
            Indulge in cheesy, crispy perfection. Whether you're craving bold new toppings or classic flavors, our pizzas promise love at first bite.
          </p>
          <div className="offer-tag">
            🍕 Order now & get 20% off your first pizza!
          </div>
          <div className="action-buttons">
            <button
              className="btn btn-primary login-button"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              className="btn btn-secondary signup-button"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </button>
          </div>
        </div>
        <div className="image-slider-content">
          <Slider {...settings}>
            {offerImages.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Offer ${index + 1}`} className="slider-image" />
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;