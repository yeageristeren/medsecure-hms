import {useContext,useState,createContext, useEffect} from 'react'
import { getUser } from '../services/userService'
import { signup } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) return; // 🛑 don't call API without token

      try {
        const user = await getUser();
        setUser(user);
      } catch (err) {
        console.log("Auto login failed");
        Logout(); // clear invalid token
      }
    };

    fetchUser();
  }, []);
            

    const Login = async (userData,navigate) => {
        try{
            localStorage.setItem("token", userData.jwt);
            localStorage.setItem("userId", userData.userId);
            const user = await getUser();
            setUser(user);
            if (user.role === "ADMIN") {
                navigate('/admin');
            } else if (user.role === "DOCTOR") {
                navigate('/doctor');
            } else{
                navigate('/dashboard');
            } 
        } catch (err) {
            console.log("Login failed");
        }
    }

    const Signup = async (userData, navigate) => {
        try{
            const response = await signup(userData);
            localStorage.setItem("token", response.jwt);
            localStorage.setItem("userId", response.userId);
            const user = await getUser();
            setUser(user);
            if (user.role === "ADMIN") {
                navigate('/admin');
            } else if (user.role === "DOCTOR") {
                navigate('/doctor');
            } else{
                navigate('/dashboard');
            }
        } catch (err) {
            console.log("Signup failed");
        }
    }

    const Logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
    }

    return (
        <AuthContext.Provider value={{ user, Login, Logout, Signup }}>
            {children}
        </AuthContext.Provider>
    )
}