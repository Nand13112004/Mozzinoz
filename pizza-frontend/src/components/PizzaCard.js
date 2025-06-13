import React from "react";

const PizzaCard = ({ pizza, onClick }) => {
  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.imageContainer}>
        <img src={pizza.image} alt={pizza.name} style={styles.image} />
      </div>
      <div style={styles.content}>
        <h3 style={styles.title}>{pizza.name}</h3>
        <p style={styles.description}>{pizza.description}</p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #e0e0e0",
    borderRadius: 12,
    padding: 0,
    margin: 0,
    width: 280,
    maxWidth: "100%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    overflow: "hidden",
    cursor: "pointer",
    ":hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
    },
  },
  imageContainer: {
    width: "100%",
    height: 180,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease-in-out",
    ":hover": {
      transform: "scale(1.05)",
    },
  },
  content: {
    padding: "16px",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#333",
  },
  description: {
    margin: "0 0 12px 0",
    fontSize: "0.9rem",
    color: "#666",
    lineHeight: "1.4",
  },
};

export default PizzaCard;
