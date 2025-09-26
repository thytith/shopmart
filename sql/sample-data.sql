-- Additional sample data for testing
INSERT INTO products (name, description, price, stock_quantity, category) VALUES
('Mechanical Keyboard', 'RGB mechanical keyboard with blue switches', 129.99, 30, 'electronics'),
('Gaming Mouse', 'High DPI gaming mouse with programmable buttons', 79.99, 40, 'electronics'),
('4K Monitor', '27-inch 4K UHD monitor with HDR', 399.99, 10, 'electronics'),
('Desk Lamp', 'LED desk lamp with adjustable brightness', 49.99, 100, 'home'),
('Notebook Set', 'Premium quality notebook and pen set', 24.99, 200, 'office'),
('Water Filter', 'Advanced water filtration system', 199.99, 15, 'home'),
('Fitness Tracker', 'Smart watch with heart rate monitoring', 149.99, 25, 'sports');

-- Sample customers
INSERT INTO users (email, password_hash, first_name, last_name) VALUES
('customer1@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe'),
('customer2@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Smith');

-- Sample orders
INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES
(2, 129.98, 'delivered', '123 Main St, City, State 12345'),
(2, 299.99, 'shipped', '456 Oak Ave, City, State 12345');

-- Sample order items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
(1, 1, 1, 129.99, 129.99),
(2, 3, 1, 299.99, 299.99);
