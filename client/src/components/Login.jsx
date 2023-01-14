import axios from "axios";
import { useForm } from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";

export default function Login(props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate()

  const onSubmit = (data) => {
    axios
      .post("http://localhost:3000/auth", { ...data, "perm": 1 }) //perm isnt final
      .then(function (response) {
        props.setLogged(true);
        props.setCookie("user", response.data, {
            path: "/"
        });
        navigate("/")
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("_id", { required: true })} />

      <input type="password" {...register("hash", { required: true })} />

      {errors.exampleRequired && <span>This field is required</span>}

      <input type="submit" />
    </form>
  );
}
