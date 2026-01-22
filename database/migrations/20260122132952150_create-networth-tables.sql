-- Up Migration

BEGIN;

CREATE TABLE IF NOT EXISTS networth_categories (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS networth_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES networth_categories(id)
);


CREATE TABLE IF NOT EXISTS networth_insitutions (
    id SERIAL PRIMARY KEY,
    instituion_name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    type_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES networth_categories(id),
    FOREIGN KEY (category_id) REFERENCES networth_types(id)
);


-- Note: Including category_id in transactions for direct reference, though it could be inferred through expense_types
CREATE TABLE IF NOT EXISTS networth_transactions (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type_id INT NOT NULL,
    category_id INT NOT NULL,
    institution_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (type_id) REFERENCES expense_types(id),
    FOREIGN KEY (category_id) REFERENCES expense_categories(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

COMMIT;

-- Down Migration