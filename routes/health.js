const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
    const healthCheck = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        server: process.env.SERVER_NAME || 'unknown',
        components: {
            database: { status: 'checking', responseTime: 0 }
        }
    };

    try {
        const startTime = Date.now();
        await db.query('SELECT 1 as health_check');
        const responseTime = Date.now() - startTime;
        
        healthCheck.components.database = {
            status: 'connected',
            responseTime: `${responseTime}ms`,
            proxy: `${process.env.DB_PROXY_HOST}:${process.env.DB_PROXY_PORT}`
        };
        
        res.json(healthCheck);
    } catch (error) {
        healthCheck.status = 'ERROR';
        healthCheck.components.database = {
            status: 'disconnected',
            error: error.message
        };
        res.status(503).json(healthCheck);
    }
});

module.exports = router;
