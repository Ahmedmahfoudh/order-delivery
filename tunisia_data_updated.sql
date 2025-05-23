-- Clear existing data (if any)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE tracking_history;
TRUNCATE TABLE payment;
TRUNCATE TABLE delivery;
TRUNCATE TABLE order_line;
TRUNCATE TABLE orders;
TRUNCATE TABLE product;
TRUNCATE TABLE supplier;
TRUNCATE TABLE customer;
TRUNCATE TABLE carrier;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert Suppliers from Tunisia
INSERT INTO supplier (name, contact_person, email, phone, address, notes) VALUES
('Nabeul Olive Oil Co.', 'Ahmed Ben Ali', 'ahmed@nabeulolive.tn', '+216 72 123 456', 'Rue de l''Huile 45, Nabeul, Tunisia', 'Premium olive oil supplier from Nabeul region'),
('Kelibia Seafood', 'Sami Mansour', 'contact@kelibiafish.tn', '+216 72 987 654', 'Port de Pêche, Kelibia, Tunisia', 'Fresh seafood from Kelibia coast'),
('Tunisian Pottery Works', 'Leila Trabelsi', 'info@tunisianpottery.com', '+216 72 456 789', 'Zone Artisanale, Nabeul, Tunisia', 'Traditional pottery and ceramics'),
('Cap Bon Agrumes', 'Karim Belhaj', 'sales@capbonagrumes.tn', '+216 72 234 567', 'Route de Hammamet, Nabeul, Tunisia', 'Citrus fruits from Cap Bon region'),
('Kelibia Textiles', 'Fatma Gharbi', 'fatma@kelibiatextiles.tn', '+216 72 345 678', 'Zone Industrielle, Kelibia, Tunisia', 'Traditional Tunisian textiles and clothing');

-- Insert Products (note: no sku field in the actual table)
INSERT INTO product (name, description, price, stock, category, supplier_id) VALUES
('Extra Virgin Olive Oil 1L', 'Premium olive oil from Nabeul region', 25.99, 200, 'Grocery', 1),
('Olive Oil Soap', 'Handmade soap with Nabeul olive oil', 5.99, 300, 'Personal Care', 1),
('Fresh Sea Bass', 'Caught daily from Kelibia waters', 18.50, 50, 'Seafood', 2),
('Grilled Sardines', 'Traditional Kelibia style', 12.99, 40, 'Seafood', 2),
('Decorative Plate', 'Hand-painted ceramic plate from Nabeul', 35.00, 75, 'Home Decor', 3),
('Ceramic Tagine', 'Traditional cooking pot', 45.00, 60, 'Kitchenware', 3),
('Nabeul Oranges 5kg', 'Sweet oranges from Cap Bon', 8.99, 150, 'Grocery', 4),
('Lemon Preserve', 'Traditional preserved lemons', 7.50, 100, 'Grocery', 4),
('Traditional Fouta', 'Handwoven cotton beach towel', 15.00, 120, 'Home Textiles', 5),
('Embroidered Cushion Cover', 'Traditional Tunisian design', 22.50, 80, 'Home Textiles', 5);

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

-- Insert OrderLines (note: using unit_price instead of price)
INSERT INTO order_line (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 2, 25.99),
(1, 2, 1, 5.99),
(2, 6, 1, 45.00),
(3, 7, 2, 8.99),
(3, 8, 2, 7.50),
(4, 3, 2, 18.50),
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

-- Insert Payments (note: using date instead of payment_date and method instead of payment_method)
INSERT INTO payment (order_id, date, method, status) VALUES
(1, '2025-05-10', 'CREDIT_CARD', 'COMPLETED'),
(2, '2025-05-15', 'CASH', 'COMPLETED'),
(3, '2025-05-18', 'BANK_TRANSFER', 'COMPLETED'),
(4, '2025-05-20', 'CREDIT_CARD', 'COMPLETED'),
(5, '2025-05-22', 'CASH_ON_DELIVERY', 'PENDING');

-- Insert Tracking History (note: using delivery_status, description, and order_status fields)
INSERT INTO tracking_history (order_id, delivery_status, description, order_status, timestamp) VALUES
(1, 'PICKED_UP', 'Package picked up from supplier', 'PROCESSING', '2025-05-11 09:30:00'),
(1, 'IN_TRANSIT', 'Package in transit', 'PROCESSING', '2025-05-11 14:45:00'),
(1, 'DELIVERED', 'Package delivered successfully', 'DELIVERED', '2025-05-12 11:20:00'),
(2, 'PICKED_UP', 'Package picked up from supplier', 'PROCESSING', '2025-05-16 10:15:00'),
(2, 'DELIVERED', 'Package delivered successfully', 'DELIVERED', '2025-05-17 13:40:00'),
(3, 'PICKED_UP', 'Package picked up from supplier', 'PROCESSING', '2025-05-21 08:45:00'),
(3, 'IN_TRANSIT', 'Package in transit', 'IN_DELIVERY', '2025-05-22 16:30:00'),
(4, 'PICKED_UP', 'Package picked up from supplier', 'PROCESSING', '2025-05-21 11:20:00'),
(4, 'IN_TRANSIT', 'Package in transit', 'IN_DELIVERY', '2025-05-22 14:15:00'),
(5, 'PENDING', 'Pickup scheduled', 'CONFIRMED', '2025-05-22 17:00:00');
