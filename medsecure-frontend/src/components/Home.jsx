import { use } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar";

function Home(){
    const {user,Login} = useAuth();
    const navigate = useNavigate();

    return (
        <>  <Navbar />
            <h1>{user ? user.username : "Guest"}</h1>
            <button onClick={() => navigate('/')}>Login</button>
        </>
    )
}

export default Home;