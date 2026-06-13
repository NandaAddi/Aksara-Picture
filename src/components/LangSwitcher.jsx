import React from 'react';

export default function LangSwitcher({ lang, setLang }) {
  return (
    <div className="lang-switch">
      <button 
        className={`lang-btn ${lang === 'id' ? 'active' : ''}`} 
        onClick={() => setLang('id')}
      >
        ID
      </button>
      <button 
        className={`lang-btn ${lang === 'en' ? 'active' : ''}`} 
        onClick={() => setLang('en')}
      >
        EN
      </button>
    </div>
  );
}
