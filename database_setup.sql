-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS order_delivery_db;
USE order_delivery_db;

-- Create Supplier table
CREATE TABLE IF NOT EXISTS supplier (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address VARCHAR(255),
    notes TEXT
);

-- Create Product table
CREATE TABLE IF NOT EXISTS product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DOUBLE,
    stock INTEGER,
    sku VARCHAR(50),
    category VARCHAR(100),
    supplier_id BIGINT,
    FOREIGN KEY (supplier_id) REFERENCES supplier(id)
);

-- Create Customer table
CREATE TABLE IF NOT EXISTS customer (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    address VARCHAR(255)
);

-- Create Carrier table
CREATE TABLE IF NOT EXISTS carrier (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    note TEXT
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT,
    date DATE,
    status VARCHAR(50),
    total_amount DOUBLE,
    FOREIGN KEY (customer_id) REFERENCES customer(id)
);

-- Create OrderLine table
CREATE TABLE IF NOT EXISTS order_line (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT,
    product_id BIGINT,
    quantity INTEGER,
    price DOUBLE,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Create Delivery table
CREATE TABLE IF NOT EXISTS delivery (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT,
    carrier_id BIGINT,
    delivery_date DATE,
    cost DOUBLE,
    status VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (carrier_id) REFERENCES carrier(id)
);

-- Create Payment table
CREATE TABLE IF NOT EXISTS payment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT,
    amount DOUBLE,
    payment_date DATE,
    payment_method VARCHAR(50),
    status VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Create TrackingHistory table
CREATE TABLE IF NOT EXISTS tracking_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    delivery_id BIGINT,
    status VARCHAR(50),
    timestamp DATETIME,
    location VARCHAR(255),
    notes TEXT,
    FOREIGN KEY (delivery_id) REFERENCES delivery(id)
);

-- Insert Suppliers from Tunisia
INSERT INTO supplier (name, contact_person, email, phone, address, notes) VALUES
('Nabeul Olive Oil Co.', 'Ahmed Ben Ali', 'ahmed@nabeulolive.tn', '+216 72 123 456', 'Rue de l''Huile 45, Nabeul, Tunisia', 'Premium olive oil supplier from Nabeul region'),
('Kelibia Seafood', 'Sami Mansour', 'contact@kelibiafish.tn', '+216 72 987 654', 'Port de Pêche, Kelibia, Tunisia', 'Fresh seafood from Kelibia coast'),
('Tunisian Pottery Works', 'Leila Trabelsi', 'info@tunisianpottery.com', '+216 72 456 789', 'Zone Artisanale, Nabeul, Tunisia', 'Traditional pottery and ceramics'),
('Cap Bon Agrumes', 'Karim Belhaj', 'sales@capbonagrumes.tn', '+216 72 234 567', 'Route de Hammamet, Nabeul, Tunisia', 'Citrus fruits from Cap Bon region'),
('Kelibia Textiles', 'Fatma Gharbi', 'fatma@kelibiatextiles.tn', '+216 72 345 678', 'Zone Industrielle, Kelibia, Tunisia', 'Traditional Tunisian textiles and clothing');

-- Insert Products
INSERT INTO product (name, description, price, stock, sku, category, supplier_id) VALUES
('Extra Virgin Olive Oil 1L', 'Premium olive oil from Nabeul region', 25.99, 200, 'OIL-001', 'Grocery', 1),
('Olive Oil Soap', 'Handmade soap with Nabeul olive oil', 5.99, 300, 'SOAP-001', 'Personal Care', 1),
('Fresh Sea Bass', 'Caught daily from Kelibia waters', 18.50, 50, 'FISH-001', 'Seafood', 2),
('Grilled Sardines', 'Traditional Kelibia style', 12.99, 40, 'FISH-002', 'Seafood', 2),
('Decorative Plate', 'Hand-painted ceramic plate from Nabeul', 35.00, 75, 'POT-001', 'Home Decor', 3),
('Ceramic Tagine', 'Traditional cooking pot', 45.00, 60, 'POT-002', 'Kitchenware', 3),
('Nabeul Oranges 5kg', 'Sweet oranges from Cap Bon', 8.99, 150, 'FRUIT-001', 'Grocery', 4),
('Lemon Preserve', 'Traditional preserved lemons', 7.50, 100, 'FOOD-001', 'Grocery', 4),
('Traditional Fouta', 'Handwoven cotton beach towel', 15.00, 120, 'TEX-001', 'Home Textiles', 5),
('Embroidered Cushion Cover', 'Traditional Tunisian design', 22.50, 80, 'TEX-002', 'Home Textiles', 5);

