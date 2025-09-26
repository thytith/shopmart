const db = require('../config/database');

class OrderService {
    async createOrder(userId, items, shippingAddress = '') {
        return await db.transaction(async (connection) => {
            // 1. Calculate total amount and validate stock
            let totalAmount = 0;
            for (const item of items) {
                const [product] = await connection.execute(
                    'SELECT price, stock_quantity FROM products WHERE id = ?',
                    [item.productId]
                );
                
                if (!product[0]) {
                    throw new Error(`Product ${item.productId} not found`);
                }
                
                if (product[0].stock_quantity < item.quantity) {
                    throw new Error(`Insufficient stock for product ${item.productId}`);
                }

                totalAmount += product[0].price * item.quantity;
            }

            // 2. Create order
            const [orderResult] = await connection.execute(
                'INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)',
                [userId, totalAmount, 'pending', shippingAddress]
            );

            const orderId = orderResult.insertId;

            // 3. Create order items and update stock
            for (const item of items) {
                const [product] = await connection.execute(
                    'SELECT price FROM products WHERE id = ?',
                    [item.productId]
                );

                await connection.execute(
                    'INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)',
                    [orderId, item.productId, item.quantity, product[0].price, product[0].price * item.quantity]
                );

                // Update product stock
                await connection.execute(
                    'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                    [item.quantity, item.productId]
                );
            }

            return orderId;
        });
    }

    async getUserOrders(userId) {
        const sql = `
            SELECT o.*, COUNT(oi.id) as item_count 
            FROM orders o 
            LEFT JOIN order_items oi ON o.id = oi.order_id 
            WHERE o.user_id = ? 
            GROUP BY o.id 
            ORDER BY o.created_at DESC
        `;
        return await db.query(sql, [userId]);
    }

    async getOrderById(orderId) {
        const orderSql = 'SELECT * FROM orders WHERE id = ?';
        const itemsSql = `
            SELECT oi.*, p.name as product_name 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = ?
        `;
        
        const [order] = await db.query(orderSql, [orderId]);
        if (!order) return null;

        const items = await db.query(itemsSql, [orderId]);
        
        return {
            ...order,
            items
        };
    }
}

module.exports = new OrderService();
