-- Database schema creation for Order Delivery System

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
    category VARCHAR(100)
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
    unit_price DOUBLE,
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
    order_id BIGINT,
    order_status VARCHAR(50),
    delivery_status VARCHAR(50),
    timestamp DATETIME,
    description TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
