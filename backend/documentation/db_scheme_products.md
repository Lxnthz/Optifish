# Product Database Schema

This backend uses a relational database with the following tables and relationships for product and cart management.

---

## Table: `products`

Stores all products available for purchase.

| Column      | Type              | Details                        |
|-------------|-------------------|--------------------------------|
| product_id  | INT, AUTO_INCREMENT, PRIMARY KEY | Unique product ID         |
| name        | VARCHAR(255)      | Product name                   |
| price       | DECIMAL(10,2)     | Product price                  |
| stock       | INT               | Number of items in stock       |

**SQL:**
```sql
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10,2),
    stock INT
);
```

---

## Table: `carts`

Stores shopping carts for users and guests.

| Column      | Type                | Details                                         |
|-------------|---------------------|-------------------------------------------------|
| cart_id     | INT, AUTO_INCREMENT, PRIMARY KEY | Unique cart ID                  |
| user_id     | INT, NULL           | References `users(id)`, null for guests         |
| session_id  | VARCHAR(128), NULL  | Used to track guest cart                        |
| created_at  | DATETIME            | Cart creation timestamp, default: CURRENT_TIMESTAMP |
| updated_at  | DATETIME            | Last update timestamp, auto-updated             |

- `user_id` is a foreign key referencing `users(id)` (nullable).
- Either `user_id` or `session_id` must be present, but not both.

**SQL:**
```sql
CREATE TABLE carts (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    session_id VARCHAR(128) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_or_session CHECK (
        (user_id IS NOT NULL AND session_id IS NULL) OR
        (user_id IS NULL AND session_id IS NOT NULL)
    )
);
```

---

## Table: `cart_items`

Stores items in each cart.

| Column      | Type              | Details                                         |
|-------------|-------------------|-------------------------------------------------|
| item_id     | INT, AUTO_INCREMENT, PRIMARY KEY | Unique item ID                  |
| cart_id     | INT, NOT NULL     | References `carts(cart_id)`                     |
| product_id  | INT, NOT NULL     | References `products(product_id)`               |
| quantity    | INT, NOT NULL     | Quantity of product, must be > 0                |
| added_at    | DATETIME          | Timestamp when item was added, default: CURRENT_TIMESTAMP |

- `cart_id` is a foreign key referencing `carts(cart_id)` (cascade on delete).
- `product_id` is a foreign key referencing `products(product_id)`.

**SQL:**
```sql
CREATE TABLE cart_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
```

---