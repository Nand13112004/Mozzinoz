import React, { useState } from "react";
import Slider from "react-slick";
import PizzaCard from "./PizzaCard";
import "./PizzaSlider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      style={{
        ...style,
        display: "block",
        color:'black',
        borderRadius: "50%",
        background:'black',
        border: "none",
        padding: "0px",
        position: "absolute",
        right: "-30px",
        top: "45%",
        zIndex: 1,
        cursor: "pointer",
      }}
      onClick={onClick}
      aria-label="Next Slide"
    >
      {'>'}
    </button>
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      style={{
        ...style,
        display: "block",
        borderRadius: "50%",
        border: "none",
        background:'black',
        position: "absolute",
        left: "-30px",
        top: "45%",
        zIndex: 1,
        cursor: "pointer",
      }}
      onClick={onClick}
      aria-label="Previous Slide"
    >
      {'<'}
    </button>
  );
};

const PizzaSlider = ({ pizzas, onAddToCart }) => {
  
  const pizzasWithImages = pizzas.map(pizza => ({
    ...pizza,
    image: imageMap[pizza.name] || pizza.image,
  }));

  const [pizzaList] = useState(pizzasWithImages);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    swipe: true,
    swipeToSlide: true,
    touchMove: true,
    draggable: true,
    centerMode: false,
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
      </div>
      <Slider {...settings} className="pizza-slider">
        {pizzaList.map((pizza, idx) => {
          const slug = pizza.name.toLowerCase().replace(/\s+/g, '-');
          return (
            <div key={pizza._id} className="pizza-slider-card" onClick={() => window.location.href = `/pizza/${slug}`} style={{ cursor: 'pointer' }}>
              <PizzaCard pizza={pizza} hideOrderButton={true} minimal={true} />
            </div>
          );
        })}
      </Slider>
    </>
  );
};

const imageMap = {
  "Burn to Hell": require("../assets/images/Burn to Hell.png"),
  "Cheese Lovers": require("../assets/images/Cheese Lovers.png"),
  "Cheesy Mac Veg": require("../assets/images/Cheesy Mac Veg.png"),
  "Double Cheese Margherita": require("../assets/images/Double Cheese Margherita.png"),
  "Farm Villa": require("../assets/images/Farm Villa.png"),
  "Garden Delight": require("../assets/images/Garden Delight.png"),
  "Margherita": require("../assets/images/margherita .png"),
  "Onion Twist": require("../assets/images/Onion Twist.png"),
  "Paneer Special": require("../assets/images/Paneer Special.png"),
  "Peri Peri Veg": require("../assets/images/Peri Peri Veg.png"),
  "Sweet Corn Delight": require("../assets/images/Sweet Corn Delight .png"),
  "Tandoori Special": require("../assets/images/Tandoori Special.png"),
  "Veg Hawaiian": require("../assets/images/Veg Hawaiian.png"),
};

export default PizzaSlider;
