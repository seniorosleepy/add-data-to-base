import { useState } from "react";

function RegisterPage({ setPage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const createUser = async () => {
    if (!email || !username || !password) {
      setMessage("Заполните все поля!");
      return;
    }

    if (password.length < 8) {
      setMessage("Пароль должен быть не менее 8 символов");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (response.ok) {
        alert("User created successfully!");
        setUsername("");
        setPassword("");
        setEmail("");
        setPage("main");
        setMessage("")
      } else {
        const text = await response.text();
        setMessage("Error: " + text);
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        checkAccount();
      }}
    >
      <div className="register-container">
        <h2>Создайте аккаунт</h2>
        <div className="input-container">
          <div>
            <h3>Email</h3>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <h3>Username</h3>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <h3>Password</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        </div>
        <button onClick={createUser} className="loginButton">
          Создать учетную запись
        </button>
        <p>
          Уже есть аккаунт? 
          <span onClick={() => setPage("login")} className="link"> Войти</span>
        </p>
        <p className="erorr">{message}</p>
      </div>
    </form>
  );
}

export default RegisterPage;
