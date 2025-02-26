import React, { createContext, useContext, useState } from "react";

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [devices, setDevices] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [locations, setLocations] = useState({}); 
  const [deviceDistances, setDeviceDistances] = useState([]); // Stores distance data

  // Function to update distances only when needed
  const updateDeviceDistances = (newDistances) => {
    setDeviceDistances(newDistances);
  };

  return (
    <DeviceContext.Provider value={{ devices, setDevices, coordinates, setCoordinates, locations, setLocations, deviceDistances, updateDeviceDistances }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevices = () => useContext(DeviceContext);