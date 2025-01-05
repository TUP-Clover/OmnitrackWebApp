import React, { useState } from 'react';
import './guide.css';
import { useNavigate } from "react-router-dom";
import firstStep from "./images/1st.png"
import secondStep from "./images/2nd.png"
import thirdStep from "./images/3rd.png"
import fourthStep from "./images/4th.png"
import fifthStep from "./images/5th.png"
import sixthStep from "./images/6th.png"
import seventhStep from "./images/7th.png"
import eightStep from "./images/8th.png"
import ninethStep from "./images/9th.png"
import tenthStep from "./images/10th.png"
import eleventhStep from "./images/11th.png"


const Guide = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide
  const totalSlides = 12; // Total number of slides

  const handleBackClick = () => {
    navigate("/Settings");
  };

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    document.getElementById(`slide-${(currentSlide + 1) % totalSlides}`).checked = true;
  };

  const goToPreviousSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
    document.getElementById(`slide-${(currentSlide - 1 + totalSlides) % totalSlides}`).checked = true;
  };

  return (
    <div className="slider-component">
      <form className="carousel-form">
        <div className="guide-back-btn" onClick={handleBackClick}>
          <span className="material-symbols-outlined">arrow_back</span>
        </div>

        {/* Radio Buttons */}
        <input type="radio" className="carousel-input" name="fancy" id="slide-0" defaultChecked />
        <input type="radio" className="carousel-input" name="fancy" id="slide-1" />
        <input type="radio" className="carousel-input" name="fancy" id="slide-2" />
        <input type="radio" className="carousel-input" name="fancy" id="slide-3" />
        <input type="radio" className="carousel-input" name="fancy" id="slide-4" />
        <input type="radio" className="carousel-input" name="fancy" id="slide-5" />
        <input type="radio" className="carousel-input" name="fancy" id="slide-6" />
        <input type="radio" className="carousel-input" name="fancy" id="slide-7" />
        <input type="radio" className="carousel-input" name="fancy" id="slide-8" />
        <input type="radio" className="carousel-input" name="fancy" id="slide-9" />
        <input type="radio" className="carousel-input" name="fancy" id="slide-10" />
        <input type="radio" className="carousel-input" name="fancy" id="slide-11" />




        {/* Slides */}
        <div className="slide" onClick={() => document.getElementById('slide-0').checked = true}>
          <div className="intro-guide">
            <p>Welcome To TrackMoto</p>
          </div>
          <div className="guide-content">
            <div className="image-div-guide">
              <img class="guide" src={firstStep} alt="Guide"></img>
            </div>
            <div className="guide-desc">
              <p>Welcome to TrackMoto Web Application. The first thing you need to know is the navigation bar
                located on the lower part of the web app. This Navigation bar has 3 buttons which are the <span>"Home"</span>, <span>"Add Device"</span>, and <span>" Settings"</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="slide" onClick={() => document.getElementById('slide-1').checked = true}>
            <div className="intro-guide">
              <p>Navigation Bar</p>
            </div>
            <div className="guide-content">
              <div className="image-div-guide">
                <img class="guide" src={secondStep} alt="Guide"></img>
              </div>
              <div className="guide-desc">
                <p>In the figure above you will see a red arrow pointing the <span>"Add Device"</span> This
                button will let you add your TrackMoto Device.
                </p>
              </div>
            </div>
        </div>

        <div className="slide" onClick={() => document.getElementById('slide-2').checked = true}>
            <div className="intro-guide">
              <p>Add Device</p>
            </div>
            <div className="guide-content">
              <div className="image-div-guide">
                <img class="guide" src={thirdStep} alt="Guide"></img>
              </div>
              <div className="guide-desc">
                <p>To Add your device you have to input your TrackMoto Device Code to start on tracking.
                </p>
              </div>
            </div>
        </div>
        <div className="slide" onClick={() => document.getElementById('slide-3').checked = true}>
            <div className="intro-guide">
              <p>Added Device</p>
            </div>
            <div className="guide-content">
              <div className="image-div-guide">
                <img class="guide" src={fourthStep} alt="Guide"></img>
              </div>
              <div className="guide-desc">
                <p>After Successfully adding your TrackMoto Device, You may now check your device location in the map.
                </p>
              </div>
            </div>
        </div>
        <div className="slide" onClick={() => document.getElementById('slide-4').checked = true}>
            <div className="intro-guide">
              <p>Device Details</p>
            </div>
            <div className="guide-content">
              <div className="image-small-guide">
                <img class="guide" src={fifthStep} alt="Guide"></img>
              </div>
              <div className="guide-desc">
                <p>In your Device card you will see your <span>Device Name</span>, <span>Device Model</span>, <span>Device Location</span>, and <span>Device Distance</span>.
                </p>
              </div>
            </div>
        </div>
        <div className="slide" onClick={() => document.getElementById('slide-5').checked = true}>
            <div className="intro-guide">
              <p>Tracking your device</p>
            </div>
            <div className="guide-content">
              <div className="image-div-guide">
                <img class="guide" src={sixthStep} alt="Guide"></img>
              </div>
              <div className="guide-desc">
                <p>In the device card, the first arrow shows a <span>"Track"</span> button that will direct you to the device location.
                the next arrow pointing to a colored oval shape is your <span>device color indicator</span>.
                </p>
              </div>
            </div>
        </div>
        <div className="slide" onClick={() => document.getElementById('slide-6').checked = true}>
            <div className="intro-guide">
              <p>Settings</p>
            </div>
            <div className="guide-content">
              <div className="image-div-guide">
                <img class="guide" src={seventhStep} alt="Guide"></img>
              </div>
              <div className="guide-desc">
                <p>In the Settings page there's several options; <span>View Profile</span>, <span>Manage Devices</span>, <span>Change Password</span>, <span>Guides</span>,
                and <span>Logout</span>.
                </p>
              </div>
            </div>
        </div>
        <div className="slide" onClick={() => document.getElementById('slide-7').checked = true}>
            <div className="intro-guide">
              <p>Profile</p>
            </div>
            <div className="guide-content">
              <div className="image-div-guide">
                <img class="guide" src={eightStep} alt="Guide"></img>
              </div>
              <div className="guide-desc">
                <p>In Profile Page, there's an option for <span>Edit Image</span> and <span>Remove Button</span>. You may also
                edit your Name, Mobile Number, and Email by tapping the <span>Edit icon</span>.
                </p>
              </div>
            </div>
        </div>
        <div className="slide" onClick={() => document.getElementById('slide-8').checked = true}>
            <div className="intro-guide">
              <p>Manage Devices</p>
            </div>
            <div className="guide-content">
              <div className="image-div-guide">
                <img class="guide" src={ninethStep} alt="Guide"></img>
              </div>
              <div className="guide-desc">
                <p>In Manage Devices Page, this is where your devices can be modify. On the upper right of the device
                  card is an <span>Edit Button</span> while on the lower right is the <span>Remove Button</span> and lastly
                  besides of the remove button is the <span>Change Color button</span> for the device marker.
                </p>
              </div>
            </div>
        </div>
        <div className="slide" onClick={() => document.getElementById('slide-9').checked = true}>
            <div className="intro-guide">
              <p>Change Password</p>
            </div>
            <div className="guide-content">
              <div className="image-div-guide">
                <img class="guide" src={tenthStep} alt="Guide"></img>
              </div>
              <div className="guide-desc">
                <p>For the <span>Change Password</span> option, you have to input your email and verify it using
                the <span>Verify Button</span> and an OTP verification will be sent to your email. After completing 
                the verification you may now change your password. 
                </p>
              </div>
            </div>
        </div>
        <div className="slide" onClick={() => document.getElementById('slide-10').checked = true}>
            <div className="intro-guide">
              <p>Tracking History</p>
            </div>
            <div className="guide-content">
              <div className="image-div-guide">
                <img class="guide" src={eleventhStep} alt="Guide"></img>
              </div>
              <div className="guide-desc">
                <p>In the home page upper left you will see a <span>Hamburger Button</span> that will be 
                a function for monitoring or checking your device tracking history.
                </p>
              </div>
            </div>
        </div>
        <div className="slide" onClick={() => document.getElementById('slide-11').checked = true}>
          &#9830; Red
        </div>

        {/* Navigation Buttons */}
        <button type="button" className="nav-button prev" onClick={goToPreviousSlide}>
          <span class="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <button type="button" className="nav-button next" onClick={goToNextSlide}>
          <span class="material-symbols-outlined">arrow_forward_ios</span>
        </button>

        <div className="keys">Use left and right keys to navigate</div>
      </form>
    </div>
  );
};

export default Guide;
