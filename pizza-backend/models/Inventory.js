const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    ingredient: {
        type: String,
        required: true,
        enum: ['pizzaBase', 'sauce', 'cheese', 'veggies', 'meat']
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    threshold: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['pieces', 'kg', 'liters']
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Inventory', inventorySchema); 