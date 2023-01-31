import "./App.css"
import {Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import Navigate from "./components/Navigate.jsx";

export default function App() {
  return <div>
    <Navigate/>
    <Routes>
      <Route exact path="/" element={ <Home/> } />
    </Routes>
  </div>
}
