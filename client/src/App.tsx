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
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const healthRes = await fetch("http://127.0.0.1:3000/health");
        const healthData = await healthRes.json();
        setHealth(JSON.stringify(healthData));

        const branchesRes = await fetch("http://127.0.0.1:3000/branches");
        const branchesData = await branchesRes.json();
        setBranches(branchesData.data || []);
      } catch (err) {
        setError("Could not connect to backend");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>StealYourMoney Casino</h1>

      <h2>Backend Health</h2>
      <p>{health}</p>

      <h2>Branches</h2>
      {error && <p>{error}</p>}

      {branches.length === 0 ? (
        <p>No branches found.</p>
      ) : (
        <ul>
          {branches.map((branch) => (
            <li key={branch.branch_id}>
              {branch.city}, {branch.state}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;