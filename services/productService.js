const db = require('../config/database');

class ProductService {
    async getProducts(page = 1, limit = 20, search = '') {
        const offset = (page - 1) * limit;
        let sql = `
            SELECT id, name, description, price, stock_quantity, category, 
                   created_at, updated_at 
            FROM products 
            WHERE stock_quantity > 0 
        `;
        let params = [];

        if (search) {
            sql += ` AND (name LIKE ? OR description LIKE ? OR category LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        return await db.query(sql, params);
    }

    async getProductById(id) {
        const sql = `
            SELECT id, name, description, price, stock_quantity, category, 
                   created_at, updated_at 
            FROM products 
            WHERE id = ?
        `;
        const products = await db.query(sql, [id]);
        return products[0] || null;
    }

    async createProduct(productData) {
        const sql = `
            INSERT INTO products (name, description, price, stock_quantity, category) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const result = await db.query(sql, [
            productData.name,
            productData.description,
            productData.price,
            productData.stock_quantity,
            productData.category || 'general'
        ]);
        return result.insertId;
    }

    async updateProduct(id, productData) {
        const allowedFields = ['name', 'description', 'price', 'stock_quantity', 'category'];
        const updates = [];
        const params = [];

        for (const field of allowedFields) {
            if (productData[field] !== undefined) {
                updates.push(`${field} = ?`);
                params.push(productData[field]);
            }
        }

        if (updates.length === 0) {
            throw new Error('No valid fields to update');
        }

        params.push(id);
        const sql = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
        await db.query(sql, params);
    }

    async updateStock(productId, quantityChange) {
        const sql = 'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?';
        await db.query(sql, [quantityChange, productId]);
    }
}

module.exports = new ProductService();
