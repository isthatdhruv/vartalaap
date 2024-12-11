import React from "react";
import './Login.css';
import assets from '../../assets/assets';
import { useState } from "react";
import  {signup , login ,resetPass}  from "../../config/firebase";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

const Login = () => {
    const[currentState, setCurrentState] = useState('Sign Up');
    const[userName, setUserName] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[loading, setLoading] = useState(false);

    const onSubmitHandler = (event) => {
        event.preventDefault();
        try {
            if (currentState === 'Sign Up') {
                setLoading(true);
                signup(userName, email, password);
            }
            else{
                setLoading(true);
                login(email, password);
            }
        } catch (error) {
            toast.error(error.message);
            
        }finally{
            setLoading(false);
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
                
                <button onClick={onSubmitHandler} disabled={loading}>{loading ? (<ClipLoader color="white" loading={loading} size={30} margin={5}/>) : (currentState === "Sign Up" ? "Create Account" : "Login")}</button>
                
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
                    {currentState === "Login" ? <p className="login-toggle">Forgot Password ? <span onClick={()=>resetPass(email)}>Reset Pass</span></p>:null}
                    
                    
                </div>
            </form>
        </div>
    )
}
export default Login;