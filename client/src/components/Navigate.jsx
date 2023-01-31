import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";

export default function Navigate() {
    const navigate = useNavigate()
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);

    return <div>
        <button onClick={() => {
            navigate("/")
        }}>Home</button>
        {!cookies.token && <button onClick={() => {
            navigate("/auth")
        }}>Authorize</button>}
        <button onClick={() => {
            navigate("/room")
        }}>Room</button>
        <button onClick={() => {
            navigate("/chat")
        }}>Chat</button>
    </div>
}
