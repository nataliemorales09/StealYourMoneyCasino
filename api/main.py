from fastapi import FastAPI
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

conn = psycopg2.connect(os.getenv("SUPABASE_URL"))

# Helper function to run queries
def run_query(query, params=None):
    cur = conn.cursor()
    cur.execute(query, params)

    try:
        result = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        data = [dict(zip(columns, row)) for row in result]
    except:
        data = []

    conn.commit()
    cur.close()
    return data


# -----------------------------
# ROUTES (YOUR QUERIES)
# -----------------------------

# 1. Get all employees
@app.get("/employees")
def get_employees():
    query = """
    SELECT e.employee_id, p.name_first, p.name_last
    FROM employees e
    JOIN persons p ON e.employee_id = p.person_id
    ORDER BY e.employee_id;
    """
    return run_query(query)


# 2. Employee work history
@app.get("/employees/work-history")
def work_history():
    query = """
    SELECT e.employee_id, p.name_first, p.name_last,
           b.city, b.state, w.since, w.to
    FROM employees e
    JOIN persons p ON e.employee_id = p.person_id
    JOIN works_at w ON e.employee_id = w.employee_id
    JOIN branches b ON w.branch_id = b.branch_id;
    """
    return run_query(query)


# 3. Game popularity
@app.get("/games/popularity")
def games_popularity():
    query = """
    SELECT g.price_per_play, g.game_id, g.name,
           COUNT(DISTINCT gp.customer_id) AS customer_played
    FROM games g
    LEFT JOIN gameplay gp ON g.game_id = gp.game_id
    GROUP BY g.game_id, g.name, g.price_per_play
    ORDER BY g.game_id;
    """
    return run_query(query)


# 4. Cocktail offerings
@app.get("/cocktails")
def cocktails():
    query = """
    SELECT co.offering_id, co.bar_id, c.name, co.price
    FROM cocktail_offerings co
    JOIN cocktails c ON co.drink_id = c.drink_id;
    """
    return run_query(query)


# 5. Cocktail popularity
@app.get("/cocktails/popularity")
def cocktail_popularity():
    query = """
    SELECT c.name,
           COUNT(DISTINCT cp.customer_id) AS customers_purchased
    FROM cocktail_purchases cp
    JOIN cocktail_offerings co ON cp.offering_id = co.offering_id
    JOIN cocktails c ON co.drink_id = c.drink_id
    GROUP BY c.name
    ORDER BY customers_purchased DESC;
    """
    return run_query(query)


# 6. Top performing branches
@app.get("/branches/top")
def top_branches():
    query = """
    SELECT b.branch_id, b.city, b.state,
           SUM(gp.money_won) AS total_money_won
    FROM branches b
    JOIN games_at_branches gb ON b.branch_id = gb.branch_id
    JOIN gameplay gp ON gb.game_id = gp.game_id
    GROUP BY b.branch_id, b.city, b.state
    ORDER BY total_money_won DESC;
    """
    return run_query(query)


# 7. Customers who bought a cocktail at a bar
@app.get("/cocktails/by-bar")
def cocktail_by_bar(bar_id: int, drink_name: str):
    query = """
    SELECT cp.customer_id, p.name_first, p.name_last
    FROM cocktail_purchases cp
    JOIN cocktail_offerings co ON cp.offering_id = co.offering_id
    JOIN cocktails c ON co.drink_id = c.drink_id
    JOIN persons p ON cp.customer_id = p.person_id
    WHERE co.bar_id = %s AND c.name = %s;
    """
    return run_query(query, (bar_id, drink_name))


# 8. Managers in a city
@app.get("/managers/by-city")
def managers(city: str):
    query = """
    SELECT m.employee_id, p.name_first, p.name_last
    FROM management m
    JOIN persons p ON m.employee_id = p.person_id
    JOIN branches b ON m.branch_id = b.branch_id
    WHERE b.city = %s;
    """
    return run_query(query, (city,))


# 9. Branches without showroom
@app.get("/branches/no-showroom")
def no_showroom(state: str):
    query = """
    SELECT b.branch_id, b.city, b.state
    FROM branches b
    LEFT JOIN rooms_at_branches rb ON b.branch_id = rb.branch_id
    WHERE rb.room_id IS NULL AND b.state = %s;
    """
    return run_query(query, (state,))


# 10. Top customer winnings
@app.get("/customers/top-winner")
def top_winner():
    query = """
    SELECT gp.customer_id, p.name_first, p.name_last,
           SUM(gp.money_won) AS total_money_won
    FROM gameplay gp
    JOIN persons p ON gp.customer_id = p.person_id
    GROUP BY gp.customer_id, p.name_first, p.name_last
    ORDER BY total_money_won DESC;
    """
    return run_query(query)