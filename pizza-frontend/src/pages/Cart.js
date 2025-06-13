import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Alert } from '@mui/material';
import API_BASE_URL from '../config';

const Cart = () => {
  const { cartItems, updateCartItem, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [orderStatus, setOrderStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const handleQuantityChange = (item, amount) => {
    const newQuantity = item.quantity + amount;
    if (newQuantity < 1) {
      removeFromCart(item);
    } else {
      updateCartItem({ ...item, quantity: newQuantity });
    }
  };

  const handleCustomize = (item) => {
    navigate('/customize', { state: { pizzaToEdit: item } });
  };

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleOrderNow = async () => {
    if (cartItems.length === 0) return;
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setOrderStatus('waiting');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/orders`, {
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          base: item.base,
          sauce: item.sauce,
          cheese: item.cheese,
          veggies: item.veggies,
        })),
        totalAmount: total,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        setOrderStatus('accepted');
        setMessage('Order placed successfully!');
        setMessageType('success');
        clearCart();
        setTimeout(() => navigate('/orders'), 2000); // Redirect to order tracking after a delay
      } else {
        setOrderStatus('rejected');
        setMessage(response.data.message || 'Order creation failed.');
        setMessageType('error');
      }
    } catch (error) {
      setOrderStatus('rejected');
      setMessage(error.response?.data?.message || "Error placing order.");
      setMessageType('error');
      console.error("Error placing order:", error);
    }
  };

  return (
    <div style={styles.cartContainer}>
      <h2 style={styles.cartTitle}>Your Cart</h2>
      {message && <Alert severity={messageType} sx={{ mb: 2 }}>{message}</Alert>}

      {cartItems.length === 0 ? (
        <p style={styles.emptyCartMessage}>Your cart is empty.</p>
      ) : (
        <>
          <ul style={styles.cartList}>
            {cartItems.map(item => (
              <li key={item._id} style={styles.cartItem}>
                <div style={styles.itemDetails}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  {item._id.startsWith('custom-') ? (
                    <>
                      <p style={styles.itemProperty}><strong>Base:</strong> {item.base}</p>
                      <p style={styles.itemProperty}><strong>Sauce:</strong> {item.sauce}</p>
                      <p style={styles.itemProperty}><strong>Cheese:</strong> {item.cheese}</p>
                      <p style={styles.itemProperty}><strong>Veggies:</strong> {item.veggies?.join(', ') || 'None'}</p>
                    </>
                  ) : (
                    <p style={styles.itemDescription}>{item.description}</p>
                  )}
                  <p style={styles.itemPrice}>Price: ₹{item.price.toFixed(2)}</p>
                  <div style={styles.cartQuantityControls}>
                    <button style={styles.quantityButton} onClick={() => handleQuantityChange(item, -1)}>-</button>
                    <span style={styles.quantityDisplay}>{item.quantity}</span>
                    <button style={styles.quantityButton} onClick={() => handleQuantityChange(item, 1)}>+</button>
                  </div>
                  <button style={styles.customizeBtn} onClick={() => handleCustomize(item)}>Customize</button>
                </div>
                <button style={styles.removeBtn} onClick={() => removeFromCart(item)}>Remove</button>
              </li>
            ))}
          </ul>
          
          <h3 style={styles.totalAmount}>Total: ₹{total.toFixed(2)}</h3>

          <div style={styles.actionButtons}>
            <button style={styles.clearBtn} onClick={clearCart}>Clear Cart</button>
            <button style={styles.orderBtn} onClick={handleOrderNow} disabled={orderStatus === 'waiting' || total === 0}>
              {orderStatus === 'waiting' ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>

          {orderStatus === 'accepted' && <p style={styles.orderSuccess}>Order successfully placed! Redirecting to orders...</p>}
          {orderStatus === 'rejected' && <p style={styles.orderRejected}>Oops! Order was rejected.</p>}
        </>
      )}
    </div>
  );
};

const styles = {
  cartContainer: {
    maxWidth: 800,
    margin: '60px auto',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  cartTitle: {
    textAlign: 'center',
    color: '#333',
    fontSize: '2.2em',
    marginBottom: 30,
  },
  emptyCartMessage: {
    textAlign: 'center',
    color: '#777',
    fontSize: '1.1em',
    padding: '20px 0',
  },
  cartList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #eee',
    padding: '15px 0',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  itemDetails: {
    flexGrow: 1,
  },
  itemName: {
    fontSize: '1.2em',
    margin: '0 0 5px 0',
    color: '#555',
  },
  itemDescription: {
    fontSize: '0.9em',
    color: '#888',
  },
  itemProperty: {
    fontSize: '0.9em',
    color: '#666',
    margin: '2px 0',
  },
  itemPrice: {
    fontSize: '1.1em',
    fontWeight: 'bold',
    color: '#444',
    marginTop: 5,
  },
  cartQuantityControls: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '1em',
    margin: '0 5px',
    '&:hover': {
      backgroundColor: '#45a049',
    },
  },
  quantityDisplay: {
    fontSize: '1.1em',
    fontWeight: 'bold',
    minWidth: '20px',
    textAlign: 'center',
  },
  customizeBtn: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.9em',
    marginTop: 10,
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  removeBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.9em',
    '&:hover': {
      backgroundColor: '#c82333',
    },
  },
  totalAmount: {
    textAlign: 'right',
    fontSize: '1.8em',
    fontWeight: 'bold',
    marginTop: 30,
    color: '#333',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  clearBtn: {
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    padding: '12px 20px',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: '1.1em',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#e0a800',
    },
  },
  orderBtn: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: '1.1em',
    fontWeight: 'bold',
    '&:disabled': {
      backgroundColor: '#94e4a9',
      cursor: 'not-allowed',
    },
    '&:hover:not(:disabled)': {
      backgroundColor: '#218838',
    },
  },
  orderSuccess: {
    color: 'green',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '1.1em',
  },
  orderRejected: {
    color: 'red',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '1.1em',
  },
};

export default Cart;
