import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import motoricon from '../images/motoricon.png';
import profileicon from '../images/profile1.jpg'
import axios from "axios";

import { UserContext } from "../LoginSignUpPage/UserContext";
import MapboxComponent from './MapboxComponent';
import SwipeableDeviceCards from './SwipeableDeviceCards';

import './Monitor.css'; // Include your other styles

const Monitor = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);
  const [coordinates, setCoordinates] = useState([]);

  const [deviceIdInput, setDeviceIdInput] = useState("");
  const [devices, setDevices] = useState([]);

  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleMouseEnter = () => {
    setIsNavbarExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsNavbarExpanded(false);
  };

  const handleSettingsClick = () => {
    navigate("/Settings"); 
  };  

  const handleAddDevice = async () => {
    if (!deviceIdInput.trim()) {
      alert("Device ID cannot be empty.");
      return;
    }
  
    try {

      const response = await axios.post('http://localhost:8800/add-device', {
        userId: user.userId,  // Current user ID
        deviceId: deviceIdInput.trim(),  // Trim whitespace
      });
    
      const data = response.data;
  
      if (data.success) {
        setCoordinates((prevCoordinates) => [...prevCoordinates, ...data.coordinates]);
        setDevices(data.devices);
        
        alert("Device successfully added to your account.");
        setIsModalOpen(false); // Close modal
        setDeviceIdInput(""); // Reset input field
      } else {
        alert(data.message || "Failed to add device. Please try again.");
      }
    } catch (error) {
      console.error("Error adding device:", error);
      alert("An error occurred. Please try again.");
    }
  }

  useEffect(() => {
    if (!user) return; 

    const fetchUserDevices = async () => {
      try {
        const response = await axios.post('http://localhost:8800/get-devices', { userId: user.userId });

        if (response.data.success) {
          setDevices(response.data.devices);
        } else {
          console.warn("No devices found or error:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchUserDevices();
  }, [user]);

  useEffect(() => {
    if (!user) return; 

    const fetchUserModules = async () => {
      try {
        // Make a request to your backend to fetch user-specific data
        const response = await axios.post('http://localhost:8800/userModules', { userId: user.userId });

        if (response.data) {
          setCoordinates(response.data); // Set coordinates
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserModules();
  }, [user]);

  return (
    <div className='test-body'>
        <div className="parent-container">
          <div className="monitor-title">
              <div className="title-text">
                <h5>Location Monitoring</h5>
              </div>
              <div className="motor-icon">
                <img src={motoricon} alt="Icon-Bike" />
              </div>
            </div>
            <div className="mapbox-container">
              <MapboxComponent coordinates={coordinates} />
            </div>
            <div className="device-container">
              <SwipeableDeviceCards devices={devices} />
            </div>
            <div
              className={`navbar-container ${isNavbarExpanded ? 'expanded' : ''}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
              <div className="profile-icon-container">
                  <div className="expanded-profile">
                    <div className="profile-icon">
                      <img src={profileicon} alt="Profile-Picture" />
                    </div>
                    <p>Allen Luis Alvarez</p>
                  </div>
                </div>
              <div className="icon-divs">
                <span className="material-symbols-outlined">home</span>
                <div className="icon-text">Home</div>
              </div>
              <div className="icon-divs" onClick={toggleModal}>
                <span className="material-symbols-outlined">add_circle</span>
                <div className="icon-text">Add Device</div></div>
              <div className="icon-divs" onClick={handleSettingsClick}>
                <span className="material-symbols-outlined">settings</span>
                <div className="icon-text">Settings</div>
              </div>
            </div>
            {/* Modal Component */}
            {isModalOpen && (
              <div className="modal-overlay" onClick={toggleModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h2>Please input your device ID</h2>
                  <p>Note: Device ID is located at the back of your OmniTrack Device</p>
                  <input
                    type="text"
                    placeholder="Enter your device ID"
                    value={deviceIdInput}
                    onChange={(e) => setDeviceIdInput(e.target.value)}
                  />
                  <button onClick={handleAddDevice}>Add</button>
                </div>
              </div>
            )}
        </div>
    </div>
  );
};

export default Monitor;