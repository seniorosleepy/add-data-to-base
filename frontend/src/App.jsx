import { useState } from "react";
import RegisterPage from "./components/RegisterPage";
import LogInPage from "./components/LogInPage";
import MainPage from "./components/MainPage";

function App() {
  const [page, setPage] = useState("login");

  const PAGES = {
    LOGIN: "login",
    REGISTER: "register",
    MAIN: "main",
  }

  if (page === PAGES.LOGIN) return <LogInPage setPage={setPage} />;
  if (page === PAGES.REGISTER) return <RegisterPage setPage={setPage} />;
  if (page === PAGES.MAIN) return <MainPage/>;

  return <div>Unknown Page</div>;
}

export default App;
