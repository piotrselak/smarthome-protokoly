import {useNavigate} from "react-router-dom";

export default function Navigate() {
    const navigate = useNavigate()

    return <div>
        <button onClick={() => {
            navigate("/")
        }}>Home</button>
        <button onClick={() => {
            navigate("/login")
        }}>Login</button>
        <button onClick={() => {
            navigate("/room")
        }}>Room</button>
        <button onClick={() => {
            navigate("/chat")
        }}>Chat</button>
    </div>
}
