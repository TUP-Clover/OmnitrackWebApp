import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import './Monitor.css'; // Include your other styles

const Monitor = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleMouseEnter = () => {
    setIsNavbarExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsNavbarExpanded(false);
  };

  return (
    <body className='test-body'>
        <div className="parent-container">
            <div className="mapbox-container"></div>
            <div className="device-container">
              <SwipeableDeviceCards />
            </div>
            <div
              className={`navbar-container ${isNavbarExpanded ? 'expanded' : ''}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
              <div className="profile-icon"></div>
              <div className="icon-divs">
                <span className="material-symbols-outlined">home</span>
                <div className="icon-text">Home</div>
              </div>
              <div className="icon-divs" onClick={toggleModal}>
                <span className="material-symbols-outlined">add_circle</span>
                <div className="icon-text">Add Device</div></div>
              <div className="icon-divs">
                <span className="material-symbols-outlined">settings</span>
                <div className="icon-text">Settings</div>
              </div>
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
    </body>
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


export default Monitor;