import React from 'react'
import './profile.css';
import profileicon from '../images/profile1.jpg'
import { useNavigate } from "react-router-dom";


const Profile = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/Settings"); 
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