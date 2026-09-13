import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="settings-page">
      <h1 className="page-title">Settings</h1>
      
      <div className="settings-container">
        <div className="settings-section card">
          <h2 className="settings-section-title">Appearance</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3 className="setting-label">Dark Mode</h3>
              <p className="setting-description">Switch between light and dark theme</p>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section card">
          <h2 className="settings-section-title">About</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3 className="setting-label">Spendly</h3>
              <p className="setting-description">Version 1.0.0</p>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3 className="setting-label">Student Expense Tracker</h3>
              <p className="setting-description">Track. Save. Spend Smart.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;