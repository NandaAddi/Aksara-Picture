import React, { memo } from 'react';

function AboutView({ t, className }) {
  return (
    <div id="about-view" className={className}>
      <div className="glass-card">
        <h2 className="section-label">{t("about-label")}</h2>
        <p className="text-body" dangerouslySetInnerHTML={{ __html: t("about-text-1") }} />
        <p className="text-body">{t("about-text-2")}</p>
        <p className="text-body">{t("about-text-3")}</p>
        <h2 className="section-label" style={{ marginTop: '30px' }}>{t("service-label")}</h2>
        <div className="service-grid">
          <div className="service-item"><div className="dot"></div>Graduation</div>
          <div className="service-item"><div className="dot"></div>Wedding</div>
          <div className="service-item"><div className="dot"></div>Gathering</div>
          <div className="service-item"><div className="dot"></div>Travel</div>
        </div>
      </div>
    </div>
  );
}

export default memo(AboutView);
