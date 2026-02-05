// ArcReactorLoader.jsx
import React from 'react';
import './ArcReactorLoader2.css';

export default function ArcReactorLoader2({ primaryColor = '#00bfff', coreColor = '#fff' }) {
  return (
    <div className="loader-container">
      <div className="arc-reactor" style={{ '--primary-color': primaryColor, '--core-color': coreColor }}>
        <div className="middle-ring"></div>
        <div className="core">
          <div className="segment"></div>
        </div>
        <div className="energy-wave"></div>
        <div className="energy-wave"></div>
        <div className="energy-wave"></div>
        {/* Added missing lines-container with 12 lines */}
        <div className="lines-container">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <div className="particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
      </div>
    </div>
  );
}