import { useState } from "react"
import { useAuth } from "../contexts/authentication";
import { useNavigate } from "react-router-dom";

function LoginPage(){
    const [Password,setPassword]= useState("");
    const [Username,setUsername]=useState("");
    const {login}=useAuth()
    const navigate =useNavigate();

    const handleSubmit=(event)=>{
        event.preventDefault();
        const data={
            username: Username,
            password: Password
        }
        login(data)
    }

    const register=()=>{
        navigate("/register")
    }

    return(
        <div >
            <section>
                <h1 className="text-blue-600">Login Form</h1>
                <button onClick={register}>Resigister</button>
            </section>
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username: </label>
                    <input 
                    id="username"
                    name="username"
                    type="text"
                    placeholder=""
                    onChange={(event) => {
                      setUsername(event.target.value);
                    }}
                    value={Username}
                    />
                </div>
                
                <div>
                    <label>Password: </label>
                <input 
                    id="password"
                    name="password"
                    type="password"
                    placeholder=""
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                    value={Password}
                    />
                </div>

                <div>
                    <button type="submit"> Log in</button>
                </div>
                
            </form>
        </div>
    )
}

export default LoginPage;