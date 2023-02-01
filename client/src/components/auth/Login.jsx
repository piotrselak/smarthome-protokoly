import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useCookies} from "react-cookie";


export default function Login() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies();

    const onSubmit = async data => {
        const res = await axios
            .post("http://localhost:10001/login", data)
            .catch(err => console.log(err))
        if (res.status !== 200) return
        setCookie("token", res.data.token)
        console.log(res.data)
        localStorage.setItem('room', res.data.room);
        navigate("/")
    };

    return <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Login</h2><br/>

        <label>Name</label><br/>
        <input {...register("name", { required: true })} />
        <br/>

        <label>Password</label><br/>
        <input type="password" {...register("password", { required: true })} />
        <br/>

        <input type="submit" />
    </form>
}