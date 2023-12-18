BEGIN;

INSERT INTO expense_categories (category_name) VALUES 
('Food & Dining'),
('Utilities'),
('Travel'),
('Entertainment'),
('Education'),
('Activities'),
('Other');

INSERT INTO expense_types (type_name, category_id) VALUES 
('Groceries', 1),
('Restaurants', 1),
('Electricity', 2),
('Water', 2),
('Internet', 2),
('Air_Travel', 3),
('Accommodation', 3),
('Movies', 4),
('Concerts', 4),
('Online_learning',5),
('Books',5),
('Gym',6),
('Transportation',7);

COMMIT;
