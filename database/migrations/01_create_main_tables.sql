BEGIN;

CREATE TABLE expense_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL
);

CREATE TABLE expense_types (
    type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(255) NOT NULL,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES expense_categories(category_id)
);

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type_id INT,
    FOREIGN KEY (type_id) REFERENCES expense_types(type_id)
);

COMMIT;
