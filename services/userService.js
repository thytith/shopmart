const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

class UserService {
    async registerUser(userData) {
        const { email, password, firstName, lastName } = userData;

        // Check if user already exists
        const existingUser = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            throw new Error('User already exists with this email');
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        const result = await db.query(
            'INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)',
            [email, passwordHash, firstName, lastName]
        );

        return result.insertId;
    }

    async loginUser(email, password) {
        // Find user
        const users = await db.query(
            'SELECT id, email, password_hash, first_name, last_name, role FROM users WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            throw new Error('Invalid email or password');
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                role: user.role 
            },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        return token;
    }

    async getUserProfile(userId) {
        const users = await db.query(
            'SELECT id, email, first_name, last_name, role, created_at FROM users WHERE id = ?',
            [userId]
        );
        
        if (users.length === 0) {
            throw new Error('User not found');
        }

        const user = users[0];
        
        // Get user's order count
        const orderCount = await db.query(
            'SELECT COUNT(*) as count FROM orders WHERE user_id = ?',
            [userId]
        );

        return {
            ...user,
            orderCount: orderCount[0].count
        };
    }
}

module.exports = new UserService();
