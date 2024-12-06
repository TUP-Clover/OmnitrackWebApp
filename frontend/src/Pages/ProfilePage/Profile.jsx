import React from 'react'
import './profile.css';
import profileicon from '../images/profile1.jpg'
import { useNavigate } from "react-router-dom";

import useMediaQuery from '../MonitoringPage/useMediaQuery'; // Assuming you already have this custom hook


const Profile = ({ onBack }) => {
  const navigate = useNavigate();

  const isLargeScreen = useMediaQuery("(min-width: 768px)"); // Check if screen is >= 768px

      // Handle save or back logic
      const handleBackClick = () => {
        // If editing, confirm before leaving
    
        if (isLargeScreen) {
            // For larger screens, use the provided `onBack` function
            if (onBack) {
                onBack();
            }
        } else {
            // For smaller screens, navigate back to the Settings page
            navigate('/Settings');
        }
    };
  return (
    <div className="profile-body">
      <div className="profile-header">
          <div className="profile-back" onClick={handleBackClick}>
            <span class="material-symbols-outlined">arrow_back</span>
          </div>
        <div className="profile-title">
          <p>Profile</p>
        </div>
      </div>
      <div className="profile-profile-card">
        <div className="profile2-picture">
          <img src={profileicon} alt="Profile-Picture" />
        </div>
        <div className="add-image">
          <span class="material-symbols-outlined">add_a_photo</span>
          <button>Add Image</button>
        </div>
      </div>
      <div className="profile2-details">
        <div className="prof-details">
          <div className="name-div">
            <h6>Name</h6>
            <p>Allen Luis, Alvarez</p>
          </div>
          <div className="edit-profile-div">
            <span class="material-symbols-outlined">edit</span>
          </div>
        </div>
        <div className="prof-details">
          <div className="name-div">
            <h6>Number</h6>
            <p>+638529348123</p>
          </div>
          <div className="edit-profile-div">
            <span class="material-symbols-outlined">edit</span>
          </div>
        </div>
        <div className="prof-details">
          <div className="name-div">
            <h6>Email</h6>
            <p>Allen.Alvarez@tup.edu.ph</p>
          </div>
          <div className="edit-profile-div">
            <span class="material-symbols-outlined">edit</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile