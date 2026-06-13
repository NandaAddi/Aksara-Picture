import React, { useState, useEffect, useRef } from 'react';

export default function WhatsAppNotif({ isLoaded }) {
  const [showNotif, setShowNotif] = useState(false);
  const notifSoundRef = useRef(null);

  useEffect(() => {
    if (!isLoaded) return;

    // WhatsApp notification timer (5 seconds)
    const notifTimer = setTimeout(() => {
      setShowNotif(true);
      // Play notification sound
      if (notifSoundRef.current) {
        notifSoundRef.current.play().catch(e => console.log("Sound autoplay blocked:", e));
      }
      // Hide automatically after 3 seconds
      const hideNotifTimer = setTimeout(() => {
        setShowNotif(false);
      }, 3000);
      return () => clearTimeout(hideNotifTimer);
    }, 5000);

    return () => clearTimeout(notifTimer);
  }, [isLoaded]);

  return (
    <>
      <a 
        href="https://www.whatsapp.com/catalog/62881026774401/?app_absent=0" 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`ios-notification ${showNotif ? 'show' : ''}`}
      >
        <div className="notif-header">
          <div className="notif-app-info">
            <div className="notif-icon-box">
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <span className="notif-app-name">WhatsApp</span>
          </div>
          <span className="notif-time">now</span>
        </div>
        <div className="notif-content">
          <h4 className="notif-title">Aksara Picture</h4>
          <p className="notif-message">Hei Aksara sudah siap ngefotoin momen wisudamu loo..</p>
        </div>
      </a>
      <audio 
        ref={notifSoundRef} 
        id="notif-sound" 
        src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" 
        preload="auto"
      ></audio>
    </>
  );
}
