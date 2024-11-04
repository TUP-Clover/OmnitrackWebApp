import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './LoginSignup.css';


const SignUp=()=>{
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/login"); 
    };
   
    useEffect(() => {
        // Change body class on component mount
        document.body.className = "signup-body";

        // Cleanup by resetting the class on component unmount
        return () => {
            document.body.className = "default-body";
        };
    }, []);

    return(
       <div class ="container">
        <header class ="signupheader">
            <button class="close-button">&times;</button>  
            <h1 class="headersignup">Sign Up</h1>
            <button onClick={handleLoginClick} className="login">Login</button>
        </header>
        
        <div class="SignUp-container">
            <form class="signup-form">
                <input type="text" placeholder="Name" class="input-field"></input>
            <div class="input-group">
                <input type="tel" placeholder="Mobile Number" class="input-field"></input>
                <button class="verify-button">Verify</button>
            </div>
            <input type="tel"placeholder="Verification Code" class="input-field"></input>
            <div class ="input-group">
                <input type="password" placeholder="Password" class="input-field"></input>
              
            </div>

            <button class="SignUp" onClick={handleLoginClick}>Sign Up</button>
            </form>

        </div>
        </div>
    )
}

export default SignUp