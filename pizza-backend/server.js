const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();

// Configure CORS to allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Pizza App API Running");
});

const authRoutes = require("./routes/auth");
const pizzaRoutes = require("./routes/pizza");
const orderRoutes = require("./routes/orders");
const inventoryRoutes = require("./routes/inventoryRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/pizzas", pizzaRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inventory", inventoryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Listen on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server is accessible on all network interfaces`);
});
