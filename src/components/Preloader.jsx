import React from 'react';

export default function Preloader({ isLoaded }) {
  if (isLoaded) return null;

  return (
    <div id="preloader">
      <div className="preloader-logo-box">
        <img src="/assets/img/preloader.svg" alt="Aksara Picture Preloader Logo" className="preloader-img" />
      </div>
      <div className="loading-line-wrapper">
        <div className="loading-line"></div>
      </div>
    </div>
  );
}
