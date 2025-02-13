import React, { useContext, useState } from 'react';
import './Settings.css';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Components/UserContext";

// Calling other component
import useMediaQuery from '../MonitoringPage/useMediaQuery'; // Import the custom hook
import ManageDeviceComponent from '../ManageDevices/ManageDevices'
import ProfileComponent from '../ProfilePage/Profile'
import GuideComponent from '../GuidePage/Guide'

export const Settings = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangeDeviceModalOpen, setIsChangeDeviceModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // New password modal state
  const [email, setEmail] = useState("");

  const { user, logoutUser } = useContext(UserContext);

  const isLargeScreen = useMediaQuery("(min-width: 768px)"); // Check if screen is >= 768px
  
  const handleBackClick = () => {
    navigate("/Monitor"); 
  };

  const handleLogOutClick = () => {
    // navigate("/frontend/src/Pages/LoginSignUpPage/Login.jsx")
    logoutUser();
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

  const handProfileClick = () => {
    if (isLargeScreen) {
      // Open settings modal for larger screens
      setIsProfileModalOpen(true);
    } else {
      // Navigate to the settings page for smaller screens
      navigate("/Profile");
    }
  };

  const handleGuideClick = () => {
    if (isLargeScreen) {
      // Open settings modal for larger screens
      setIsGuideOpen(true);
    } else {
      // Navigate to the settings page for smaller screens
      navigate("/Guide");
    }
  };

  const closeManageDeviceModal = () => {
    setIsChangeDeviceModalOpen(false);
  };
  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };
  const closeGuide = () => {
    setIsGuideOpen(false);
  };
  const handleConfirmCode = () => {
    // Validate the code (you can add API call logic here)
    if (verificationCode === "123456") { // Replace with actual validation logic
      setIsPasswordModalOpen(true);
      setIsModalOpen(false);
    } else {
      alert("Invalid verification code. Please try again.");
    }
  };
  const handleChangePassword = () => {
    if (newPassword !== retypePassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    // Add API call logic to update the password here
    console.log("Password changed successfully!");
    alert("Password changed successfully!");
    setIsPasswordModalOpen(false);
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
              <img src={`http://localhost:8800/public/images/${user.profileImage}`} alt="Profile-Picture" />
            </div>
            <div className="profile-details">
              <p>{user ? user.username : "Loading..."}</p>
              <button onClick={handProfileClick}>View Profile</button>
            </div>
          </div>
          <div className="options-container">
            <div className="options-content">
              <div className="option-div" onClick={handleManageDevicesClick}>
                <span className="material-symbols-outlined icon-span">devices</span>
                <p>Manage Devices</p>
                <span className="material-symbols-outlined arrow-right">chevron_right</span>
              </div>
              <div className="option-div" onClick={toggleModal} >
                <span className="material-symbols-outlined">phone_iphone</span>
                <p>Change Password</p>
                <span className="material-symbols-outlined arrow-right">chevron_right</span>
              </div>
              <div className="option-div" onClick={handleGuideClick}>
                <span className="material-symbols-outlined">developer_guide</span>
                <p>Guides</p>
                <span className="material-symbols-outlined arrow-right">chevron_right</span>
              </div>
              <div className="option-div">
                <span className="material-symbols-outlined" onClick={handleLogOutClick}>logout</span>
                  <p onClick={handleLogOutClick}>Logout</p>
              </div>
            </div>

              {/* Modal Component */}
              {isModalOpen && (
              <div className="modal-overlay-mobile-num" onClick={toggleModal}>
                <div className="modal-content-mobile-num" onClick={(e) => e.stopPropagation()}>
                  <h2>Change Password</h2>
                  <p>Please input your registered email</p>
                  <input
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="modal-verify-mobile-num">
                  <input
                    type="text"
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <button onClick={handleConfirmCode} className='pass-confirm-btn'>Confirm</button>
                  </div>
                </div>
              </div>
            )}
               {/* Modal for setting a new password */}
          {isPasswordModalOpen && (
            <div className="modal-overlay-new-password" onClick={() => setIsPasswordModalOpen(false)}>
              <div className="modal-content-new-password" onClick={(e) => e.stopPropagation()}>
                <h2>Set New Password</h2>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Re-type new password"
                  value={retypePassword}
                  onChange={(e) => setRetypePassword(e.target.value)}
                />
                <button onClick={handleChangePassword}>Save</button>
              </div>
            </div>
          )}
        </div>

            {/* Render Settings modal if isSettingsModalOpen is true */}
             {isChangeDeviceModalOpen && isLargeScreen && (
               <div className="modal-Mdev-larger" onClick={closeManageDeviceModal}>
                <div className="modal-content-Mdev" onClick={(e) => e.stopPropagation()}>
                <ManageDeviceComponent onBack={closeManageDeviceModal}/>
                </div>
                </div>
                )}
              {/* Render Settings modal if isSettingsModalOpen is true */}
              {isProfileModalOpen && isLargeScreen && (
                  <div className="modal-Profile-larger" onClick={closeProfileModal}>
                  <div className="modal-content-Profile" onClick={(e) => e.stopPropagation()}>
                <ProfileComponent onBack={closeProfileModal}/>
              </div>
            </div>
            )}
            {/* Render Settings modal if isSettingsModalOpen is true */}
            {isGuideOpen && isLargeScreen && (
                <GuideComponent onBack={closeGuide}/>
            )}
          </div>
      </div>

  )

}

export default Settings;