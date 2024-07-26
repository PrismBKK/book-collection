import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });

  const navigate =useNavigate();

  const login = async(data) => {
    const result=await axios.post("http://localhost:4001/auth/login",data);
    const token = result.data.token;
    localStorage.setItem("token",token);
    const userDataFromToken=jwtDecode(token);
    setState({...state,user: userDataFromToken});
    navigate("/")
  };
  const register = async(data) => {
    await axios.post("http://localhost:4001/auth/register", data);
    navigate("/login");
  };
  const logout =()=>{  
        localStorage.removeItem("token")
        setState({ ...state, user: null })
      };
    const isAuthenticated = Boolean(localStorage.getItem("token"));

      return (
        <AuthContext.Provider
          value={{ state, login, logout, register, isAuthenticated }}
        >
          {props.children}
        </AuthContext.Provider>);
}

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };