const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus, markOrderAsPaid, createPaymentIntent } = require('../controllers/orderController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private (User)
router.post('/', isAuthenticated, createOrder);

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private (User)
router.get('/myorders', isAuthenticated, getMyOrders);

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private (Admin)
router.get('/', isAuthenticated, isAdmin, getAllOrders);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin)
router.put('/:id/status', isAuthenticated, isAdmin, updateOrderStatus);

// @route   PUT /api/orders/:id/pay
// @desc    Mark order as paid (simulated, will be replaced by Stripe webhook)
// @access  Private (User)
router.put('/:id/pay', isAuthenticated, markOrderAsPaid);

// @route   POST /api/orders/:id/create-payment-intent
// @desc    Create Stripe Payment Intent
// @access  Private (User)
router.post('/:id/create-payment-intent', isAuthenticated, createPaymentIntent);

module.exports = router; 