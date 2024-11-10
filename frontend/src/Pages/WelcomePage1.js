import React from "react";
import { useNavigate } from "react-router-dom";
import './Welcomepage.css';
import bikeImage from './images/bike.png';
import locationImage from './images/location.png';
import motorbg from './images/motorbg.png';
import trackicon from './images/motoricon.png';

const WelcomePage1= ()=>{
    const navigate = useNavigate();

   const handleGetStarted = () => {
      navigate('/WelcomePage2');
   }
   return(
    
    <div class="container">
        <div class="desktop-container">
            <header class="welcomepageheader">
            <h1>Welcome to <span class="trackmoto-text">TrackMoto</span></h1>
            <p>Track Your Treasures with Ease</p>
            <p>Locate What Matters Most.</p>
            <button class="start-button-desktop" onClick={handleGetStarted}> 
            Get Started</button>
            <img class="trackicon" src={trackicon} alt= "trackicon"></img>
        </header>
        
        <div class="image-container">
            <img class="motorbg" src={motorbg} alt= "motorbg"></img>
            <img class="bike" src={bikeImage} alt="Motorbike"></img>
            <img class= "location" src={locationImage} alt="LocationIcon"></img>
        </div>
        </div>
        <button class="start-button-mobile" onClick={handleGetStarted}> 
        Get Started</button>

           </div>


   )
}

export default WelcomePage1