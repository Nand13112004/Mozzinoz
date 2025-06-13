import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { useLocation, useNavigate } from 'react-router-dom';
import './CustomPizzaBuilder.css';

const CustomPizzaBuilder = () => {
  const { addToCart, updateCartItem } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const pizzaToEdit = location.state?.pizzaToEdit;

  const [base, setBase] = useState('');
  const [sauce, setSauce] = useState('');
  const [cheese, setCheese] = useState('');
  const [veggies, setVeggies] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (pizzaToEdit) {
      setBase(pizzaToEdit.base || '');
      setSauce(pizzaToEdit.sauce || '');
      setCheese(pizzaToEdit.cheese || '');
      setVeggies(pizzaToEdit.veggies || []);
      setQuantity(pizzaToEdit.quantity || 1);
    }
  }, [pizzaToEdit]);

  const veggieOptions = ['Onion', 'Tomato', 'Capsicum', 'Mushroom', 'Corn'];

  const handleVeggieChange = (veggie) => {
    setVeggies(prev =>
      prev.includes(veggie)
        ? prev.filter(v => v !== veggie)
        : [...prev, veggie]
    );
  };

  const calculatePrice = () => {
    let customizationCost = 0; // Accumulate costs for selected custom options

    console.log("Base selected:", base, "Cost:", base ? 2 : 0);
    console.log("Sauce selected:", sauce, "Cost:", sauce ? 1 : 0);
    console.log("Cheese selected:", cheese, "Cost:", cheese ? 1.5 : 0);
    console.log("Veggies selected:", veggies.length, "Cost:", veggies.length * 0.5);

    // Add cost for base, sauce, cheese if they are selected. These are additive costs.
    if (base) customizationCost += 2; // Example cost
    if (sauce) customizationCost += 1; // Example cost
    if (cheese) customizationCost += 1.5; // Example cost

    // Add cost for veggies (always additive per item)
    customizationCost += veggies.length * 0.5; // Example cost per veggie

    // Determine the final price based on whether it's a new pizza or an edited one
    if (pizzaToEdit) {
      console.log("Editing existing pizza. Original price:", pizzaToEdit.price);
      console.log("Customization cost added:", customizationCost);
      return pizzaToEdit.price + customizationCost;
    } else {
      const newCustomPizzaBasePrice = 100; // You can adjust this base price as needed
      console.log("Creating new custom pizza. Base price:", newCustomPizzaBasePrice);
      console.log("Customization cost added:", customizationCost);
      return newCustomPizzaBasePrice + customizationCost;
    }
  };

  const handleAddToCart = () => {
    const pizza = {
      _id: pizzaToEdit?._id || `custom-${Date.now()}`,
      name: pizzaToEdit ? pizzaToEdit.name : 'Custom Pizza',
      base,
      sauce,
      cheese,
      veggies,
      description: `Base: ${base}, Sauce: ${sauce}, Cheese: ${cheese}, Veggies: ${veggies.join(', ') || 'None'}`,
      price: calculatePrice(),
      quantity,
      selectedSize: pizzaToEdit?.selectedSize || 'regular'
    };
    if (pizzaToEdit) {
      updateCartItem(pizza);
    } else {
      addToCart(pizza);
    }
    navigate('/cart');
  };

  return (
    <div className="custom-pizza-builder">
      <h2>{pizzaToEdit ? 'Edit Your Custom Pizza' : 'Build Your Own Pizza'}</h2>

      <label>Choose Base:</label>
      <select className="form-select" value={base} onChange={(e) => setBase(e.target.value)}>
        <option value="">--Select Base--</option>
        <option value="Thin Crust">Thin Crust</option>
        <option value="Thick Crust">Thick Crust</option>
        <option value="Cheese Burst">Cheese Burst</option>
      </select>

      <label>Choose Sauce:</label>
      <select className="form-select" value={sauce} onChange={(e) => setSauce(e.target.value)}>
        <option value="">--Select Sauce--</option>
        <option value="Tomato Basil">Tomato Basil</option>
        <option value="Pesto">Pesto</option>
        <option value="Barbecue">Barbecue</option>
      </select>

      <label>Choose Cheese:</label>
      <select className="form-select" value={cheese} onChange={(e) => setCheese(e.target.value)}>
        <option value="">--Select Cheese--</option>
        <option value="Mozzarella">Mozzarella</option>
        <option value="Cheddar">Cheddar</option>
        <option value="Parmesan">Parmesan</option>
      </select>

      <label>Choose Veggies:</label>
      <div className="veggie-options">
        {veggieOptions.map(veggie => (
          <label key={veggie}>
            <input
              type="checkbox"
              checked={veggies.includes(veggie)}
              onChange={() => handleVeggieChange(veggie)}
            />
            {veggie}
          </label>
        ))}
      </div>

      <label>Quantity:</label>
      <input
        type="number"
        className="form-input"
        value={quantity}
        min="1"
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

      <p><strong>Estimated Price:</strong> ₹{(calculatePrice() * quantity).toFixed(2)}</p>

      <button className="btn btn-primary" onClick={handleAddToCart}>{pizzaToEdit ? 'Update Cart' : 'Add to Cart'}</button>
    </div>
  );
};

export default CustomPizzaBuilder;
