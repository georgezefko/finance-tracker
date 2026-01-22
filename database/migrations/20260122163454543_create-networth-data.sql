-- Up Migration

BEGIN;

INSERT INTO networth_categories (category_name) VALUES 
('Cash'),
('Liquid Assets'),
('Other');

INSERT INTO networth_types (type_name, category_id) VALUES 
('Bank', 1),
('Stocks',2),
('Crypto',2),
('Pension', 2),
('Real Estate', 2),
('Pension', 2);

INSERT INTO networth_insitutions (instituion_name, type_id, category_id) VALUES 
('Nordea', 1, 1),
('Revolut',1, 1),
('revolut Crypto', 3, 2),
('Nordnet', 2, 2),
('Binance', 3, 2),
('Pension', 6, 2);

COMMIT;

-- Down Migration