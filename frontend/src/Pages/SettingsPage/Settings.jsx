import React, { useContext, useState } from 'react';
import './Settings.css';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Components/UserContext";

import profileicon from '../images/profile1.jpg'

// Calling other component
import useMediaQuery from '../MonitoringPage/useMediaQuery'; // Import the custom hook
import ManageDeviceComponent from '../ManageDevices/ManageDevices'

export const Settings = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangeDeviceModalOpen, setIsChangeDeviceModalOpen] = useState(false);
  
  const { user, logoutUser } = useContext(UserContext);

  const isLargeScreen = useMediaQuery("(min-width: 768px)"); // Check if screen is >= 768px
  
  const handleBackClick = () => {
    navigate("/Monitor"); 
  };


  const handProfileClick = () => {
    navigate("/Profile"); 
  };

  const handleLogOutClick = () => {
    logoutUser(); 
    navigate("/login"); 
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleManageDevicesClick = () => {
    if (isLargeScreen) {
      // Open settings modal for larger screens
      setIsChangeDeviceModalOpen(true);
    } else {
      // Navigate to the settings page for smaller screens
      navigate("/ManageDevices");
    }
  };

  const closeManageDeviceModal = () => {
    setIsChangeDeviceModalOpen(false);
  };
  return (
    <div className="settings-body">
      <div className='Settings-container'>
        <div className="settings-header">
          <div className="back-button" onClick={handleBackClick}>
            <span className="material-symbols-outlined">arrow_back</span>
          </div>
          <div className="settings-title">
            <p>Settings</p>
          </div>
        </div>
          <div className="profile-card">
            <div className="profile-pic">
              <img src={profileicon} alt="Profile-Picture" />
            </div>
            <div className="profile-details">
              <p>{user ? user.username : "Loading..."}</p>
              <button onClick={handProfileClick}>View Profile</button>
            </div>
          </div>
          <div className="options-container">
            <div className="option-div" onClick={handleManageDevicesClick}>
              <span className="material-symbols-outlined">devices</span>
              <p>Manage Devices</p>
              <span class="material-symbols-outlined">chevron_right</span>
            </div>
            <div className="option-div" onClick={toggleModal} >
              <span className="material-symbols-outlined">phone_iphone</span>
              <p>Change Mobile Number</p>
              <span className="material-symbols-outlined">chevron_right</span>
            </div>
            <div className="option-div">
              <span className="material-symbols-outlined">developer_guide</span>
              <p>Guides</p>
              <span className="material-symbols-outlined">chevron_right</span>
            </div>
            <div className="option-div">
              <span className="material-symbols-outlined" onClick={handleLogOutClick}>logout</span>
                <p onClick={handleLogOutClick}>Logout</p>
            </div>
              {/* Modal Component */}
              {isModalOpen && (
              <div className="modal-overlay-mobile-num" onClick={toggleModal}>
                <div className="modal-content-mobile-num" onClick={(e) => e.stopPropagation()}>
                  <h2>Change Mobile Number</h2>
                  <p>Please input OTP number sent to your mobile number</p>
                  <div className="modal-verify-mobile-num">
                    <input type="number"placeholder="Enter your mobile number"/>
                    <button>Verify</button>
                  </div>
                  <input type="text"placeholder="Enter OTP code"/>
                  <button>Confirm</button>
                </div>
              </div>
            )}
            {/* Render Settings modal if isSettingsModalOpen is true */}
             {isChangeDeviceModalOpen && isLargeScreen && (
               <div className="modal-Mdev-larger" onClick={closeManageDeviceModal}>
                <div className="modal-content-Mdev" onClick={(e) => e.stopPropagation()}>
                <ManageDeviceComponent onBack={closeManageDeviceModal}/>
                </div>
                </div>
                )}
          </div>
      </div>
    </div>
  )
}

export default Settings;