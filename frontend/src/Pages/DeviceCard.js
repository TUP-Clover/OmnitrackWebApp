// DeviceCard.js
import React from 'react';

function DeviceCard({ deviceName, deviceId, battery, status, isOnline }) {
  return (
    <div className="device-card">
      <div className="battery">
        <span className="battery-percentage">{battery}</span>
      </div>
      <div className="device-info">
        <p className="device-name">Device Name: {deviceName}</p>
        <p className="device-id">Device ID: {deviceId}</p>
        <p className={`battery-status ${status === 'Battery Low' ? 'low' : 'good'}`}>Battery Status: {status}</p>
      </div>
      <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}></div>
    </div>
  );
}

export default DeviceCard;
