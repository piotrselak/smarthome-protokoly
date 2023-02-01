import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Navigate() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  return (
    <div>
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        Home
      </button>
      {!cookies.token && (
        <button
          onClick={() => {
            navigate("/auth");
          }}
        >
          Authorize
        </button>
      )}
      {cookies.token && (
        <button
          onClick={() => {
            navigate("/room");
          }}
        >
          Room
        </button>
      )}
      {cookies.token && (
        <button
          onClick={() => {
            navigate("/chat");
          }}
        >
          Chat
        </button>
      )}
      {cookies.token && (
        <button
          onClick={() => {
            navigate("/admin");
          }}
        >
          Admin
        </button>
      )}
      {cookies.token && (
        <button
          onClick={() => {
            removeCookie("token")
            navigate("/");
          }}
        >
          Log out
        </button>
      )}
    </div>
  );
}
