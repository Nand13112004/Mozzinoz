import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './PizzaDetail.css'; // Import the new CSS file

import BurnToHellImg from '../assets/images/Burn to Hell.png';
import CheeseLoversImg from '../assets/images/Cheese Lovers.png';
import CheesyMacVegImg from '../assets/images/Cheesy Mac Veg.png';
import DoubleCheeseMargheritaImg from '../assets/images/Double Cheese Margherita.png';
import FarmVillaImg from '../assets/images/Farm Villa.png';
import GardenDelightImg from '../assets/images/Garden Delight.png';
import MargheritaImg from '../assets/images/margherita .png';
import OnionTwistImg from '../assets/images/Onion Twist.png';
import PaneerSpecialImg from '../assets/images/Paneer Special.png';
import PeriPeriVegImg from '../assets/images/Peri Peri Veg.png';
import SweetCornDelightImg from '../assets/images/Sweet Corn Delight .png';
import TandooriSpecialImg from '../assets/images/Tandoori Special.png';
import VegHawaiianImg from '../assets/images/Veg Hawaiian.png';

const PizzaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  
  const pizzasData = {
      'margherita': {
        _id: '60d5ec49f132ef001c8f3c1b',
        name: 'Margherita',
        ingredients: 'Mozzarella cheese, tomato sauce, fresh basil.',
        description: 'The classic pizza loved for its simplicity and cheesy goodness.',
        prices: { small: 129, medium: 199, large: 269 },
        image: MargheritaImg,
      },
      'sweet-corn-delight': {
        _id: 'sweet-corn-delight',
        name: 'Sweet Corn Delight',
        ingredients: 'Mozzarella cheese, sweet corn, tomato sauce, oregano.',
        description: 'Sweet bursts of corn over a creamy cheese layer with mild seasoning.',
        prices: { small: 149, medium: 219, large: 289 },
        image: SweetCornDelightImg,
      },
      'onion-twist': {
        _id: 'onion-twist',
        name: 'Onion Twist',
        ingredients: 'Mozzarella cheese, onion rings, chili flakes, tomato sauce.',
        description: 'Zesty onion flavor enhanced with a mild spice kick.',
        prices: { small: 139, medium: 209, large: 279 },
        image: OnionTwistImg,
      },
      'farm-villa': {
        _id: 'farm-villa',
        name: 'Farm Villa',
        ingredients: 'Mozzarella cheese, onion, capsicum, sweet corn, olives, tomato sauce.',
        description: 'A garden-fresh combo packed with colorful veggies and rich cheese.',
        prices: { small: 159, medium: 229, large: 299 },
        image: FarmVillaImg,
      },
      'peri-peri-veg': {
        _id: 'peri-peri-veg',
        name: 'Peri Peri Veg',
        ingredients: 'Mozzarella cheese, peri peri sauce, onion, capsicum, jalapeños.',
        description: 'Spicy and smoky – a bold choice for heat seekers.',
        prices: { small: 169, medium: 239, large: 309 },
        image: PeriPeriVegImg,
      },
      'cheesy-mac-veg': {
        _id: 'cheesy-mac-veg',
        name: 'Cheesy Mac Veg',
        ingredients: 'Mozzarella cheese, elbow macaroni, creamy cheese sauce, mixed herbs.',
        description: "A fun fusion of mac 'n' cheese baked onto a pizza base.",
        prices: { small: 179, medium: 249, large: 319 },
        image: CheesyMacVegImg,
      },
      'burn-to-hell': {
        _id: 'burn-to-hell',
        name: 'Burn to Hell',
        ingredients: 'Mozzarella cheese, chili flakes, red chilies, jalapeños, hot sauce.',
        description: 'Extremely spicy pizza for those who dare — not for the faint-hearted!',
        prices: { small: 179, medium: 249, large: 319 },
        image: BurnToHellImg,
      },
      'paneer-special': {
        _id: 'paneer-special',
        name: 'Paneer Special',
        ingredients: 'Marinated paneer cubes, onion, capsicum, mozzarella, Indian spices.',
        description: 'A desi twist with flavorful paneer and a crunchy veggie base.',
        prices: { small: 169, medium: 239, large: 309 },
        image: PaneerSpecialImg,
      },
      'tandoori-special': {
        _id: 'tandoori-special',
        name: 'Tandoori Special',
        ingredients: 'Tandoori paneer, capsicum, onion, mozzarella, tandoori mayo.',
        description: 'Rich tandoori flavors with a creamy, smoky finish.',
        prices: { small: 179, medium: 249, large: 319 },
        image: TandooriSpecialImg,
      },
      'double-cheese-margherita': {
        _id: 'double-cheese-margherita',
        name: 'Double Cheese Margherita',
        ingredients: 'Extra mozzarella, cheddar, tomato sauce.',
        description: 'A cheesier take on the classic — extra gooey and satisfying.',
        prices: { small: 159, medium: 229, large: 299 },
        image: DoubleCheeseMargheritaImg,
      },
      'cheese-lovers': {
        _id: 'cheese-lovers',
        name: 'Cheese Lovers',
        ingredients: 'Mozzarella, cheddar, parmesan, cheese-stuffed crust, oregano.',
        description: 'Triple cheese explosion for the ultimate cheese fan.',
        prices: { small: 179, medium: 249, large: 319 },
        image: CheeseLoversImg,
      },
      'garden-delight': {
        _id: 'garden-delight',
        name: 'Garden Delight',
        ingredients: 'Onion, capsicum, tomato, sweet corn, olives, mozzarella.',
        description: 'A wholesome mix of fresh vegetables over melty cheese.',
        prices: { small: 149, medium: 219, large: 289 },
        image: GardenDelightImg,
      },
      'veg-hawaiian': {
        _id: 'veg-hawaiian',
        name: 'Veg Hawaiian',
        ingredients: 'Pineapple, capsicum, tomato, mozzarella, oregano.',
        description: 'Sweet and savory flavors combine in this tropical veggie treat.',
        prices: { small: 159, medium: 229, large: 299 },
        image: VegHawaiianImg,
      },
    };

  const pizza = pizzasData[id];

  if (!pizza) {
    return (
      <div className="pizza-not-found">
        <h2>Pizza not found</h2>
        <button onClick={() => navigate(-1)} className="back-button">Go Back</button>
      </div>
    );
  }

  const handleOrderNow = (size) => {
    const pizzaToAdd = {
      ...pizza,
      selectedSize: size,
      price: pizza.prices[size],
    };
    addToCart(pizzaToAdd);
    
  };

  return (
    <div className="pizza-detail-page">
      <button
        onClick={() => navigate(-1)}
        className="back-button"
      >
        Back
      </button>
      <div className="pizza-detail-card">
        <img
          src={pizza.image}
          alt={pizza.name}
          className="pizza-detail-img"
        />
        <div className="pizza-info-content">
          <h2 className="pizza-name">{pizza.name}</h2>
          <p className="ingredients"><strong>Ingredients:</strong> {pizza.ingredients}</p>
          <p className="description">{pizza.description}</p>
          <div className="price-title"><strong>Choose Size & Add to Cart:</strong></div>
            <ul className="price-list">
              <li>
                Small: <span className="price-text">₹{pizza.prices.small}</span>
                <button
                  className="add-to-cart-button"
                  onClick={() => handleOrderNow('small')}
                >
                  Add to Cart
                </button>
              </li>
              <li>
                Medium: <span className="price-text">₹{pizza.prices.medium}</span>
                <button
                  className="add-to-cart-button"
                  onClick={() => handleOrderNow('medium')}
                >
                  Add to Cart
                </button>
              </li>
              <li>
                Large: <span className="price-text">₹{pizza.prices.large}</span>
                <button
                  className="add-to-cart-button"
                  onClick={() => handleOrderNow('large')}
                >
                  Add to Cart
                </button>
              </li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default PizzaDetail;
