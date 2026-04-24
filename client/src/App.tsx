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
  const [employment, setEmployment] = useState<any[]>([]);
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

async function fetchEmployment() {
  if (employment.length > 0) {
    setEmployment([]);
    return;
  }

  const res = await fetch(`${API}/employment`);
  const data = await res.json();
  setEmployment(data.data || []);
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
        {employees.length >0  ? "Hide Employees" : "Load Employees"}
      </button>
      <button onClick={fetchCustomers}>
        {customers.length > 0 ?"Hide Customers" : "Load Customers"}
      </button>
      <button onClick={fetchEmployment}>
        {employment.length >0 ? "Hide Employment" : "Load employment"}</button>

      <h3>Branches</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {branches.map((branch) => (
        <li key={branch.branch_id}>
          {branch.city}, {branch.state}
        </li>
        ))}
      </ul>

      <h3>Employees</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {employees.map((emp) => (
          <li key={emp.employee_id}>
            {emp.persons?.name_first} {emp.persons?.name_last} — {emp.position}
          </li>
        ))}
      </ul>

      <h3>Customers</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {customers.map((cust) => (
        <li key={cust.customer_id} style={{ marginBottom: "10px" }}>
          {cust.persons?.name_first} {cust.persons?.name_last} — Credit:{" "}
          {cust.credit}
        </li>
        ))}
      </ul>

      <h3>Employment</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {employment.map((emp) => (
          <li key={emp.employee_id}>
            Employee #{emp.employee_id} — {emp.position}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;