import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import './monitoring.css'; // Include your other styles

const Navigate = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="navigate_container">
      <div className="image_container"></div>
      <div className="devices_container">
        {/* Swipeable Device Cards */}
        <SwipeableDeviceCards />
      </div>
      <div className="nav_bar">
        <span className="material-symbols-outlined">home</span>
        <span className="material-symbols-outlined" onClick={toggleModal}>
          add_circle
        </span>
        <span className="material-symbols-outlined">settings</span>
      </div>

      {/* Modal Component */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Please input your device ID</h2>
            <p>Note: Device ID are located at the back of your OmniTrack Device</p>
            <input type="text" placeholder="Enter your device ID" />
            <button>Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

const SwipeableDeviceCards = () => {
  const handlers = useSwipeable({
    onSwipedLeft: () => scrollCards('right'),
    onSwipedRight: () => scrollCards('left'),
  });

  const scrollCards = (direction) => {
    const container = document.querySelector('.device-cards');
    const scrollAmount = 150;

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else if (direction === 'right') {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="device-cards" {...handlers}>
      <DeviceCard name="Click" id="072910T" status="Low Signal" />
      <DeviceCard name="Device Two" id="123456A" status="Active" />
      <DeviceCard name="Device Three" id="789012B" status="Inactive" />
      <DeviceCard name="Device Four" id="345678C" status="Low Battery" />
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
        <span className="material-symbols-outlined">share_location</span>
      </div>
    </div>
  );
};

export default Navigate;
