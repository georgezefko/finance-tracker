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

--test data
INSERT INTO transactions (id, date, amount, type_id, category_id)
VALUES
    (7, '2024-01-02', 222.00, 14, 3),
    (9, '2024-01-07', 152.00, 4, 2),
    (11, '2024-01-07', 105.00, 15, 3),
    (12, '2024-01-07', 120.00, 22, 3),
    (13, '2024-01-07', 40.00, 15, 3),
    (14, '2024-01-14', 112.00, 4, 2),
    (15, '2024-01-14', 20.00, 22, 3),
    (16, '2024-01-14', 10.00, 22, 3),
    (19, '2024-01-20', 125.00, 15, 3),
    (21, '2024-01-20', 7204.00, 17, 4),
    (22, '2024-01-21', 72.00, 4, 2),
    (23, '2024-01-21', 109.00, 4, 2),
    (24, '2024-01-21', 75.00, 4, 2),
    (25, '2024-01-21', 188.00, 5, 2),
    (26, '2024-01-21', 487.00, 6, 2),
    (27, '2024-01-21', 100.00, 7, 2),
    (28, '2024-01-21', 194.00, 8, 2),
    (32, '2024-01-21', 150.00, 16, 3),
    (6, '2024-01-02', 100.00, 21, 3),
    (10, '2024-01-07', 100.00, 21, 3),
    (17, '2024-01-20', 100.00, 21, 3),
    (29, '2024-01-21', 100.00, 21, 3),
    (31, '2024-01-21', 45.00, 15, 3),
    (18, '2024-01-20', 232.00, 15, 3),
    (20, '2024-01-20', 31.00, 16, 3),
    (33, '2024-01-21', 8754.00, 18, 5),
    (34, '2024-01-21', 103.00, 4, 2),
    (36, '2024-01-23', 65.00, 15, 3),
    (37, '2024-01-24', 200.00, 14, 3),
    (38, '2024-01-24', 100.00, 21, 3),
    (39, '2024-01-28', 45.00, 15, 3),
    (40, '2024-01-28', 62.50, 4, 2),
    (41, '2024-01-28', 90.00, 15, 3),
    (42, '2024-01-28', 265.60, 4, 2),
    (43, '2024-01-28', 88.50, 4, 2),
    (44, '2024-01-28', 115.00, 22, 3),
    (45, '2024-01-28', 45.00, 22, 3),
    (46, '2024-01-28', 40.00, 15, 3),
    (47, '2024-01-29', 35.00, 16, 3),
    (8, '2024-01-02', 26740.00, 1, 1),
    (48, '2024-01-29', 175.00, 22, 3),
    (49, '2024-01-30', 40.00, 16, 3),
    (50, '2024-01-30', 24.00, 4, 2),
    (51, '2024-02-01', 100.00, 21, 3),
    (52, '2024-02-01', 2476.00, 18, 5),
    (53, '2024-02-01', 26740.00, 1, 1),
    (54, '2024-02-01', 188.00, 5, 2),
    (55, '2024-02-01', 487.00, 6, 2),
    (56, '2024-02-01', 100.00, 7, 2),
    (57, '2024-02-01', 194.00, 8, 2),
    (58, '2024-02-04', 82.50, 4, 2),
    (59, '2024-02-04', 116.15, 4, 2),
    (60, '2024-02-04', 100.00, 21, 3),
    (61, '2024-02-04', 393.00, 14, 3),
    (62, '2024-02-04', 70.00, 22, 3),
    (63, '2024-02-04', 1863.00, 18, 5),
    (64, '2024-02-07', 185.00, 4, 2),
    (65, '2024-02-09', 100.00, 21, 3),
    (66, '2024-02-09', 43.00, 15, 3),
    (67, '2024-02-11', 70.00, 22, 3),
    (68, '2024-02-11', 69.00, 15, 3),
    (69, '2024-02-11', 545.00, 14, 3),
    (70, '2024-02-12', 172.00, 4, 2),
    (71, '2024-02-13', 94.00, 15, 3),
    (72, '2024-02-15', 145.00, 15, 3),
    (73, '2024-02-15', 235.00, 13, 3),
    (74, '2024-02-17', 38.00, 22, 3),
    (75, '2024-02-17', 75.00, 15, 3);
COMMIT;
