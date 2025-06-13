const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// Get inventory status (admin only)
router.get('/status', isAuthenticated, isAdmin, inventoryController.getInventoryStatus);

// Update inventory (admin only)
router.put('/update', isAuthenticated, isAdmin, inventoryController.updateInventory);

module.exports = router; 