import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useDevices } from '../../Components/DeviceContext';
import Loader from '../../Loader/Loader';

const SwipeableDeviceCards = ({ dataloading, setActiveDevice,  userLocation  }) => {
  const { devices, locations } = useDevices();
  const [devicesWithDistance, setDevicesWithDistance] = useState([]);

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

 
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  useEffect(() => {
    if (!userLocation || !devices || !locations) return;

    const updatedDevices = devices.map((device) => {
      const deviceLocation = locations[device.Module]?.coordinates;
      console.log(deviceLocation);
      const distance = 
       calculateDistance(
          Number(userLocation.lat),
          Number(userLocation.lon),
          Number(deviceLocation.Latitude), // Ensure these are numbers
          Number(deviceLocation.Longitude)
        )
      console.log(distance);
      console.log(device);
      return { ...device, distance: distance || 'No distance' }; // Add default value for missing distance
    });
   
    console.log('Updated devices:', updatedDevices);
    setDevicesWithDistance(updatedDevices);
  }, [userLocation, devices, locations]);

  if (dataloading) return <Loader />;


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
            distance={device.distance ? device.distance : "Calculating..."}
            onTrack={() => setActiveDevice(device.Module)} // Track button log
          />
        ))
      ) : (
        <p>Add a device and start Tracking!</p> // Optional: Handle the case where `devices` is empty
      )}
    </div>
  );
};

const DeviceCard = ({module, name, color, location,distance, onTrack }) => {
  return (
    <div className="device-card">
      <div className="left_side">
        <h4>{name}</h4>
        <p>Module: {module}</p>
        <p className="status">{location || "Loading location..."}</p>
        <p className="distance">Distance: {distance ? `${distance} km` : "Calculating..."}</p>
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
