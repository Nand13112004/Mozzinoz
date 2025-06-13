const mongoose = require('mongoose');

const orderRecordSchema = new mongoose.Schema({
  items: [
    {
      pizzaId: { type: String },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      selectedSize: { type: String },
    },
  ],
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('OrderRecord', orderRecordSchema); 