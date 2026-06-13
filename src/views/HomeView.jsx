import React from 'react';

export default function HomeView({ lang, links, loadingLinks, sharePage, t, className }) {
  return (
    <div id="home-view" className={className}>
      <div className="brand-header">
        <div className="logo-box">
          <img src="/assets/img/382339732_968167470924802_1926347205479482034_n.jpg" alt="Aksara Picture Logo - Jasa Foto Wisuda Malang Surabaya Kediri" className="logo-img" />
        </div>
        <h1 className="agency-name">
          Aksara Picture
          <span className="visually-hidden"> - Jasa Foto Wisuda Malang, Surabaya, Kediri</span>
        </h1>
        <p className="agency-tagline">{t("tagline")}</p>
      </div>

      <div className="menu-list">
        {loadingLinks ? (
          <div style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', padding: '20px' }}>
            <i className="fa-solid fa-circle-notch fa-spin"></i> Loading links...
          </div>
        ) : links.length === 0 ? (
          <p style={{ color: 'white' }}>Database KOSONG (Belum ada link).</p>
        ) : (
          links.map((link) => {
            const labelText = lang === 'id' ? link.label_id : link.label_en;
            return (
              <a key={link.id} href={link.url} className="glass-btn" target="_blank" rel="noopener noreferrer">
                <span className="btn-label">{labelText}</span>
                <i className={`${link.icon} btn-icon-right`}></i>
              </a>
            );
          })
        )}

        {/* Share Profile button */}
        {!loadingLinks && (
          <>
            <button className="glass-btn" onClick={sharePage} style={{ fontFamily: 'inherit' }}>
              <span className="btn-label">{t("btn-share")}</span>
              <i className="fa-solid fa-arrow-up-from-bracket btn-icon-right"></i>
            </button>
            <p className="agency-tagline">#rollingwithaksara</p>
          </>
        )}
      </div>
    </div>
  );
}
