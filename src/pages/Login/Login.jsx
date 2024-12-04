import React from "react";
import './Login.css';
import assets from '../../assets/assets';
import { useState } from "react";
import  {signup , login ,resetPass}  from "../../config/firebase";

const Login = () => {
    const[currentState, setCurrentState] = useState('Sign Up');
    const[userName, setUserName] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');

    const onSubmitHandler = (event) => {
        event.preventDefault();
        if (currentState === 'Sign Up') {
            signup(userName, email, password);
        }
        else{
            login(email, password);
        }
    }

    return (
        <div className="login">
            <img src={assets.logo_big} alt="" className="logo" />
            <form onSubmit={onSubmitHandler} className="login-form">
                <h2>{currentState}</h2>
                {currentState==="Sign Up"?<input onChange={(e)=>setUserName(e.target.value)}  value={userName} type="text" placeholder="Username"className="form-input" required/>:null}

                <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder="Email" className="form-input" required/>
                
                <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder="Password" className="form-input" required/>
                
                <button>{currentState === "Sign Up" ? "Create Account":"Login"}</button>
                
                <div className="login-term">
                    <input type="checkbox" name="term" id="term" required/>
                    <p>I agree to the terms of services</p>
                </div>
                
                <div className="login-forgot">
                    {
                        currentState === "Sign Up" ? 
                        <p className="login-toggle">Already have an account? <span onClick={()=>setCurrentState("Login")}>Login</span></p>:
                        <p className="login-toggle">Create an account <span onClick={()=>setCurrentState("Sign Up")}>Click here</span></p>


                    }
                    {currentState === "Login" ? <p className="login-toggle">Forgot Password ? <span onClick={()=>resetPass(email)}>Reset</span></p>:null}
                    
                    
                </div>
            </form>
        </div>
    )
}
export default Login;