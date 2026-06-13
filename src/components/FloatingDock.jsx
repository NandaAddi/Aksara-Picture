import React from 'react';

export default function FloatingDock({ activeView, handleViewSwitch, t }) {
  return (
    <div className="dock-wrapper">
      <div className="glass-dock">
        <button 
          className={`dock-btn ${activeView === 'home-view' ? 'active' : ''}`} 
          onClick={() => handleViewSwitch('home-view')}
          aria-label={t("aria-home")}
        >
          <i className="fa-solid fa-house"></i>
        </button>
        <button 
          className={`dock-btn ${activeView === 'about-view' ? 'active' : ''}`} 
          onClick={() => handleViewSwitch('about-view')}
          aria-label={t("aria-about")}
        >
          <i className="fa-solid fa-user"></i>
        </button>
        <button 
          className={`dock-btn ${activeView === 'contact-view' ? 'active' : ''}`} 
          onClick={() => handleViewSwitch('contact-view')}
          aria-label={t("aria-contact")}
        >
          <i className="fa-solid fa-envelope"></i>
        </button>
      </div>
    </div>
  );
}
