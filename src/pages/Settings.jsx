import React, { useState } from 'react';
import { Bell, Moon, Shield, Info, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Settings.css';

const Settings = () => {
  const { logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="settings-container page-container">
      <header className="page-header">
        <h2>Settings</h2>
      </header>

      <div className="settings-section">
        <h3>Preferences</h3>
        <div className="settings-card">
          <div className="setting-item">
            <div className="setting-info">
              <Bell size={20} className="setting-icon" />
              <span>Push Notifications</span>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <Moon size={20} className="setting-icon" />
              <span>Dark Mode (Coming Soon)</span>
            </div>
            <label className="toggle-switch disabled">
              <input 
                type="checkbox" 
                checked={darkMode}
                disabled
                onChange={() => setDarkMode(!darkMode)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Security & Privacy</h3>
        <div className="settings-card">
          <div className="setting-item clickable">
            <div className="setting-info">
              <Shield size={20} className="setting-icon" />
              <span>Privacy Policy</span>
            </div>
            <ChevronRight size={20} color="#9CA3AF" />
          </div>
          <div className="setting-item clickable">
            <div className="setting-info">
              <Info size={20} className="setting-icon" />
              <span>Terms & Conditions</span>
            </div>
            <ChevronRight size={20} color="#9CA3AF" />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <button className="logout-btn-large" onClick={logout}>
          <LogOut size={20} />
          Logout from App
        </button>
        <p className="app-version">ViewCash v1.0.0</p>
      </div>
    </div>
  );
};

export default Settings;
