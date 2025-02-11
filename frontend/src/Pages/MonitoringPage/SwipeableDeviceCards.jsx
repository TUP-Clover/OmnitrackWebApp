import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useDevices } from '../../Components/DeviceContext';
import Loader from '../../Loader/Loader';
import * as turf from "@turf/turf"; 

const SwipeableDeviceCards = ({ dataloading, setActiveDevice, geofenceStatus, toggleGeofence, isTracking, userLocation  }) => {
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

    const from = turf.point([lon1, lat1]); // User location
    const to = turf.point([lon2, lat2]); // Device latest coordinate
    const options = { units: "kilometers" };

    return turf.distance(from, to, options).toFixed(2); // Return distance in km
  };


  useEffect(() => {
    if (!devices || !locations) return;
  
    // Find the latest timestamp for each module
    const latestTimestamps = Object.fromEntries(
      Object.entries(locations).map(([module, loc]) => {
        if (loc.coordinates?.Timestamp) {
          return [module, new Date(loc.coordinates.Timestamp).getTime()];
        }
        return [module, 0]; // Default to 0 if no timestamp exists
      })
    );
  
    const updatedDevices = devices.map((device) => {
      const latestLocation = locations[device.Module]?.coordinates; // Get latest coordinate
      let distance = "Turn on location"; // Default message
  
      if (latestLocation && userLocation && latestLocation.Timestamp) {
        const moduleTimestamp = new Date(latestLocation.Timestamp).getTime();
        const latestTimestamp = latestTimestamps[device.Module];
  
        // Only calculate distance if the module's timestamp is the latest
        if (moduleTimestamp === latestTimestamp) {
          distance = calculateDistance(
            Number(userLocation.lat),
            Number(userLocation.lon),
            Number(latestLocation.Latitude),
            Number(latestLocation.Longitude)
          );
        }
      }
  
      return { ...device, distance }; // Assign the distance to each device
    });
  
    setDevicesWithDistance(updatedDevices);
  }, [userLocation, devices, locations]);
  

  if (dataloading) return <Loader />;


  return (
    <div className="device-cards" {...handlers}>
      {devicesWithDistance && devicesWithDistance.length > 0 ? (
        devicesWithDistance.map((device) => (
          <DeviceCard
            key={device.id}
            name={device.Name}
            module={device.Module}
            color={device.Color}
            status="Active" // Placeholder for now
            location={locations[device.Module] ? locations[device.Module].name : "Loading..."} // Display the latest location name
            distance={ device.distance || "Calculating..."}
            onTrack={() => setActiveDevice(device.Module)} // Track button log
            isTracking={isTracking}
            geofenceEnabled={geofenceStatus[device.Module] || false}
            onToggleGeofence={() => toggleGeofence(device.Module)}
          />
        ))
      ) : (
        <p>Add a device and start Tracking!</p> // Optional: Handle the case where `devices` is empty
      )}
    </div>
  );
};

const DeviceCard = ({module, name, color, location, distance, onTrack, isTracking, geofenceEnabled, onToggleGeofence }) => {
  return (
    <div className="device-card">
      <div className="left_side">
        <h4>{name}</h4>
  
        <p>Module: {module}</p>
        <p className="status">{location}</p>
        <p className="distance">
          Distance: {isTracking ? `${distance} km` : "Turn on location"}
        </p>
        <div className="device-card-func">
          <button onClick={onTrack}>Track</button>
        <div className='geofence'>
          <p>Geofence</p>
          <label className="switch">
          <input 
                type="checkbox" 
                checked={geofenceEnabled} 
                onChange={onToggleGeofence} 
          />
          <span className="slider round"></span>
        </label>
        </div>
        </div>
      </div>
      <div className="right_side">
          <div
            className="status-bar"
            style={{ backgroundColor: color }} // Dynamic color
          ></div>
        <span className="material-symbols-outlined">share_location</span>
      </div>
    </div>
  );
};

export default SwipeableDeviceCards;
