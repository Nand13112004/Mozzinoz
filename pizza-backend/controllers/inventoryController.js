const Inventory = require('../models/Inventory');
const nodemailer = require('nodemailer');
const Order = require('../models/Order');

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD
    }
});

// Update inventory after order
exports.updateInventoryAfterOrder = async (orderId) => {
    try {
        const order = await Order.findById(orderId).populate('items');
        if (!order) throw new Error('Order not found');

        for (const item of order.items) {
            // Update pizza base
            await Inventory.findOneAndUpdate(
                { ingredient: 'pizzaBase' },
                { $inc: { quantity: -1 } },
                { new: true }
            );

            // Update sauce
            await Inventory.findOneAndUpdate(
                { ingredient: 'sauce' },
                { $inc: { quantity: -0.1 } }, // Assuming 100ml per pizza
                { new: true }
            );

            // Update cheese
            await Inventory.findOneAndUpdate(
                { ingredient: 'cheese' },
                { $inc: { quantity: -0.2 } }, // Assuming 200g per pizza
                { new: true }
            );

            // Update toppings based on the pizza type
            if (item.toppings) {
                for (const topping of item.toppings) {
                    if (['mushrooms', 'onions', 'peppers', 'olives'].includes(topping)) {
                        await Inventory.findOneAndUpdate(
                            { ingredient: 'veggies' },
                            { $inc: { quantity: -0.05 } }, // Assuming 50g per topping
                            { new: true }
                        );
                    } else if (['pepperoni', 'chicken', 'beef'].includes(topping)) {
                        await Inventory.findOneAndUpdate(
                            { ingredient: 'meat' },
                            { $inc: { quantity: -0.1 } }, // Assuming 100g per meat topping
                            { new: true }
                        );
                    }
                }
            }
        }

        // Check inventory levels and send notifications if needed
        await checkInventoryLevels();
    } catch (error) {
        console.error('Error updating inventory:', error);
        throw error;
    }
};

// Check inventory levels and send notifications
const checkInventoryLevels = async () => {
    try {
        const inventory = await Inventory.find();
        
        for (const item of inventory) {
            if (item.quantity <= item.threshold) {
                // Send email notification
                const mailOptions = {
                    from: process.env.ADMIN_EMAIL,
                    to: process.env.ADMIN_EMAIL,
                    subject: 'Low Inventory Alert',
                    text: `Warning: ${item.ingredient} is running low. Current quantity: ${item.quantity} ${item.unit}. Threshold: ${item.threshold} ${item.unit}.`
                };

                await transporter.sendMail(mailOptions);
            }
        }
    } catch (error) {
        console.error('Error checking inventory levels:', error);
        throw error;
    }
};

// Get current inventory status
exports.getInventoryStatus = async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update inventory manually
exports.updateInventory = async (req, res) => {
    try {
        const { ingredient, quantity, threshold } = req.body;
        const inventory = await Inventory.findOneAndUpdate(
            { ingredient },
            { quantity, threshold, lastUpdated: Date.now() },
            { new: true }
        );
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 