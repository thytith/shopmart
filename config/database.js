const mysql = require('mysql2/promise');

class Database {
    constructor() {
        this.pool = null;
        this.init();
    }

    init() {
        try {
            this.pool = mysql.createPool({
                host: process.env.DB_PROXY_HOST || 'localhost',
                port: process.env.DB_PROXY_PORT || 4006,
                user: process.env.DB_USER || 'app_user',
                password: process.env.DB_PASSWORD || 'AppPass123',
                database: process.env.DB_NAME || 'shopmart',
                connectionLimit: parseInt(process.env.DB_POOL_LIMIT) || 20,
                acquireTimeout: 60000,
                timeout: 60000,
                reconnect: true,
                charset: 'utf8mb4',
                timezone: '+00:00',
                debug: false,
                multipleStatements: false
            });

            console.log('✅ Database pool created successfully');
            this.testConnection();
        } catch (error) {
            console.error('❌ Database initialization failed:', error);
            throw error;
        }
    }

    async testConnection() {
        try {
            const connection = await this.pool.getConnection();
            console.log('✅ Database connection test successful');
            connection.release();
        } catch (error) {
            console.error('❌ Database connection test failed:', error.message);
        }
    }

    async query(sql, params = []) {
        const connection = await this.pool.getConnection();
        try {
            const [results] = await connection.execute(sql, params);
            return results;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async transaction(callback) {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();
            const result = await callback(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = new Database();
