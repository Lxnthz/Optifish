# Database Schema

This backend uses a relational database with the following tables and relationships:

---

## `users`

Stores all user accounts, including `customer`, `seller`, `admin`, and `consultant`. Guests do not require database entries.

| Column        | Type                                                       | Details                                                |
| ------------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| id            | INT, AUTO_INCREMENT, PRIMARY KEY                           | Unique user ID                                         |
| email         | VARCHAR(255), UNIQUE                                       | User email address                                     |
| password_hash | VARCHAR(255)                                               | Hashed password                                        |
| full_name     | VARCHAR(255)                                               | Full name                                              |
| phone         | VARCHAR(20)                                                | Phone number                                           |
| role          | ENUM('guest', 'customer', 'seller', 'admin', 'consultant') | User role, default: 'guest'                            |
| auth_provider | ENUM('local', 'google')                                    | Authentication provider, default: 'local'              |
| is_active     | BOOLEAN                                                    | Account active status, default: TRUE                   |
| created_at    | DATETIME                                                   | Account creation timestamp, default: CURRENT_TIMESTAMP |
| last_login    | DATETIME, NULL                                             | Last login timestamp                                   |

**SQL:**

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    role ENUM('guest', 'customer', 'seller', 'admin', 'consultant') DEFAULT 'guest',
    auth_provider ENUM('local', 'google') DEFAULT 'local',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME NULL
);
```

---

## `customers`

Details for users with the `customer` role.

| Column           | Type | Details                             |
| ---------------- | ---- | ----------------------------------- |
| user_id          | INT  | Primary key, references `users(id)` |
| shipping_address | TEXT | Customer's shipping address         |
| billing_address  | TEXT | Customer's billing address          |
| loyalty_points   | INT  | Loyalty points, default: 0          |

- `user_id` is a foreign key referencing `users(id)` (cascade on delete).

**SQL:**

```sql
CREATE TABLE customers (
    user_id INT PRIMARY KEY,
    shipping_address TEXT,
    billing_address TEXT,
    loyalty_points INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## `sellers`

Details for users with the `seller` role.

| Column        | Type         | Details                                    |
| ------------- | ------------ | ------------------------------------------ |
| user_id       | INT          | Primary key, references `users(id)`        |
| store_name    | VARCHAR(255) | Seller's store name                        |
| store_slug    | VARCHAR(255) | Unique store slug                          |
| store_logo    | TEXT         | Store logo (URL or data)                   |
| verified      | BOOLEAN      | Seller verification status, default: FALSE |
| business_info | JSON         | Additional business information            |

- `user_id` is a foreign key referencing `users(id)` (cascade on delete).

**SQL:**

```sql
CREATE TABLE sellers (
    user_id INT PRIMARY KEY,
    store_name VARCHAR(255),
    store_slug VARCHAR(255) UNIQUE,
    store_logo TEXT,
    verified BOOLEAN DEFAULT FALSE,
    business_info JSON,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## `admins`

Details for users with the `admin` role.

| Column      | Type | Details                             |
| ----------- | ---- | ----------------------------------- |
| user_id     | INT  | Primary key, references `users(id)` |
| permissions | JSON | Admin permissions                   |
| role_level  | INT  | Admin role level, default: 1        |

- `user_id` is a foreign key referencing `users(id)` (cascade on delete).

**SQL:**

```sql
CREATE TABLE admins (
    user_id INT PRIMARY KEY,
    permissions JSON,
    role_level INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## `consultants`

Details for users with the `consultant` role.

| Column          | Type          | Details                             |
| --------------- | ------------- | ----------------------------------- |
| user_id         | INT           | Primary key, references `users(id)` |
| bio             | TEXT          | Consultant biography                |
| expertise_area  | VARCHAR(255)  | Area of expertise                   |
| available       | BOOLEAN       | Availability status, default: TRUE  |
| hourly_rate     | DECIMAL(10,2) | Hourly rate for consulting          |
| rating          | FLOAT         | Consultant rating, default: 0       |
| profile_picture | TEXT          | Profile picture (URL or data)       |

- `user_id` is a foreign key referencing `users(id)` (cascade on delete).

**SQL:**

```sql
CREATE TABLE consultants (
    user_id INT PRIMARY KEY,
    bio TEXT,
    expertise_area VARCHAR(255),
    available BOOLEAN DEFAULT TRUE,
    hourly_rate DECIMAL(10,2),
    rating FLOAT DEFAULT 0,
    profile_picture TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---
