-- Branches                                   
INSERT INTO branches (branch_id, city, state) OVERRIDING SYSTEM VALUE VALUES (1, 'Las Vegas', 'NV'); 
INSERT INTO branches (branch_id, city, state) OVERRIDING SYSTEM VALUE VALUES (2, 'Reno', 'NV');      
INSERT INTO branches (branch_id, city, state) OVERRIDING SYSTEM VALUE VALUES (3, 'Phoenix', 'AZ');   
INSERT INTO branches (branch_id, city, state) OVERRIDING SYSTEM VALUE VALUES (4, 'San Diego', 'CA'); 
INSERT INTO branches (branch_id, city, state) OVERRIDING SYSTEM VALUE VALUES (5, 'Denver', 'CO');   

-- Persons 
INSERT INTO persons (person_id, name_first, name_last, email) OVERRIDING SYSTEM VALUE VALUES (1, 'Ava', 'Nguyen', 'ava.nguyen@example.com');
INSERT INTO persons (person_id, name_first, name_last, email) OVERRIDING SYSTEM VALUE VALUES (2, 'Liam', 'Patel', 'liam.patel@example.com');
INSERT INTO persons (person_id, name_first, name_last, email) OVERRIDING SYSTEM VALUE VALUES (3, 'Sophia', 'Garcia', 'sophia.garcia@example.com');
INSERT INTO persons (person_id, name_first, name_last, email) OVERRIDING SYSTEM VALUE VALUES (4, 'Noah', 'Johnson', 'noah.johnson@example.com');
INSERT INTO persons (person_id, name_first, name_last, email) OVERRIDING SYSTEM VALUE VALUES (5, 'Emma', 'Kim', 'emma.kim@example.com');

-- Games
INSERT INTO games (game_id, name, price_per_play) OVERRIDING SYSTEM VALUE VALUES (1, 'Blackjack', 10);
INSERT INTO games (game_id, name, price_per_play) OVERRIDING SYSTEM VALUE VALUES (2, 'Roulette', 5);
INSERT INTO games (game_id, name, price_per_play) OVERRIDING SYSTEM VALUE VALUES (3, 'Slots', 1);
INSERT INTO games (game_id, name, price_per_play) OVERRIDING SYSTEM VALUE VALUES (4, 'Poker', 25);
INSERT INTO games (game_id, name, price_per_play) OVERRIDING SYSTEM VALUE VALUES (5, 'Craps', 15);

--cocktails
INSERT INTO cocktails (drink_id, name) OVERRIDING SYSTEM VALUE VALUES (1, 'Old Fashioned');
INSERT INTO cocktails (drink_id, name) OVERRIDING SYSTEM VALUE VALUES (2, 'Margarita');
INSERT INTO cocktails (drink_id, name) OVERRIDING SYSTEM VALUE VALUES (3, 'Mojito');
INSERT INTO cocktails (drink_id, name) OVERRIDING SYSTEM VALUE VALUES (4, 'Negroni');
INSERT INTO cocktails (drink_id, name) OVERRIDING SYSTEM VALUE VALUES (5, 'Whiskey Sour');

--shows
INSERT INTO shows (show_id, name) OVERRIDING SYSTEM VALUE VALUES (1, 1001);
INSERT INTO shows (show_id, name) OVERRIDING SYSTEM VALUE VALUES (2, 1002);
INSERT INTO shows (show_id, name) OVERRIDING SYSTEM VALUE VALUES (3, 1003);
INSERT INTO shows (show_id, name) OVERRIDING SYSTEM VALUE VALUES (4, 1004);
INSERT INTO shows (show_id, name) OVERRIDING SYSTEM VALUE VALUES (5, 1005);

-- Customers
INSERT INTO customers (customer, credit) VALUES (1, 250);
INSERT INTO customers (customer, credit) VALUES (2, 120.5);
INSERT INTO customers (customer, credit) VALUES (3, 500);
INSERT INTO customers (customer, credit) VALUES (4, 75.25);
INSERT INTO customers (customer, credit) VALUES (5, 980);

--Employees 
INSERT INTO employees (employee_id, position) VALUES (1, 'Floor Manager');
INSERT INTO employees (employee_id, position) VALUES (2, 'Dealer');
INSERT INTO employees (employee_id, position) VALUES (3, 'Bartender');
INSERT INTO employees (employee_id, position) VALUES (4, 'Security');
INSERT INTO employees (employee_id, position) VALUES (5, 'Host');


--rooms at branches
INSERT INTO rooms_at_branches (room_id, branch_id) VALUES (1, 1);
INSERT INTO rooms_at_branches (room_id, branch_id) VALUES (2, 2);
INSERT INTO rooms_at_branches (room_id, branch_id) VALUES (3, 3);
INSERT INTO rooms_at_branches (room_id, branch_id) VALUES (4, 4);
INSERT INTO rooms_at_branches (room_id, branch_id) VALUES (5, 5);

