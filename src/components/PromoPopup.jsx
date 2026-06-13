import React, { useState, useEffect } from 'react';

export default function PromoPopup({ isLoaded, popup, t }) {
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    // Show promo popup 1 second after preloader finishes
    const timer = setTimeout(() => {
      setShowPromo(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoaded]);

  const promoTag = popup?.tag || t("popup-tag");
  const promoTitle = popup?.title || t("popup-title");
  const promoDesc = popup?.description || t("popup-desc");
  const promoImg = popup?.image_url || '/end year.webp';

  return (
    <div id="promo-popup" className={showPromo ? 'show' : ''}>
      <div className="popup-glass">
        <button className="close-icon" onClick={() => setShowPromo(false)} aria-label={t("aria-close")}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="popup-visual" style={{ backgroundImage: `url('${promoImg}')` }}>
          <div className="popup-tag">{promoTag}</div>
        </div>
        <div className="popup-body">
          <h3 className="popup-h">{promoTitle}</h3>
          <p className="popup-p">{promoDesc}</p>
        </div>
      </div>
    </div>
  );
}
