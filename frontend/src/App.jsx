import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const createUser = async () => {
    try {
      const response = await fetch("http://localhost:8080/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, age: parseInt(age, 10) }),
      });

      if (response.ok) {
        alert("User created successfully!");
        setName("");
        setAge("");
        getUsers(); // обновляем список после создания пользователя
      } else {
        const text = await response.text();
        alert("Error: " + text);
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create User</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        style={{ marginRight: "10px" }}
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Age"
        style={{ marginRight: "10px" }}
      />
      <button onClick={createUser}>Create User</button>
    </div>
  );
}

export default App;
