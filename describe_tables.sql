-- Command to describe the product table structure
DESCRIBE product;
Field
Type
Null
Key
Default
Extra
id
bigint
NO
PRI
NULL
auto_increment
description
varchar(255)
YES
NULL
name
varchar(255)
YES
NULL
price
double
YES
NULL
stock
int
YES
NULL
category
varchar(100)
YES
NULL

-- Command to describe the supplier table structure
DESCRIBE supplier;

Field
Type
Null
Key
Default
Extra
id
bigint
NO
PRI
NULL
auto_increment
name
varchar(255)
NO
NULL
contact_person
varchar(255)
YES
NULL
email
varchar(255)
YES
NULL
phone
varchar(50)
YES
NULL
address
varchar(255)
YES
NULL
notes
text
YES
NULL

-- Command to describe the customer table structure
DESCRIBE customer;

Field
Type
Null
Key
Default
Extra
id
bigint
NO
PRI
NULL
auto_increment
address
varchar(255)
YES
NULL
email
varchar(255)
YES
NULL
name
varchar(255)
YES
NULL

-- Command to describe the carrier table structure
DESCRIBE carrier;
Field
Type
Null
Key
Default
Extra
id
bigint
NO
PRI
NULL
auto_increment
name
varchar(255)
YES
NULL
note
varchar(255)
YES
NULL
phone
varchar(255)
YES
NULL

-- Command to describe the orders table structure
DESCRIBE orders;
Field
Type
Null
Key
Default
Extra
id
bigint
NO
PRI
NULL
auto_increment
date
date
YES
NULL
status
varchar(255)
YES
NULL
total_amount
double
YES
NULL
customer_id
bigint
YES
MUL
NULL

-- Command to describe the order_line table structure
DESCRIBE order_line;
Field
Type
Null
Key
Default
Extra
id
bigint
NO
PRI
NULL
auto_increment
quantity
int
YES
NULL
unit_price
double
YES
NULL
order_id
bigint
YES
MUL
NULL
product_id
bigint
YES
MUL
NULL

-- Command to describe the delivery table structure
DESCRIBE delivery;

Field
Type
Null
Key
Default
Extra
id
bigint
NO
PRI
NULL
auto_increment
cost
double
YES
NULL
delivery_date
date
YES
NULL
status
varchar(255)
YES
NULL
carrier_id
bigint
YES
MUL
NULL
order_id
bigint
YES
UNI
NULL

-- Command to describe the payment table structure
DESCRIBE payment;
Field
Type
Null
Key
Default
Extra
id
bigint
NO
PRI
NULL
auto_increment
date
date
YES
NULL
method
varchar(255)
YES
NULL
status
varchar(255)
YES
NULL
order_id
bigint
YES
UNI
NULL

-- Command to describe the tracking_history table structure
DESCRIBE tracking_history;
Field
Type
Null
Key
Default
Extra
id
bigint
NO
PRI
NULL
auto_increment
delivery_status
enum('ASSIGNED','DELIVERED','FAILED','IN_TRANSIT','PENDING','PICKED_UP')
YES
NULL
description
varchar(255)
YES
NULL
order_status
enum('CANCELLED','CONFIRMED','DELIVERED','IN_DELIVERY','PENDING','PROCESSING','READY_FOR_DELIVERY')
YES
NULL
timestamp
datetime(6)
YES
NULL
order_id
bigint
YES
MUL
NULL

