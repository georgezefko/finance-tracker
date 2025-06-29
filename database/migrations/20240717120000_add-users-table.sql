-- Up Migration
BEGIN;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE transactions
ADD COLUMN user_id INTEGER,
ADD CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES users(id)
    ON DELETE CASCADE;

COMMIT;

-- Down Migration
BEGIN;

ALTER TABLE transactions
DROP CONSTRAINT fk_user,
DROP COLUMN user_id;

DROP TABLE IF EXISTS users;

COMMIT; 