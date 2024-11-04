
import React, {useState} from 'react';
import './Home.css';
import DeviceCard from './DeviceCard';


function Home() {
    const [activePage, setActivePage] = useState('home');
  return (
    <div className="app">
      <header className="header">
        <img src="https://via.placeholder.com/70" alt="Profile" className="profile-pic" />
        <h1 className="app-title">OmniTrack</h1>
      </header>
      <div className="device-list">
        <DeviceCard deviceName="Click" deviceId="OT2891B" battery="40%" status="Battery Low" isOnline={true} />
        <DeviceCard deviceName="Mio" deviceId="OT5183B" battery="89%" status="Good" isOnline={true} />
        <DeviceCard deviceName="Yamaha" deviceId="OT2911C" battery="12%" status="Battery Low" isOnline={true} />
        <DeviceCard deviceName="Honda" deviceId="OT2910T" battery="OFF" status="No Signal" isOnline={false} />
      </div>
      <footer className="footer">
        <button 
          className="footer-btn" 
          onClick={() => setActivePage('home')}
        >
          <span className={`material-symbols-outlined ${activePage === 'home' ? 'active' : ''}`}>home</span>
        </button>
        <button 
          className="footer-btn" 
          onClick={() => setActivePage('person')}
        >
          <span className={`material-symbols-outlined ${activePage === 'person' ? 'active' : ''}`}>Person</span>
        </button>
        <button 
          className="footer-btn" 
          onClick={() => setActivePage('add')}
        >
          <span className={`material-symbols-outlined ${activePage === 'add' ? 'active' : ''}`}>add</span>
        </button>
        <button 
          className="footer-btn" 
          onClick={() => setActivePage('notifications')}
        >
          <span className={`material-symbols-outlined ${activePage === 'notifications' ? 'active' : ''}`}>notifications</span>
        </button>
        <button 
          className="footer-btn" 
          onClick={() => setActivePage('settings')}
        >
          <span className={`material-symbols-outlined ${activePage === 'settings' ? 'active' : ''}`}>settings</span>
        </button>
      </footer>
    </div>
  );
}

export default Home;
