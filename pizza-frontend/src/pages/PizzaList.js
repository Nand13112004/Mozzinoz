import React from "react";
import PizzaCard from "../components/PizzaCard";

const PizzaList = ({ pizzas, onAddToCart }) => {
  return (
    <div style={styles.container}>
      {}
      <div style={styles.grid}>
        {pizzas.map(pizza => (
          <PizzaCard key={pizza._id} pizza={pizza} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "600",
    color: "#333",
    marginBottom: "24px",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
    justifyContent: "center",
    alignItems: "start",
  },

  
  '@media (max-width: 768px)': {
    container: {
      padding: "10px",
    },
    title: {
      fontSize: "1.5rem",
      marginBottom: "16px",
    },
  },
};

export default PizzaList;