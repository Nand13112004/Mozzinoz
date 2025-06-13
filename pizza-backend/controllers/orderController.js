const Order = require('../models/Order');
const User = require('../models/User');
const inventoryController = require('./inventoryController');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Initialize Stripe

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (User)
exports.createOrder = async (req, res) => {
  const { items, totalAmount } = req.body;

  if (items && items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending', // New: Default payment status
      orderType: 'user'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private (User)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Admin can only change to 'processing' if payment is 'paid'
    if (status === 'processing' && order.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Payment not received for this order. Cannot start processing.' });
    }

    // Validate status transition if needed (e.g., pending -> processing -> delivered)
    order.status = status;
    order.updatedAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark order as paid
// @route   PUT /api/orders/:id/pay
// @access  Private (User)
exports.markOrderAsPaid = async (req, res) => {
  const { id } = req.params;
  const { paymentMethod, transactionId } = req.body;

  console.log(`Attempting to mark order ${id} as paid. paymentMethod: ${paymentMethod}, transactionId: ${transactionId}`);
  console.log("User making request:", req.user);

  try {
    const order = await Order.findById(id);

    if (!order) {
      console.error(`Order ${id} not found.`);
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id.toString()) {
      console.error(`User ${req.user.id} not authorized to pay for order ${id}. Order owner: ${order.user}`);
      return res.status(403).json({ message: 'Not authorized to pay for this order' });
    }

    if (order.paymentStatus === 'paid') {
      console.warn(`Order ${id} already paid.`);
      return res.status(400).json({ message: 'Order already paid' });
    }

    order.paymentStatus = 'paid';
    order.paidAt = Date.now();
    order.paymentMethod = paymentMethod || 'Simulated';
    order.transactionId = transactionId || `SIM-${Date.now()}`;

    const updatedOrder = await order.save();
    console.log(`Order ${id} successfully marked as paid.`);
    res.json({ message: 'Payment successful', order: updatedOrder });
  } catch (error) {
    console.error(`Error marking order ${id} as paid:`, error);
    res.status(500).json({ message: error.message });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('user', 'name email')
            .populate('items.pizza');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is admin or the order owner
        if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create Stripe Payment Intent
// @route   POST /api/orders/:id/create-payment-intent
// @access  Private (User)
exports.createPaymentIntent = async (req, res) => {
  const { id: orderId } = req.params; // Get orderId from params

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure user attempting to create intent is the order owner
    if (order.user.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: 'Not authorized to create payment intent for this order' });
    }

    // Stripe requires amount in smallest currency unit (e.g., paise for INR, cents for USD)
    // Assuming INR for now, adjust currency and multiplier if different
    const amountInSmallestUnit = Math.round(order.totalAmount * 100); 
    console.log(`Creating payment intent for order ${orderId}: amount=${amountInSmallestUnit}, currency=inr`);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: 'inr', // IMPORTANT: Adjust currency as needed (e.g., 'usd', 'eur')
      metadata: { order_id: order._id.toString(), user_id: req.user.id.toString() },
      // Only use card payments for now
      payment_method_types: ['card'],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      orderId: order._id,
      totalAmount: order.totalAmount,
    });

  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: error.message });
  }
};
