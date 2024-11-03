import React from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import bikeImage from './images/bike.png';
import locationImage from './images/location.png';
import motorbg from './images/motorbg.png';

const WelcomePage1= ()=>{
    const navigate = useNavigate();

   const handleGetStarted = () => {
      navigate('/WelcomePage2');
   }
   return(

    <div class="container">
        <header>
            <h1>Welcome to OmniTrack</h1>
            <p>Track Your Treasures with Ease</p>
            <p>Locate What Matters Most.</p>
        </header>
        
        <div class="image-container">
            <img class="motorbg" src={motorbg} alt= "motorbg"></img>
            <img class="bike" src={bikeImage} alt="Motorbike"></img>
            <img class= "location" src={locationImage} alt="LocationIcon"></img>
        </div>
        

        <button class="start-button" onClick={handleGetStarted}> 
            Get Started</button>
    </div>
  


   )
}

export default WelcomePage1