import React, { useState, useEffect } from 'react';
import { translations } from './constants/translations';
import { useSupabase } from './hooks/useSupabase';
import { supabase } from './supabase';
import { AudioProvider } from './context/AudioContext';

// Components
import Preloader from './components/Preloader';
import LangSwitcher from './components/LangSwitcher';
import WhatsAppNotif from './components/WhatsAppNotif';
import PromoPopup from './components/PromoPopup';
import BackgroundSlider from './components/BackgroundSlider';
import FloatingDock from './components/FloatingDock';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import VinylTrigger from './components/AudioPlayer/VinylTrigger';

// Views
import HomeView from './views/HomeView';
import AboutView from './views/AboutView';
import ContactView from './views/ContactView';

export default function App() {
  const [lang, setLang] = useState('id');
  const [activeView, setActiveView] = useState('home-view');
  const [exitingView, setExitingView] = useState(null);
  const [enteringView, setEnteringView] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [redirectState, setRedirectState] = useState({
    isRedirecting: false,
    statusText: 'Connecting',
    progressWidth: '0%',
    isError: false
  });

  const { links, loadingLinks, popup } = useSupabase();

  // Translation helper
  const t = (key) => {
    return translations[lang]?.[key] || key;
  };

  // Preloader delay and shortlink detection
  useEffect(() => {
    const path = window.location.pathname;
    let slug = path.substring(1).replace(/\/$/, "");
    
    if (!slug || slug === 'index.html' || slug.includes('.')) {
      // Normal Linkbio site load
      document.body.classList.remove('loaded');
      const timer = setTimeout(() => {
        setIsLoaded(true);
        document.body.classList.add('loaded');
      }, 1500);
      return () => clearTimeout(timer);
    }

    // Shortlink redirect mode!
    setRedirectState(prev => ({ ...prev, isRedirecting: true }));
    
    // Initial progress line animation
    const progressTimer = setTimeout(() => {
      setRedirectState(prev => ({ ...prev, progressWidth: '30%', statusText: 'Locating...' }));
    }, 50);

    const resolveRedirect = async () => {
      try {
        const { data, error } = await supabase
          .from('shortlinks')
          .select('original_url, clicks, id')
          .eq('slug', slug)
          .single();

        if (error || !data || !data.original_url) {
          throw new Error('Link not found');
        }

        setRedirectState(prev => ({ ...prev, progressWidth: '100%', statusText: 'Redirecting...' }));

        // Increment clicks in background
        supabase
          .from('shortlinks')
          .update({ clicks: (data.clicks || 0) + 1 })
          .eq('id', data.id)
          .then();

        setTimeout(() => {
          window.location.replace(data.original_url);
        }, 800);

      } catch (err) {
        console.error('Redirect error:', err);
        setRedirectState(prev => ({ ...prev, progressWidth: '100%', statusText: 'Link Not Found', isError: true }));
        
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    };

    resolveRedirect();

    return () => clearTimeout(progressTimer);
  }, []);

  // Toast utility
  const triggerToast = (msg) => {
    setToast({ show: true, message: msg });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '' });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // View switcher logic
  const handleViewSwitch = (viewId) => {
    if (viewId === activeView) return;
    if (exitingView || enteringView) return; // Prevent rapid clicking overlaps

    setExitingView(activeView);
    setEnteringView(viewId);
    setActiveView(viewId);

    setTimeout(() => {
      setExitingView(null);
    }, 500);

    setTimeout(() => {
      setEnteringView(null);
    }, 950);
  };

  const sharePage = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast(t("toast-copy"));
  };

  const handleContactSubmit = async (formData) => {
    triggerToast(t("toast-booking-submitting"));
    
    try {
      // Try to save to Supabase "bookings" table
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            name: formData.name,
            graduation_date: formData.date,
            package_choice: formData.package,
            campus: formData.campus,
            created_at: new Date().toISOString()
          }
        ]);
        
      if (error) {
        console.warn("Supabase booking insert warning:", error.message);
      }
    } catch (err) {
      console.warn("Failed saving booking to Supabase:", err);
    }
    
    // Trigger success toast
    triggerToast(t("toast-booking-success"));
    
    // Construct WhatsApp message
    const isEn = lang === 'en';
    const message = isEn 
      ? `Hello Aksara Picture! I would like to book a graduation photo package:
- Name: ${formData.name}
- Graduation Date: ${formData.date}
- Package: ${formData.package}
- Campus: ${formData.campus}

Please let me know the schedule and slot availability. Thank you!`
      : `Halo Aksara Picture! Saya ingin booking paket foto wisuda:
- Nama: ${formData.name}
- Tanggal Wisuda: ${formData.date}
- Pilihan Paket: ${formData.package}
- Kampus: ${formData.campus}

Mohon info jadwal dan ketersediaan slotnya ya. Terima kasih!`;

    // Wait a brief moment to show the success toast, then open WhatsApp in a new tab
    setTimeout(() => {
      window.open(`https://wa.me/62881026774401?text=${encodeURIComponent(message)}`, '_blank');
    }, 1000);
  };

  const getViewClassName = (viewId) => {
    let classes = 'view-section';
    if (viewId === activeView || viewId === exitingView) {
      classes += ' active';
    }
    if (viewId === enteringView) {
      classes += ' entering';
    }
    if (viewId === exitingView) {
      classes += ' exiting';
    }
    return classes;
  };

  if (redirectState.isRedirecting) {
    return (
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: '#000000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
          color: '#ffffff'
        }}
      >
        <style>{`
          @keyframes premiumPulse {
            0% {
              transform: scale(0.95);
              filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.15));
              opacity: 0.8;
            }
            100% {
              transform: scale(1.05);
              filter: drop-shadow(0 0 30px rgba(212, 175, 55, 0.6));
              opacity: 1;
            }
          }
          .animate-pulse-premium {
            animation: premiumPulse 1.5s ease-in-out infinite alternate;
          }
        `}</style>

        {/* Premium Dark Radial Glow */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(20,20,20,0.8) 0%, #000000 80%)',
            pointerEvents: 'none'
          }}
        />
        
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Pulsating Logo SVG */}
          <div className="animate-pulse-premium" style={{ width: '180px', height: '72px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s' }}>
            <img 
              src="/assets/img/preloader.svg" 
              alt="Aksara Picture Preloader Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
            {/* Status text */}
            <p 
              style={{
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                fontWeight: 600,
                transition: 'color 0.3s',
                color: redirectState.isError ? '#ef4444' : redirectState.statusText === 'Redirecting...' ? '#d4af37' : '#9ca3af'
              }}
            >
              {redirectState.statusText}
            </p>

            {/* Thin premium loading line */}
            <div style={{ width: '140px', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden', position: 'relative' }}>
              <div 
                style={{
                  width: redirectState.progressWidth,
                  height: '100%',
                  transition: 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)',
                  backgroundColor: redirectState.isError ? '#ef4444' : '#d4af37',
                  boxShadow: redirectState.isError ? 'none' : '0 0 10px rgba(212,175,55,0.4)'
                }}
              />
            </div>
          </div>
        </div>
        
        <div style={{ position: 'absolute', bottom: '32px', fontSize: '9px', color: 'rgba(255, 255, 255, 0.3)', letterSpacing: '0.3em', textTransform: 'uppercase', zIndex: 10 }}>
          Secure Redirect
        </div>
      </div>
    );
  }

  return (
    <AudioProvider>
      {/* 1. PRELOADER */}
      <Preloader isLoaded={isLoaded} />

      {/* 2. LANGUAGE SWITCHER */}
      <LangSwitcher lang={lang} setLang={setLang} />

      {/* 3. IOS NOTIFICATION */}
      <WhatsAppNotif isLoaded={isLoaded} />

      {/* 4. PROMO POPUP */}
      <PromoPopup isLoaded={isLoaded} popup={popup} t={t} />

      {/* 5. BACKGROUND SLIDER */}
      <BackgroundSlider />

      {/* 6. OVERLAY */}
      <div className="overlay"></div>

      {/* 7. TOAST */}
      <div id="toast" className={toast.show ? 'show' : ''}>{toast.message}</div>

      {/* 8. MAIN VIEW CONTAINER */}
      <div className="main-container">
        {/* HOME VIEW */}
        <HomeView 
          lang={lang} 
          links={links} 
          loadingLinks={loadingLinks} 
          sharePage={sharePage} 
          t={t} 
          className={getViewClassName('home-view')} 
        />

        {/* ABOUT VIEW */}
        <AboutView 
          t={t} 
          className={getViewClassName('about-view')} 
        />

        {/* CONTACT VIEW */}
        <ContactView 
          t={t} 
          className={getViewClassName('contact-view')} 
          handleContactSubmit={handleContactSubmit} 
        />
      </div>

      {/* 9. COPYRIGHT */}
      <div className="copyright">© 2026 Aksarapicture.mlg</div>

      {/* 10. FLOATING DOCK */}
      <FloatingDock activeView={activeView} handleViewSwitch={handleViewSwitch} t={t} />

      {/* 11. AUDIO PLAYER & TRIGGER */}
      <AudioPlayer t={t} />
      <VinylTrigger t={t} />
    </AudioProvider>
  );
}
