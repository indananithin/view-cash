import React from 'react';
import './Splash.css';

const Splash = () => {
  return (
    <div className="splash-container">
      <div className="logo-container">
        <img src="/logo.png" alt="ViewCash Logo" className="logo-image" />
        <h1 className="logo-text">ViewCash</h1>
        <p className="tagline">Watch. Win. Redeem.</p>
      </div>
      <div className="loader"></div>
    </div>
  );
};

export default Splash;
