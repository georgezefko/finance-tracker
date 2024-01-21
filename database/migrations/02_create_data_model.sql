BEGIN;

INSERT INTO expense_categories (category_name) VALUES 
('Income'),
('Personal Fixed Costs'),
('Personal Running Costs'),
('Housing Fixed Costs'),
('Travel Costs');

INSERT INTO expense_types (type_name, category_id) VALUES 
('Salary', 1),
('Bonus',1),
('Other Income',1),
('Groceries', 2),
('Gym', 2),
('Akasse', 2),
('Mobile Phone', 2),
('Subscription', 2),
('Other Housing', 2),
('Shopping Clothes', 3),
('Shopping Other', 3),
('Classes & Coaching', 3),
('Books', 3),
('Restaurants', 3),
('Fast Food', 3),
('Drinks', 3),
('Other Non Housing', 3),
('Rent', 4),
('Tickets', 5),
('Accommodation', 5),
('Travel Expenses', 5),
('Transportation',3);

COMMIT;
