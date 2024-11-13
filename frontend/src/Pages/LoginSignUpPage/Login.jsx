import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './LoginSignup.css'; // Make sure this points to your CSS file

const Login = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/signup"); // Redirect to Sign Up page
  };

  const handleLoginClick = () => {
    navigate("/Home");
  }

  useEffect(() => {
    document.body.className = "signup-body";
    return () => {
      document.body.className = "default-body";
    };
  }, []);

  return (
    <div class ="login-main-container">
    <header class ="loginheader">
        <button class="close-button">&times;</button>  
        <h1 class="headerlogin">Login</h1>
        <button onClick={handleSignUpClick} className="SignUP">Sign Up</button>
    </header>
    
    <div class="Login-container">
        <form class="Login-form">       
            <input type="tel" placeholder="Mobile Number" class="input-field"></input>
            <input type="password" placeholder="Password" class="input-field"></input>   
        <button class="Login-btn" onClick={handleLoginClick}>Login</button>
        <a href="/forgot-password" className="forgot-password-link">Forgot your password?</a>
        </form>

    </div>
    </div>
  );
};

export default Login;
