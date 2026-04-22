--1: who has that employee id?
SELECT employee_id, branch_id
FROM management
SELECT e.employee_id, 
       p.name_first,
       p.name_last
FROM employees As e
JOIN persons AS p
  ON e.employee_id = p.person_id
ORDER BY e.employee_id;ORDER BY employee_id;

--2:what branch do they work at and how long have they worked here
SELECT branch_id, since
FROM works_atSELECT b.branch_id, 
       w.since,
       e.employee_id,
       p.name_first,
       p.name_last,
       b.city,
       b.state
FROM works_at As w
JOIN employees AS e ON w.employee_id = e.employee_id
JOIN persons AS p ON e.employee_id = p.person_id
JOIN branches AS b ON w.branch_id = b.branch_id
ORDER BY b.branch_id, e.employee_id;

--3:what are the price per game and how many customers played the game
SELECT g.price_per_play,
       g.game_id,
       g.name,
       COUNT(DISTINCT gp.customer_id) AS customer_played
FROM games AS g 
LEFT join gameplay AS gp 
    ON g.game_id = gp.game_id
GROUP BY g.game_id, g.name, g.price_per_play
ORDER BY g.game_id;

--4: what drinks do we offer to the customer
SELECT co.offering_id,
       co.bar_id,
       c.name  AS cocktail_name,
       co.price
FROM cocktail_offerings AS co
JOIN cocktails          AS c
  ON co.drink_id = c.drink_id
ORDER BY co.bar_id, c.name;

--5: How many people purchase each cocktail drink
SELECT c.name AS cocktail_name,
       COUNT(DISTINCT cp.customer_id) AS customers_purchased
FROM cocktail_purchases AS cp
JOIN cocktail_offerings AS co
  ON cp.offering_id = co.offering_id
JOIN cocktails AS c
  ON co.drink_id = c.drink_id
GROUP BY c.name
ORDER BY customers_purchased DESC, c.name;

--6: what branch has the most games won by customer
SELECT b.branch_id,
       b.city,
       b.state,
       SUM(gp.money_won) AS total_money_won
FROM branches AS b
JOIN games_at_branches AS gb
  ON b.branch_id = gb.branch_id
JOIN gameplay AS gp
  ON gb.game_id = gp.game_id
GROUP BY b.branch_id, b.city, b.state
ORDER BY total_money_won DESC, b.branch_id;

--7: whose purchased this COCKtail in this bar
SELECT cp.customer_id,
       p.name_first,
       p.name_last,
       co.bar_id,
       c.name AS cocktail_name
FROM cocktail_purchases AS cp
JOIN cocktail_offerings AS co
  ON cp.offering_id = co.offering_id
JOIN cocktails AS c
  ON co.drink_id = c.drink_id
JOIN persons AS p
  ON cp.customer_id = p.person_id
WHERE co.bar_id = ?
  AND c.name = ?
ORDER BY cp.customer_id;

--8: In this city who are the managers 
SELECT m.employee_id,
       p.name_first,
       p.name_last
FROM management AS m
JOIN persons AS p
  ON m.employee_id = p.person_id
JOIN branches AS b
  ON m.branch_id = b.branch_id
WHERE b.city = ?
ORDER BY m.employee_id;

--9: what branches don't have a showroom in this state
SELECT b.branch_id,
       b.city,
       b.state
FROM branches AS b
LEFT JOIN rooms_at_branches AS rb
  ON b.branch_id = rb.branch_id
WHERE rb.room_id IS NULL
  AND b.state = ?
ORDER BY b.branch_id;

--10: how much money did we make in the last month
SELECT SUM(gp.money_won) AS total_money_won
FROM gameplay AS gp
WHERE gp.time_played >= NOW() - INTERVAL '1 month'
GROUP BY gp.customer_id, p.name_first, p.name_last
ORDER BY total_money_won DESC, gp.customer_id;

--11: The police need these people first and last name that played this game at this branch
SELECT p.name_first,
       p.name_last,
FROM gameplay AS gp
JOIN persons AS p ON gp.customer_id = p.person_id
JOIN games AS g ON gp.game_id = g.game_id
JOIN games_at_branches AS gb
  ON g.game_id = gb.game_id
JOIN branches AS b ON gb.branch_id = b.branch_id
WHERE b.state = ?
  AND b.city = ?
  AND g.name = ?
ORDER BY p.name_first, p.name_last;

--12: show me the dates of the shows and and what rooms the show is in 
SELECT so.date,
       so.showroom_id,
       s.name
FROM show_offerings AS so
JOIN shows AS s
  ON so.show_id = s.show_id
ORDER BY so.date, so.showroom_id;

--13: What is the game that has been played the most in what state and city
SELECT g.name,
       b.state,
       b.city,
       COUNT() AS times_played
FROM gameplay AS gp
JOIN games AS g
  ON gp.game_id = g.game_id
JOIN games_at_branches AS gb
  ON g.game_id = gb.game_id
JOIN branches AS b
  ON gb.branch_id = b.branch_id
GROUP BY gp.game_id, g.name
ORDER BY times_played DESC, g.name
LIMIT 1;

--14: who won the most money
SELECT gp.customer_id,
       p.name_first,
       p.name_last,
       SUM(gp.money_won) AS total_money_won
FROM gameplay AS gp
JOIN persons AS p
  ON gp.customer_id = p.person_id
GROUP BY gp.customer_id, p.name_first, p.name_last
ORDER BY total_money_won DESC, gp.customer_id;

--15: what branch do they work at and how long have they worked here
SELECT e.employee_id,
       p.name_first,
       p.name_last,
       b.city,
       b.state,
       w.since,
       w.to
FROM employees AS e
JOIN persons AS p ON e.employee_id = p.person_id
JOIN works_at AS w ON e.employee_id = w.employee_id
JOIN branches AS b ON w.branch_id = b.branch_id
ORDER BY e.employee_id;

--16: what is the person email who has purchase this cocktail and play this game.
SELECT p.email
FROM persons AS p
JOIN customers AS c ON p.person_id = c.customer_id
JOIN cocktail_purchases AS cp ON c.customer_id = cp.customer_id
JOIN cocktail_offerings AS co ON cp.offering_id = co.offering_id
JOIN cocktails AS c ON co.drink_id = c.drink_id
JOIN gameplay AS gp ON c.customer_id = gp.customer_id
JOIN games AS g ON gp.game_id = g.game_id
WHERE c.name = ?
  AND g.name = ?


