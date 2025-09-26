const jwt = require('jsonwebtoken');

class AuthService {
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    generateToken(payload) {
        return jwt.sign(
            payload,
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
    }
}

module.exports = new AuthService();
