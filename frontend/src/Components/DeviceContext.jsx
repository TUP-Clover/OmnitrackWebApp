import React, { createContext, useContext, useState } from "react";

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [devices, setDevices] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [locations, setLocations] = useState({}); 

  return (
    <DeviceContext.Provider value={{ devices, setDevices, coordinates, setCoordinates, locations, setLocations }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevices = () => useContext(DeviceContext);