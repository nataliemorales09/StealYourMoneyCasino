import { useEffect, useState } from "react";
import "./App.css";

type Branch = {
  branch_id: number;
  city: string;
  state: string;
};

function App() {
  const [health, setHealth] = useState("Loading...");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [cocktails, setCocktails] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [error, setError] = useState("");

  const API = "http://127.0.0.1:3000";

  useEffect(() => {
    fetchHealth();
  }, []);

  async function fetchHealth() {
    const res = await fetch(`${API}/health`);
    const data = await res.json();
    setHealth(JSON.stringify(data));
  }

  async function fetchBranches() {
    // if already showing → hide it
    if (branches.length > 0) {
      setBranches([]);
      return;
    }
  
    // otherwise fetch and show
    const res = await fetch(`${API}/branches`);
    const data = await res.json();
    setBranches(data.data || []);
  }

  async function fetchEmployees() {
    if (employees.length > 0) {
      setEmployees([]);
      return;
    }
  
    const res = await fetch(`${API}/person/employee`);
    const data = await res.json();
    setEmployees(data.data || []);
  }

  async function fetchCustomers() {
  if (customers.length > 0) {
    setCustomers([]);
    return;
  }

  const res = await fetch(`${API}/person/customer`);
  const data = await res.json();
  setCustomers(data.data || []);
}


async function fetchCocktails() {
  if (cocktails.length > 0) {
    setCocktails([]);
    return;
  }

  const res = await fetch(`${API}/cocktails`);
  const data = await res.json();
  setCocktails(data.data || []);
}
async function fetchGames() {
  if (games.length > 0) {
    setGames([]);
    return;
  }

  const res = await fetch(`${API}/games`);
  const data = await res.json();
  setGames(data.data || []);
}

  return (
    <div style={{ padding: "2rem" }}>
      <h1>StealYourMoney Casino</h1>

      <h2>Backend Health</h2>
      <p>{health}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

    
      <hr />

      <h2>API Routes</h2>
      <button onClick={fetchBranches}>
          {branches.length > 0 ? "Hide Branches" : "Load Branches"}
      </button>
      <button onClick={fetchEmployees}>
        {employees.length >0  ? "Hide Casino Staff" : "Load Casino Staff"}
      </button>
      <button onClick={fetchCustomers}>
        {customers.length > 0 ?"Hide Customers" : "Load Customers"}
      </button>
      
      <button onClick={fetchCocktails}>
        {cocktails.length > 0 ? "Hide Cocktails" : "Load Cocktails"}
      </button>
      <button onClick={fetchGames}>
        {games.length > 0 ? "Hide Games" : "Load Games"}
      </button>

      {branches.length >0 && (
      <>
      <h3>Branches</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {branches.map((branch) => (
        <li key={branch.branch_id}>
          {branch.city}, {branch.state}
        </li>
        ))}
      </ul>
      </>
    )}
      {employees.length >0 && (
        <>
      <h3> Casino Staff</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {employees.map((emp) => (
          <li key={emp.employee_id}>
            <strong>
              {emp.persons?.name_first} {emp.persons?.name_last}
            </strong>
            <br />
            Position: {emp.position}
            <br />
            Branch ID:{" "}
            {emp.works_at?.length > 0
              ? emp.works_at.map((w: any) => w.branch_id).join(", ")
              : "No branch assigned"}
          </li>
        ))}
      </ul>
      </>
      )}

      {customers.length >0 && (
        <>
          <h3>Customers</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {customers.map((cust) => (
            <li key={cust.customer_id} style={{ marginBottom: "10px" }}>
              {cust.persons?.name_first} {cust.persons?.name_last} — Credit:{" "}
              {cust.credit}
            </li>
            ))}
          </ul>
        </>
      )}

      {cocktails.length > 0 && (
        <>
        <h3>Cocktails</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {cocktails.map((drink) => (
            <li key={drink.drink_id}>
            {drink.name}
            </li>
          ))}
        </ul>
      </>
    )}
  {games.length > 0 && (
  <>
    <h3>Games</h3>
    <ul style={{ listStyle: "none", padding: 0 }}>
      {games.map((game) => (
        <li key={game.game_id}>
          {game.name} — ${game.price_per_play}
        </li>
      ))}
    </ul>
  </>
  )}

    </div>
  );
}

export default App;