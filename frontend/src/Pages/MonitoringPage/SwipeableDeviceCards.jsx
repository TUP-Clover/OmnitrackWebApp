import React from 'react';
import { useSwipeable } from 'react-swipeable';

const SwipeableDeviceCards = ({ devices }) => {
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
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            name={device.Name} 
            id={device.Module}
            status="Active" // Placeholder for now
          />
        ))}
      </div>
    );
  };
  
  const DeviceCard = ({ name, id, status }) => {
    return (
      <div className="device-card">
        <div className="left_side">
          <h4>{name}</h4>
          <p>Module: {id}</p>
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

  export default SwipeableDeviceCards;