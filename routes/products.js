const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

// GET /api/products - Get all products with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';

        const products = await productService.getProducts(page, limit, search);
        
        res.json({
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                total: products.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/products - Create new product (Admin only)
router.post('/', async (req, res) => {
    try {
        const { name, description, price, stock_quantity, category } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                success: false,
                error: 'Name and price are required'
            });
        }

        const productId = await productService.createProduct({
            name,
            description,
            price,
            stock_quantity: stock_quantity || 0,
            category
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { id: productId }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res) => {
    try {
        await productService.updateProduct(req.params.id, req.body);
        
        res.json({
            success: true,
            message: 'Product updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
