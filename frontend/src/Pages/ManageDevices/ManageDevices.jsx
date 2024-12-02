import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import './ManageDevices.css';


const ManageDevices = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBackClick = () => {
        navigate("/Settings"); 
      };
      const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
      };
  return (
    <div className='Manage-body'>
        <div className="managedevices-container">
            <div className="managedevices-header">
                <div className="back-button" onClick={handleBackClick}>
                    <span class="material-symbols-outlined">arrow_back</span>
                </div>
                <div className="managedevices-title">
                    <p>Manage Devices</p>
                </div>
                <div className="Mdevices-container">
                    <div className="Mdevices-cards">
                        <div className="top-mdev">
                            <div className="mdev-text-div">
                                <p>Device Name: Honda</p>
                                <p>Device ID: CT34812</p>
                            </div>
                            <div className="mdev-edit-icon">
                                <span class="material-symbols-outlined">edit</span>
                            </div>
                        </div>
                        <div className="bottom-mdev">
                            <button className='mdev-change-color-button'><span class="material-symbols-outlined">palette</span></button>
                            <button className='mdev-remove-button' onClick={toggleModal}>Remove Device</button>
                        </div>
                    </div>
                    <div className="Mdevices-cards">
                        <div className="top-mdev">
                            <div className="mdev-text-div">
                                <p>Device Name: Honda</p>
                                <p>Device ID: CT34812</p>
                            </div>
                            <div className="mdev-edit-icon">
                                <span class="material-symbols-outlined">edit</span>
                            </div>
                        </div>
                        <div className="bottom-mdev">
                            <button className='mdev-change-color-button'><span class="material-symbols-outlined">palette</span></button>
                            <button className='mdev-remove-button' onClick={toggleModal}>Remove Device</button>
                        </div>
                    </div>
                    <div className="Mdevices-cards">
                        <div className="top-mdev">
                            <div className="mdev-text-div">
                                <p>Device Name: Honda</p>
                                <p>Device ID: CT34812</p>
                            </div>
                            <div className="mdev-edit-icon">
                                <span class="material-symbols-outlined">edit</span>
                            </div>
                        </div>
                        <div className="bottom-mdev">
                            <button className='mdev-change-color-button'><span class="material-symbols-outlined">palette</span></button>
                            <button className='mdev-remove-button' onClick={toggleModal}>Remove Device</button>
                        </div>
                    </div>
                </div>
            </div>
                {/* Modal Component */}
                {isModalOpen && (
                    <div className="modal-overlay-remove-device" onClick={toggleModal}>
                        <div className="modal-content-remove-device" onClick={(e) => e.stopPropagation()}>
                        <h4>Are you sure you want to remove your device?</h4>
                            <div className="mdev-button-remove">
                                <button>Confirm</button>
                                <button>Cancel</button>
                            </div>
                        </div>
                    </div>
                    )}
        </div>
    </div>
  )
}

export default ManageDevices