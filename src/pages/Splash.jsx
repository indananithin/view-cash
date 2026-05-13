import React from 'react';
import './Splash.css';

const Splash = () => {
  return (
    <div className="splash-container">
      <div className="logo-container">
        <div className="logo-icon">V</div>
        <h1 className="logo-text">ViewWin</h1>
        <p className="tagline">Watch. Win. Redeem.</p>
      </div>
      <div className="loader"></div>
    </div>
  );
};

export default Splash;