-- Insert Customers from Tunisia
INSERT INTO customer (name, email, address) VALUES
('Mohamed Aziz', 'mohamed@example.com', 'Rue Ibn Khaldoun 23, Nabeul, Tunisia'),
('Amina Belhadj', 'amina@example.com', 'Avenue Habib Bourguiba 45, Kelibia, Tunisia'),
('Youssef Triki', 'youssef@example.com', 'Rue des Orangers 12, Hammamet, Tunisia'),
('Salma Karoui', 'salma@example.com', 'Rue de la Plage 8, Kelibia, Tunisia'),
('Nizar Mejri', 'nizar@example.com', 'Avenue de la République 34, Nabeul, Tunisia');

-- Insert Carriers
INSERT INTO carrier (name, phone, note) VALUES
('Kelibia Express', '+216 72 111 222', 'Local delivery service in Kelibia area'),
('Nabeul Logistics', '+216 72 333 444', 'Specializes in Nabeul region deliveries'),
('Tunisia Post', '+216 71 888 999', 'National postal service'),
('Cap Bon Delivery', '+216 72 555 666', 'Regional delivery service for Cap Bon peninsula'),
('Rapid Courier', '+216 72 777 888', 'Express delivery service');

-- Insert Orders
INSERT INTO orders (customer_id, date, status, total_amount) VALUES
(1, '2025-05-10', 'COMPLETED', 57.98),
(2, '2025-05-15', 'COMPLETED', 45.00),
(3, '2025-05-18', 'PROCESSING', 31.99),
(4, '2025-05-20', 'SHIPPED', 63.50),
(5, '2025-05-22', 'PENDING', 37.50);

-- Insert OrderLines
INSERT INTO order_line (order_id, product_id, quantity, price) VALUES
(1, 1, 2, 51.98),
(1, 2, 1, 5.99),
(2, 6, 1, 45.00),
(3, 7, 2, 17.98),
(3, 8, 2, 15.00),
(4, 3, 2, 37.00),
(4, 5, 1, 35.00),
(5, 9, 1, 15.00),
(5, 10, 1, 22.50);

-- Insert Deliveries
INSERT INTO delivery (order_id, carrier_id, delivery_date, cost, status) VALUES
(1, 2, '2025-05-12', 8.50, 'DELIVERED'),
(2, 1, '2025-05-17', 7.00, 'DELIVERED'),
(3, 4, '2025-05-23', 9.00, 'IN_TRANSIT'),
(4, 3, '2025-05-25', 10.50, 'IN_TRANSIT'),
(5, 5, '2025-05-27', 12.00, 'SCHEDULED');

-- Insert Payments
INSERT INTO payment (order_id, amount, payment_date, payment_method, status) VALUES
(1, 57.98, '2025-05-10', 'CREDIT_CARD', 'COMPLETED'),
(2, 45.00, '2025-05-15', 'CASH', 'COMPLETED'),
(3, 31.99, '2025-05-18', 'BANK_TRANSFER', 'COMPLETED'),
(4, 63.50, '2025-05-20', 'CREDIT_CARD', 'COMPLETED'),
(5, 37.50, '2025-05-22', 'CASH_ON_DELIVERY', 'PENDING');

-- Insert Tracking History
INSERT INTO tracking_history (delivery_id, status, timestamp, location, notes) VALUES
(1, 'PICKED_UP', '2025-05-11 09:30:00', 'Nabeul Warehouse', 'Package picked up from supplier'),
(1, 'IN_TRANSIT', '2025-05-11 14:45:00', 'Nabeul Distribution Center', 'Package in transit'),
(1, 'DELIVERED', '2025-05-12 11:20:00', 'Customer Address', 'Package delivered successfully'),
(2, 'PICKED_UP', '2025-05-16 10:15:00', 'Kelibia Warehouse', 'Package picked up from supplier'),
(2, 'DELIVERED', '2025-05-17 13:40:00', 'Customer Address', 'Package delivered successfully'),
(3, 'PICKED_UP', '2025-05-21 08:45:00', 'Cap Bon Distribution Center', 'Package picked up from supplier'),
(3, 'IN_TRANSIT', '2025-05-22 16:30:00', 'Hammamet Sorting Facility', 'Package in transit'),
(4, 'PICKED_UP', '2025-05-21 11:20:00', 'Kelibia Port Facility', 'Package picked up from supplier'),
(4, 'IN_TRANSIT', '2025-05-22 14:15:00', 'Nabeul Distribution Center', 'Package in transit'),
(5, 'SCHEDULED', '2025-05-22 17:00:00', 'Kelibia Warehouse', 'Pickup scheduled');
