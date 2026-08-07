const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createOrder, getMyOrders } = require('../controllers/orderController');

// All order routes require a valid JWT — protect them with the existing middleware.

// POST /api/orders — place a new order for the logged-in user
router.post('/', authMiddleware, createOrder);

// GET /api/orders — fetch the logged-in user's orders
router.get('/', authMiddleware, getMyOrders);

module.exports = router;
