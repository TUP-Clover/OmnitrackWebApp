import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import motoricon from '../images/motoricon.png';
import axios from "axios";

import { UserContext } from "../../Components/UserContext";
import { useDevices } from "../../Components/DeviceContext";
import MapboxComponent from '../../Components/MapboxComponent';
import Loader from '../../Loader/Loader';

import SwipeableDeviceCards from './SwipeableDeviceCards';
import { toast, ToastContainer } from 'react-toastify'
import { io } from "socket.io-client";

import './Monitor.css'; // Include your other styles

// Calling other component
import useMediaQuery from './useMediaQuery'; // Import the custom hook
import SettingsComponent from '../SettingsPage/Settings'

const Monitor = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [deviceIdInput, setDeviceIdInput] = useState("");
  const [activeDevice, setActiveDevice] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu bar
  const [selectedFilter, setSelectedFilter] = useState("today"); // State for dropdown selection
  const [selectedDate, setSelectedDate] = useState(""); // State for custom date selection
  const [userLocation, setUserLocation] = useState(null); // User's current location

  const navigate = useNavigate();

  const { setDevices, setCoordinates } = useDevices();
  const { user, loginUser } = useContext(UserContext);
  const [dataloading, setDataLoading] = useState(true);
  
  const isLargeScreen = useMediaQuery("(min-width: 768px)"); // Check if screen is >= 768px

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
    if (isLargeScreen) {
      // Open settings modal for larger screens
      setIsSettingsModalOpen(true);
    } else {
      // Navigate to the settings page for smaller screens
      navigate("/Settings");
    }
  };

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  
    const menuBar = document.getElementById("menu-bar");
    const nav = document.getElementById("nav");
  
    if (menuBar) {
      menuBar.classList.toggle("change");
    } else {
      console.error("menu-bar element not found.");
    }
  
    if (nav) {
      nav.classList.toggle("change");
    } else {
      console.error("nav element not found.");
    }
  };
  

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
    if (event.target.value !== "custom") {
      setSelectedDate(""); // Clear custom date when not selecting "Custom"
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };
  const handleAddDevice = async () => {
    if (!user.userId) return;
    
    if (!deviceIdInput.trim()) {
      alert("Device ID cannot be empty.");
      return;
    }
  
    try {

      const response = await axios.patch('http://localhost:8800/claim-device', {
        userId: user.userId,  // Current user ID
        deviceId: deviceIdInput.trim(),  // Trim whitespace
      });
    
      const data = response.data;
  
      if (data.success) {
        setCoordinates((prevCoordinates) => [...prevCoordinates, ...data.coordinates]);
        setDevices(data.devices);
        
        loginUser({ ...user, isNewUser: false });  // Update user context

        // Persist the updated user in localStorage
        localStorage.setItem("isNewUser", "false");  // Store the updated isNewUser flag in localStorage

        toast.success("Device successfully added to your account.");
        setIsModalOpen(false); // Close modal
        setDeviceIdInput(""); // Reset input field
      } else {
        toast.error(data.message || "Failed to add device. Please try again.");
      }
    } catch (error) {
      console.error("Error adding device:", error);
      toast.error("An error occurred. Please try again.");
    }
  }

  // Fetch the user's current location
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          console.log(`User Location: Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
          toast.success("User location accessed successfully.");
        },
        (error) => {
          toast.error("Failed to get location. Please enable location services.");
          console.error("Geolocation Error:", error);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
        if (!user || user.isNewUser) {
          setDataLoading(false);
          return; // Skip if user is new
        }

        try {
          const [devicesResponse, coordinatesResponse] = await Promise.all([
            axios.post('http://localhost:8800/get-devices', { userId: user.userId }),
            axios.post('http://localhost.188:8800/get-coordinates', { userId: user.userId }),
          ]);
    
          // Handle devices response
          if (devicesResponse.data.success) {
            setDevices(devicesResponse.data.devices);
          } else {
            console.warn("No devices found or error:", devicesResponse.data.message);
          }
    
          // Handle coordinates response
          if (coordinatesResponse.data) {
            setCoordinates(coordinatesResponse.data);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log("No devices found.");
            return;
          } else {
            console.error("Error fetching data:", error);
          }
        } finally {
          setDataLoading(false); // Set loading to false after both requests complete
        }
    };
      
  
    fetchData();
  }, [user, setDevices, setCoordinates]);

  useEffect(() => {
    if (!user || user.isNewUser) return;

    const socket = io("http://localhost:8800"); 

    // Listen for new coordinates
    socket.on("new_coordinates", (newCoordinate) => {
      console.log("Received new coordinate:", newCoordinate);
      setCoordinates((prevCoordinates) => [...prevCoordinates, newCoordinate]);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [user, setCoordinates]);

   // Fetch user location on mount
   useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);


  if (dataloading ) {
    return <Loader/>
  }

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
          <div className='History-container'>
            <h4>Travel History</h4>
            <select value={selectedFilter} onChange={handleFilterChange}>
              <option value="today">Today</option>
              <option value="custom">Custom</option>
              <option value="all">Show All</option>
            </select>
            {selectedFilter === "custom" && (
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            )}
          </div>
        </div>
        {/* Hamburger Menu for Mobile */}
        <div id="menu">
          <div id="menu-bar" onClick={toggleMenu} className={isMenuOpen ? "change" : ""}>
            <div id="bar1" className="bar"></div>
            <div id="bar2" className="bar"></div>
            <div id="bar3" className="bar"></div>
          </div>
          {isMenuOpen && (
            <nav className="nav" id="nav">
              <ul>
                <li onClick={() => setSelectedFilter("today")}>Today</li>
                <li onClick={() => setSelectedFilter("custom")}>Custom</li>
                <li onClick={() => setSelectedFilter("all")}>Show All</li>
              </ul>
              {selectedFilter === "custom" && (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              )}
            </nav>
          )}
            </div>
            <div className="mapbox-container">
              <MapboxComponent activeDevice={activeDevice}/>
            </div>
            <div className="device-container">
              {dataloading ? (
                <Loader/> // Display a loading message or spinner
              ) : (
                <SwipeableDeviceCards setActiveDevice={setActiveDevice} dataloading={dataloading}  userLocation={userLocation} />
              )}
            </div>
            <div
              className={`navbar-container ${isNavbarExpanded ? 'expanded' : ''}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
              <div className="profile-icon-container">
                  <div className="expanded-profile">
                    <div className="profile-icon">
                    <img src={`http://localhost:8800/public/images/${user.profileImage}`} alt="Profile-Picture" />
                    </div>
                    <p>{user ? user.username : "Loading..."}</p>
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
            {/* Render Settings modal if isSettingsModalOpen is true */}
            {isSettingsModalOpen && isLargeScreen && (
              <div className="modal-screen-larger" onClick={closeSettingsModal}>
                <div className="modal-content-screen" onClick={(e) => e.stopPropagation()}>
                  <SettingsComponent />
                </div>
              </div>
            )}
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
        <ToastContainer/> 
    </div>
  );
};

export default Monitor;