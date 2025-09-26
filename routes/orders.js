const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');

// GET /api/orders - Get user's orders
router.get('/', async (req, res) => {
    try {
        const userId = 1; // In real app, get from auth token
        const orders = await orderService.getUserOrders(userId);
        
        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/orders/:id - Get order details
router.get('/:id', async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;
        const userId = 1; // In real app, get from auth token

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Order items are required'
            });
        }

        const orderId = await orderService.createOrder(userId, items, shippingAddress);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: { orderId }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
