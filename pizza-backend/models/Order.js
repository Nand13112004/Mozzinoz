const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function() { return this.orderType === 'user'; } // Required if not an admin order
    },
    items: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        // Add other details if needed, e.g., custom pizza components
        base: { type: String },
        sauce: { type: String },
        cheese: { type: String },
        veggies: [{ type: String }],
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'accepted', 'rejected', 'cancelled', 'delivered'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending',
    },
    paidAt: {
        type: Date,
    },
    paymentMethod: {
        type: String,
    },
    transactionId: {
        type: String,
    },
    statusHistory: [{
        status: {
            type: String,
            enum: ['pending', 'orderReceived', 'inKitchen', 'sentToDelivery', 'delivered']
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    adminId: { // Optional: to link orders managed by a specific admin if needed
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: false
    },
    orderType: {
        type: String,
        enum: ['user', 'admin'], // Differentiate between user-placed and admin-placed/managed orders
        default: 'user'
    }
});

// Update the updatedAt timestamp before saving
OrderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Order', OrderSchema); 