--special rooms
INSERT INTO special_rooms (room_id, type) OVERRIDING SYSTEM VALUE VALUES (1, 'Bar');
INSERT INTO special_rooms (room_id, type) OVERRIDING SYSTEM VALUE VALUES (2, 'Showroom');
INSERT INTO special_rooms (room_id, type) OVERRIDING SYSTEM VALUE VALUES (3, 'Bar');
INSERT INTO special_rooms (room_id, type) OVERRIDING SYSTEM VALUE VALUES (4, 'Bar');
INSERT INTO special_rooms (room_id, type) OVERRIDING SYSTEM VALUE VALUES (5, 'Showroom');

--works at
INSERT INTO works_at (employee_id, branch_id, start_date, end_date) VALUES (1, 1, '2024-01-15', NULL);
INSERT INTO works_at (employee_id, branch_id, start_date, end_date) VALUES (2, 2, '2023-08-01', NULL);
INSERT INTO works_at (employee_id, branch_id, start_date, end_date) VALUES (3, 3, '2022-06-10', NULL);
INSERT INTO works_at (employee_id, branch_id, start_date, end_date) VALUES (4, 4, '2024-03-05', NULL);
INSERT INTO works_at (employee_id, branch_id, start_date, end_date) VALUES (5, 5, '2021-11-20', NULL);

--management
INSERT INTO management (employee, branch) VALUES (1, 1);
INSERT INTO management (employee, branch) VALUES (2, 2);
INSERT INTO management (employee, branch) VALUES (3, 3);
INSERT INTO management (employee, branch) VALUES (4, 4);
INSERT INTO management (employee, branch) VALUES (5, 5);

--games at branches
INSERT INTO games_at_branches (game, branch) VALUES (1, 1);
INSERT INTO games_at_branches (game, branch) VALUES (2, 2);
INSERT INTO games_at_branches (game, branch) VALUES (3, 3);
INSERT INTO games_at_branches (game, branch) VALUES (4, 4);
INSERT INTO games_at_branches (game, branch) VALUES (5, 5);

--show offerings
INSERT INTO show_offerings (showroom, show_id, date) VALUES (2, 1, '2026-04-10 02:00:00+00');
INSERT INTO show_offerings (showroom, show_id, date) VALUES (2, 2, '2026-04-11 02:00:00+00');
INSERT INTO show_offerings (showroom, show_id, date) VALUES (2, 5, '2026-04-14 02:00:00+00');
INSERT INTO show_offerings (showroom, show_id, date) VALUES (5, 3, '2026-04-12 03:00:00+00');
INSERT INTO show_offerings (showroom, show_id, date) VALUES (5, 4, '2026-04-13 03:00:00+00');

--cocktail offerings
INSERT INTO cocktail_offerings (offering_id, bar_id, drink_id, price) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 14);
INSERT INTO cocktail_offerings (offering_id, bar_id, drink_id, price) OVERRIDING SYSTEM VALUE VALUES (2, 1, 2, 12);
INSERT INTO cocktail_offerings (offering_id, bar_id, drink_id, price) OVERRIDING SYSTEM VALUE VALUES (3, 4, 3, 11.5);
INSERT INTO cocktail_offerings (offering_id, bar_id, drink_id, price) OVERRIDING SYSTEM VALUE VALUES (4, 4, 4, 13);
INSERT INTO cocktail_offerings (offering_id, bar_id, drink_id, price) OVERRIDING SYSTEM VALUE VALUES (5, 1, 5, 12.5);

--gameplay 
INSERT INTO gameplay (customer, game, time_played, money_won) VALUES (1, 1, '2026-04-01 20:15:00+00', 50);
INSERT INTO gameplay (customer, game, time_played, money_won) VALUES (2, 2, '2026-04-02 21:05:00+00', 0);
INSERT INTO gameplay (customer, game, time_played, money_won) VALUES (3, 3, '2026-04-03 19:42:00+00', 10);
INSERT INTO gameplay (customer, game, time_played, money_won) VALUES (4, 4, '2026-04-04 23:10:00+00', 200);
INSERT INTO gameplay (customer, game, time_played, money_won) VALUES (5, 5, '2026-04-05 18:30:00+00', 0);

--cocktail purchases
INSERT INTO cocktail_purchases (customer, offering_id, date) VALUES (1, 1, '2026-04-01 20:45:00+00');
INSERT INTO cocktail_purchases (customer, offering_id, date) VALUES (2, 2, '2026-04-02 21:20:00+00');
INSERT INTO cocktail_purchases (customer, offering_id, date) VALUES (3, 3, '2026-04-03 20:05:00+00');
INSERT INTO cocktail_purchases (customer, offering_id, date) VALUES (4, 4, '2026-04-04 23:25:00+00');
INSERT INTO cocktail_purchases (customer, offering_id, date) VALUES (5, 5, '2026-04-05 18:55:00+00');