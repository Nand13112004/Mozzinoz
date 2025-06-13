const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAdmin, isAuthenticated } = require('../middlewares/authMiddleware');
const Order = require('../models/Order');

// Create new order
router.post('/', isAuthenticated, orderController.createOrder);

// Create Stripe Payment Intent
router.post('/:id/create-payment-intent', isAuthenticated, orderController.createPaymentIntent);

// Mark order as paid
router.put('/:id/pay', isAuthenticated, orderController.markOrderAsPaid);

// Update order status (admin only)
router.put('/:orderId/status', isAdmin, orderController.updateOrderStatus);

// Get all orders (admin only)
router.get('/all', isAdmin, orderController.getAllOrders);

// Get user's orders
router.get('/my-orders', isAuthenticated, orderController.getUserOrders);

// Get single order
router.get('/:orderId', isAuthenticated, orderController.getOrder);

// Get all orders (for admin)
router.get('/', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// Accept an order
router.patch('/:id/accept', async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: 'accepted' },
    { new: true }
  );
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

module.exports = router;