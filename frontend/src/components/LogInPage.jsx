import { useState } from "react";

function LogInPage({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const checkAccount = async () => {
    if (!email || !password) {
      setMessage("Заполните все поля!");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setEmail("");
        setPassword("");
        setPage("main");
        setMessage("");
      } else {
        setMessage("Неправильные данные для входа");
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
      <div className="login-container">
        <h2>Войдите в аккаунт</h2>

        <div className="input-container">
          <div className="input-title">
            <h3>Email</h3>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="input-title">
            <h3>Password</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        </div>

        <button type="submit">Войти в аккаунт</button>

        <p>
          Нет учетной записи?
          <span onClick={() => setPage("register")} className="link">
            {" "}
            Зарегистрироваться
          </span>
        </p>

        <p className="erorr">{message}</p>
      </div>
    </form>
  );
}

export default LogInPage;
