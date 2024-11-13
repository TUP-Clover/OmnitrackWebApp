import React from "react";
import { useSwipeable } from 'react-swipeable';
import './monitoring.css';

const Navigate = () => (

  <div className="navigate_container">
    <button className="back_container">
        <span class="material-symbols-outlined">arrow_back</span>
    </button>
    <div className="image_container"></div>
    <div className="devices_container">
      {/* Swipeable Device Cards */}
      <SwipeableDeviceCards />
    </div>
    <div className="nav_bar">
    <span class="material-symbols-outlined">home</span>
      <span class="material-symbols-outlined">add_circle</span>
      <span class="material-symbols-outlined">settings</span>
    </div>
  </div>
);
const SwipeableDeviceCards = () => {
  // Handlers for swipe gestures using `react-swipeable`
  const handlers = useSwipeable({
    onSwipedLeft: () => scrollCards('right'),
    onSwipedRight: () => scrollCards('left'),
  });

  // Function to handle scrolling
  const scrollCards = (direction) => {
    const container = document.querySelector('.device-cards');
    const scrollAmount = 150; // Adjust this based on card width

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else if (direction === 'right') {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="device-cards" {...handlers}>
      <DeviceCard name="Click" id="072910T" status="Low Signal" />
      <DeviceCard name="Another Device" id="123456A" status="Active"/>
      <DeviceCard name="Device Three" id="789012B" status="Inactive"/>
      <DeviceCard name="Device Four" id="345678C" status="Low Battery"/>
      {/* Add more DeviceCard components as needed */}
    </div>
  );
};

const DeviceCard = ({ name, id, status }) => {
  return (
    <div className="device-card">
      <div className="left_side">
        <h4>Device Name: {name}</h4>
        <p>Device ID: {id}</p>
        <p className="status">Device Status: {status}</p>
        <div className="device-card-func">
          <button>Track</button>
          <div className="status-bar"></div>
        </div>
      </div>
      <div className="right_side">
        <span class="material-symbols-outlined" >share_location</span>
      </div>
      
    </div>
  );
};
export default Navigate;
