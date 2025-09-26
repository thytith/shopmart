const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

// POST /api/users/register - Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        const userId = await userService.registerUser({
            email,
            password,
            firstName,
            lastName
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { userId }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/users/login - User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        const token = await userService.loginUser(email, password);

        res.json({
            success: true,
            message: 'Login successful',
            data: { token }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/users/profile - Get user profile
router.get('/profile', async (req, res) => {
    try {
        const userId = 1; // In real app, get from auth token
        const user = await userService.getUserProfile(userId);
        
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
