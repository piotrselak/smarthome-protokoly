import "./App.css"
import {Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import Navigate from "./components/Navigate.jsx";
import Auth from "./components/auth/Auth.jsx";
import Room from "./components/room/Room.jsx";

export default function App() {
  return <div>
    <Navigate/>
    <Routes>
      <Route exact path="/" element={ <Home/> } />
      <Route exact path="/auth" element={ <Auth/> } />
      <Route exact path="/room" element={ <Room/> } />
    </Routes>
  </div>
}
