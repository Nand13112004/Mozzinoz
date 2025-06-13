import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        i => i._id === item._id && i.selectedSize === item.selectedSize
      );
      if (existingIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingIndex].quantity = (updatedItems[existingIndex].quantity || 1) + 1;
        return updatedItems;
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const updateCartItem = (updatedItem) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === updatedItem._id && item.selectedSize === updatedItem.selectedSize
          ? { ...item, ...updatedItem }
          : item
      )
    );
  };

  const removeFromCart = (itemToRemove) => {
    setCartItems(prevItems =>
      prevItems.filter(item =>
        !(item._id === itemToRemove._id && item.selectedSize === itemToRemove.selectedSize)
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateCartItem, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
