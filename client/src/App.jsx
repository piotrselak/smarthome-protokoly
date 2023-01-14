import { useState, useEffect } from "react";
import { useNavigate, BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import {useCookies} from "react-cookie";

function App() {
  const [isLogged, setLogged] = useState(false); // move it to cookie later
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["user"]);

  useEffect(() => {
      if (!isLogged) navigate("login");

  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login setLogged={setLogged} setCookie={setCookie}/>} />
    </Routes>
  );
}

export default App;
