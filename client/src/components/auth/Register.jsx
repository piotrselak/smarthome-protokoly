import {useForm} from "react-hook-form";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";

export default function Register() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate()
    const [cookies, setCookie, removeCookie] = useCookies();

    const onSubmit = async data => {
        console.log(data)
        const res = await axios
            .post("http://localhost:10001/register", data)
        if (res.status !== 201) {
            alert(res.statusText)
            return
        }
        setCookie("token", res.data.token)
        localStorage.setItem('room', res.data.room);
        localStorage.setItem('name', res.data.name);
        navigate("/")
    };

    return <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Register</h2><br/>

        <label>Name</label><br/>
        <input {...register("name", { required: true })} />
        <br/>

        <label>Password</label><br/>
        <input type="password" {...register("password", { required: true })} />
        <br/>

        <label>Room</label><br/>
        <input {...register("room", { required: true })} />
        <br/>

        <label>Admin</label><br/>
        <label>Yes</label>
        <input type="radio" value="true" {...register("admin", { required: true })} />
        <label>No</label>
        <input type="radio" value="false" {...register("admin", { required: true })} />
        <br/>

        <input type="submit" />
    </form>
}