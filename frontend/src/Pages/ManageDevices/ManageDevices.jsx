import React, { useContext, useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';

import axios from 'axios';

import { useNavigate } from "react-router-dom";

import { UserContext } from "../../Components/UserContext";

import './ManageDevices.css';


const ManageDevices = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [colorPickerVisible, setColorPickerVisible] = useState(false);  

    const { user } = useContext(UserContext);

    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);  
    const [updatedName, setUpdatedName] = useState(""); 
    const navigate = useNavigate();

    // Handle save or back logic
    const handleBackClick = () => {
        if (isEditing) {
            const userConfirmed = window.confirm("You have unsaved changes. Do you want to save them before leaving?");
            
            if (userConfirmed) {
                handleSaveClick();  // Call the save function if the user confirms
            } else {
                // If the user cancels, just navigate back without saving
                navigate('/Settings');
            }
        } else {
            // If no edits are being made, just navigate back
            navigate('/Settings');
        }
    };

    const handleSaveClick = async () => {
        try {
            if (selectedDeviceId) {
                // Send updated name to the backend
                const response = await axios.post("http://localhost:8800/update-device", {
                    userId: user.userId,
                    deviceId: selectedDeviceId,
                    newName: updatedName,
                    newColor: selectedColor, 
                });

                if (response.data.success) {
                    // Update local device state
                    setDevices((prevDevices) =>
                        prevDevices.map((device) =>
                            device.id === selectedDeviceId
                                ? { ...device, Name: updatedName }
                                : device
                        )
                    );
                    setSelectedDeviceId(null);
                } else {
                    console.warn("Failed to update device:", response.data.message);
                }
            }
        } catch (error) {
            console.error("Error updating device:", error);
        } finally { 
            setUpdatedName("");
            setIsEditing(false);
        }
    };
        
    const toggleModal = (deviceId = null) => {
        setSelectedDeviceId(deviceId);
        setIsModalOpen(!isModalOpen);
    };

    const handleEditClick = (deviceId, currentName) => {
        setSelectedDeviceId(deviceId);
        setUpdatedName(currentName); // Initialize with the current name
        setIsEditing(true); // Enter editing mode
    };

    const toggleColorPicker = () => {
        setColorPickerVisible(!colorPickerVisible);
    };

    const handleColorChange = (color) => {
        setSelectedColor(color.hex); // Update the selected color
            setDevices((prevDevices) =>
                prevDevices.map((dev) =>
                    dev.id === selectedDeviceId ? { ...dev, Color: color.hex } : dev
                )
            );  // Update the color with the selected color's hex code
    };

    // Handle name change
    const handleNameChange = (e) => {
        setUpdatedName(e.target.value);
    };

    const handleConfirmDelete = async (selectedDeviceId) => {
        try {
            const response = await axios.post('http://localhost:8800/remove-device', {
              userId: user.userId,
              deviceId: selectedDeviceId,
            });

            if (response.data.success) {
              setDevices(devices.filter(device => device.id !== selectedDeviceId));
            } else {
              console.warn("Error: ", response.data.message);
            }
          } catch (error) {
            console.error("Error fetching devices:", error);
          }
    }

    useEffect(() => {
        const fetchUserDevices = async () => {
          try {
            const response = await axios.post('http://localhost:8800/get-devices', { userId: user.userId });
    
            if (response.data.success) {
              setDevices(response.data.devices);
            } else {
              console.warn("No devices found or error:", response.data.message);
            }
          } catch (error) {
            console.error("Error fetching devices:", error);
          }
        };
    
        fetchUserDevices();
      }, [user]);
    
  return (
    <div className='Manage-body'>
        <div className="managedevices-container">
            <div className="managedevices-header">
                <div className="back-button" onClick={handleBackClick}>
                    <span className="material-symbols-outlined">arrow_back</span>
                </div>
                <div className="save-button" onClick={handleSaveClick}>
                     {isEditing && <span>SAVE</span>}
                </div>
                <div className="managedevices-title">
                    <p>Manage Devices</p>
                </div>
                <div className="Mdevices-container">
                    {devices.map((device) => (
                        <div className="Mdevices-cards"  key={device.id}>
                            <div className="top-mdev">
                                <div className="mdev-text-div">
                                    {selectedDeviceId === device.id ? (
                                        <input
                                            type="text"
                                            value={updatedName}
                                            onChange={handleNameChange}
                                            className="editable-input"
                                        />
                                    ) : (
                                        <p>Device Name: {device.Name}</p>
                                    )}
                                    <p>Module: {device.Module}</p>
                                </div>
                                <div className="mdev-edit-icon">
                                    <span className="material-symbols-outlined" onClick={() => handleEditClick(device.id, device.Name)}>edit</span>
                                </div>
                            </div>
                            <div className="bottom-mdev">
                            <button className="mdev-change-color-button" 
                                style={{
                                    color: device.Color || '#000000',
                                    cursor: isEditing && selectedDeviceId === device.id? 'pointer' : 'not-allowed', // Change cursor based on `isEditing`
                                    opacity: isEditing && selectedDeviceId === device.id? 1 : 0.5, // Dim the button when disabled
                                }} 
                                onClick={() => {
                                    if (isEditing && selectedDeviceId === device.id) {
                                        setSelectedDeviceId(device.id); // Ensure the right device is selected
                                        toggleColorPicker();
                                    }
                                }}
                                disabled={!isEditing || selectedDeviceId !== device.id}> 
                                    <span className="material-symbols-outlined">palette</span>
                            </button>
                            {colorPickerVisible && selectedDeviceId === device.id &&(
                                <ChromePicker
                                    color={selectedColor || device.Color}
                                    onChange={handleColorChange}  // Update color when user selects a new one
                                    onClick={toggleColorPicker} // Show color picker when clicked
                                />
                            )}
                                <button className='mdev-remove-button' onClick={() => toggleModal(device.id)}>Remove Device</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
                {/* Modal Component */}
                {isModalOpen && (
                    <div className="modal-overlay-remove-device" >
                        <div className="modal-content-remove-device" onClick={(e) => e.stopPropagation()}>
                        <h4>Are you sure you want to remove your device?</h4>
                            <div className="mdev-button-remove">
                                <button onClick={() => {
                                handleConfirmDelete(selectedDeviceId)
                                toggleModal()}}>Confirm</button>
                                <button onClick={toggleModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    </div>
  )
}

export default ManageDevices