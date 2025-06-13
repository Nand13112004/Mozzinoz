const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
require('dotenv').config({ path: '../.env' });

const seedInventory = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected for seeding');

        // Clear existing inventory data if any
        await Inventory.deleteMany({});
        console.log('Existing inventory cleared');

        const initialInventory = [
            // Bases
            { ingredient: 'Thin Crust', quantity: 100, threshold: 20, unit: 'pieces' },
            { ingredient: 'Thick Crust', quantity: 100, threshold: 20, unit: 'pieces' },
            { ingredient: 'Cheese Burst', quantity: 50, threshold: 10, unit: 'pieces' },
            // Sauces
            { ingredient: 'Tomato Basil', quantity: 50, threshold: 10, unit: 'liters' },
            { ingredient: 'Pesto', quantity: 30, threshold: 5, unit: 'liters' },
            { ingredient: 'Barbecue', quantity: 40, threshold: 8, unit: 'liters' },
            // Cheeses
            { ingredient: 'Mozzarella', quantity: 50, threshold: 10, unit: 'kg' },
            { ingredient: 'Cheddar', quantity: 30, threshold: 5, unit: 'kg' },
            { ingredient: 'Parmesan', quantity: 20, threshold: 4, unit: 'kg' },
            // Veggies
            { ingredient: 'Onion', quantity: 70, threshold: 15, unit: 'kg' },
            { ingredient: 'Tomato', quantity: 60, threshold: 12, unit: 'kg' },
            { ingredient: 'Capsicum', quantity: 50, threshold: 10, unit: 'kg' },
            { ingredient: 'Mushroom', quantity: 40, threshold: 8, unit: 'kg' },
            { ingredient: 'Corn', quantity: 30, threshold: 6, unit: 'kg' },
            // Generic categories (if still needed for calculations or other parts)
            { ingredient: 'pizzaBase', quantity: 100, threshold: 20, unit: 'pieces' }, 
            { ingredient: 'sauce', quantity: 50, threshold: 10, unit: 'liters' },
            { ingredient: 'cheese', quantity: 50, threshold: 10, unit: 'kg' },
            { ingredient: 'veggies', quantity: 100, threshold: 20, unit: 'kg' },
            { ingredient: 'meat', quantity: 50, threshold: 10, unit: 'kg' }
        ];

        await Inventory.insertMany(initialInventory);
        console.log('Inventory seeded successfully');

    } catch (error) {
        console.error('Error seeding inventory:', error);
    } finally {
        mongoose.disconnect();
        console.log('MongoDB disconnected');
    }
};

seedInventory(); 