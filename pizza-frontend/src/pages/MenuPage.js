import React from 'react';
import { useNavigate } from 'react-router-dom';
import PizzaCard from '../components/PizzaCard';
import './MenuPage.css'; // Optional: for custom styles

// Import pizza images
import MargheritaImg from '../assets/images/margherita .png';
import SweetCornDelightImg from '../assets/images/Sweet Corn Delight .png';
import OnionTwistImg from '../assets/images/Onion Twist.png';
import FarmVillaImg from '../assets/images/Farm Villa.png';
import PeriPeriVegImg from '../assets/images/Peri Peri Veg.png';
import CheesyMacVegImg from '../assets/images/Cheesy Mac Veg.png';
import BurnToHellImg from '../assets/images/Burn to Hell.png';
import PaneerSpecialImg from '../assets/images/Paneer Special.png';
import TandooriSpecialImg from '../assets/images/Tandoori Special.png';
import DoubleCheeseMargheritaImg from '../assets/images/Double Cheese Margherita.png';
import CheeseLoversImg from '../assets/images/Cheese Lovers.png';
import GardenDelightImg from '../assets/images/Garden Delight.png';
import VegHawaiianImg from '../assets/images/Veg Hawaiian.png';

const pizzas = [
  {
    _id: '1',
    name: "Margherita",
    description: "A classic pizza with tomato sauce and lots of cheese.",
    price: 125,
    image: MargheritaImg
  },
  {
    _id: '2',
    name: "Sweet Corn Delight",
    description: "Topped with sweet corn, cheese, and onion.",
    price: 125,
    image: SweetCornDelightImg
  },
  {
    _id: '3',
    name: "Onion Twist",
    description: "Loaded with flavorful onions and cheese.",
    price: 125,
    image: OnionTwistImg
  },
  {
    _id: '4',
    name: "Farm Villa",
    description: "Capsicum, fresh tomatoes, onion, red paprika, and korma dip.",
    price: 199,
    image: FarmVillaImg
  },
  {
    _id: '5',
    name: "Peri Peri Veg",
    description: "Spicy peri peri sauce with assorted veggies and cheese.",
    price: 199,
    image: PeriPeriVegImg
  },
  {
    _id: '6',
    name: "Cheesy Mac Veg",
    description: "Cheesy macaroni pasta loaded on a pizza base.",
    price: 199,
    image: CheesyMacVegImg
  },
  {
    _id: '7',
    name: "Burn to Hell",
    description: "Extremely spicy pizza for heat lovers, with red paprika and chili overload.",
    price: 249,
    image: BurnToHellImg
  },
  {
    _id: '8',
    name: "Paneer Special",
    description: "Soft paneer cubes with veggies, herbs, and korma dip.",
    price: 249,
    image: PaneerSpecialImg
  },
  {
    _id: '9',
    name: "Tandoori Special",
    description: "Indian-style tandoori flavors with paneer, veggies, and dip.",
    price: 249,
    image: TandooriSpecialImg
  },
  {
    _id: '10',
    name: "Double Cheese Margherita",
    description: "Extra cheese overload version of the Margherita.",
    price: 149,
    image: DoubleCheeseMargheritaImg
  },
  {
    _id: '11',
    name: "Cheese Lovers",
    description: "A full cheese-loaded pizza with cheese dip.",
    price: 199,
    image: CheeseLoversImg
  },
  {
    _id: '12',
    name: "Garden Delight",
    description: "Topped with tomato, onion, and capsicum.",
    price: 149,
    image: GardenDelightImg
  },
  {
    _id: '13',
    name: "Veg Hawaiian",
    description: "Sweet & savory pineapple with cheese and veggies.",
    price: 199,
    image: VegHawaiianImg
  },
];

const slugify = (text) => {
  return text.toLowerCase().replace(/\s+/g, '-');
};

const MenuPage = () => {
  const navigate = useNavigate();

  const handlePizzaClick = (pizzaName) => {
    const slug = slugify(pizzaName);
    navigate(`/pizza/${slug}`);
  };

  return (
    <div className="menu-page">
      <h1>🍕 Our Menu</h1>
      <div className="pizza-grid">
        {pizzas.map(pizza => (
          <PizzaCard
            key={pizza._id}
            pizza={pizza}
            onClick={() => handlePizzaClick(pizza.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
