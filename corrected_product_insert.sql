-- Corrected INSERT statements for product table without the sku field
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
