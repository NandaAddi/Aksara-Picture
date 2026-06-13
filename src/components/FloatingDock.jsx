import React from 'react';

export default function FloatingDock({ activeView, handleViewSwitch }) {
  return (
    <div className="dock-wrapper">
      <div className="glass-dock">
        <button 
          className={`dock-btn ${activeView === 'home-view' ? 'active' : ''}`} 
          onClick={() => handleViewSwitch('home-view')}
        >
          <i className="fa-solid fa-house"></i>
        </button>
        <button 
          className={`dock-btn ${activeView === 'about-view' ? 'active' : ''}`} 
          onClick={() => handleViewSwitch('about-view')}
        >
          <i className="fa-solid fa-user"></i>
        </button>
        <button 
          className={`dock-btn ${activeView === 'contact-view' ? 'active' : ''}`} 
          onClick={() => handleViewSwitch('contact-view')}
        >
          <i className="fa-solid fa-envelope"></i>
        </button>
      </div>
    </div>
  );
}
