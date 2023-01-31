import "./auth.css"
import Login from "./Login.jsx";
import Register from "./Register.jsx";

export default function Auth() {
    return <div className="forms">
        <Login/>
        <div className="break"></div>
        <Register/>
    </div>
}