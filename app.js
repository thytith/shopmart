require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS || '*',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
    max: parseInt(process.env.API_RATE_LIMIT_MAX) || 100,
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});
app.use('/api/', limiter);

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/health', require('./routes/health'));

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🛍️ ShopSmart E-Commerce API',
        version: '1.0.0',
        documentation: '/api/docs',
        health: '/health'
    });
});

// 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `Route ${req.originalUrl} does not exist`,
        available_endpoints: [
            'GET /',
            'GET /health',
            'GET /api/products',
            'POST /api/orders',
            'GET /api/users/profile'
        ]
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
🛍️  ShopSmart API Server
📍  Port: ${PORT}
🏠  Environment: ${process.env.NODE_ENV}
🗄️  Database: ${process.env.DB_PROXY_HOST}:${process.env.DB_PROXY_PORT}
👤  Server: ${process.env.SERVER_NAME || 'Unknown'}
    `);
});

module.exports = app;
