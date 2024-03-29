import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Admin() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies();
    const [users, setUsers] = useState([])

    const [change, setChange] = useState(0)
    const [phrase, setPhrase] = useState('')

    useEffect(() => {
        axios
            .get(`http://localhost:10001/user/`, {
                headers: {
                    "x-access-token": cookies.token
                }
            })
            .then(res => {
                setUsers(res.data)
            })
            .catch(err => {
                if (err.response.status !== 404) {
                    alert(err)
                    navigate("/")
                }
            })
    }, [change])

    function search() {
        axios
            .get(`http://localhost:10001/user?phrase=${phrase}`, {
                headers: {
                    "x-access-token": cookies.token
                }
            })
            .then(res => {
                setUsers(res.data)
            })
            .catch(err => {
                if (err.response.status !== 404) {
                    alert(err)
                    navigate("/")
                }
            })
    }

    function deleteUser(user) {
        return () => axios
            .delete(`http://localhost:10001/user/${user._id}`, {
                headers: {
                    "x-access-token": cookies.token
                }
            })
            .then(() => {
                if (user.name === localStorage.getItem('name')){
                    removeCookie("token")
                    navigate("/")
                }
                setChange(change+1)
            })
            .catch(err => {
                alert(err)
            })
    }

    function updateUser(user) {
        return () => {
            const newName = prompt("New name:", user.name)
            const newRoom = prompt("New room:", user.room)
            const newAdmin = prompt("Admin (true/false):", user.admin)
            axios
                .put(`http://localhost:10001/user/${user._id}`, {
                    name: newName, room: newRoom, admin: newAdmin
                }, {
                    headers: {
                        "x-access-token": cookies.token
                    }
                })
                .then((res) => {
                    console.log(res)
                    setChange(change+1)
                })
                .catch(err => {
                    alert(err)
                })
        }
    }

    return <div>
        <label>Search</label><input value={phrase} onChange={(e) => setPhrase(e.target.value)}/>
        <button onClick={search}>Search</button>
        <ul>
            {users.map(user => {
                return <li key={user._id}>
                    <span>Name: {user.name}  Room: {user.room}  Admin: {`${user.admin}`}</span>
                    <button onClick={deleteUser(user)}>X</button>
                    <button onClick={updateUser(user)}>Edit</button>
                </li>
            })}
        </ul>
    </div>
}