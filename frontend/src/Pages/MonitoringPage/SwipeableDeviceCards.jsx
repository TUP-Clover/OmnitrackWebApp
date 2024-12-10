import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { useDevices } from '../../Components/DeviceContext';
import Loader from '../../Loader/Loader';

const SwipeableDeviceCards = ({ dataloading, setActiveDevice }) => {
  const { devices, locations } = useDevices();

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

  // Prevent rendering of device cards if data is still loading
  if (dataloading) {
    return <Loader/> // Optional: Replace with a loading spinner or placeholder
  }

  return (
    <div className="device-cards" {...handlers}>
      {devices && devices.length > 0 ? (
        devices.map((device) => (
          <DeviceCard
            key={device.id}
            name={device.Name}
            module={device.Module}
            color={device.Color}
            status="Active" // Placeholder for now
            location={locations[device.Module] ? locations[device.Module].name : "Loading..."} // Display the latest location name
            onTrack={() => setActiveDevice(device.Module)} // Track button log
          />
        ))
      ) : (
        <p>Add a device and start Tracking!</p> // Optional: Handle the case where `devices` is empty
      )}
    </div>
  );
};

const DeviceCard = ({module, name, color, location, onTrack }) => {
  return (
    <div className="device-card">
      <div className="left_side">
        <h4>{name}</h4>
        <p>Module: {module}</p>
        <p className="status">{location || "Loading location..."}</p>
        <div className="device-card-func">
          <button onClick={onTrack}>Track</button>
          <div
            className="status-bar"
            style={{ backgroundColor: color }} // Dynamic color
          ></div>
        </div>
      </div>
      <div className="right_side">
        <span className="material-symbols-outlined">share_location</span>
      </div>
    </div>
  );
};

export default SwipeableDeviceCards;
