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

  const { links, loadingLinks, popup } = useSupabase();

  // Translation helper
  const t = (key) => {
    return translations[lang]?.[key] || key;
  };

  // Preloader delay
  useEffect(() => {
    document.body.classList.remove('loaded');
    const timer = setTimeout(() => {
      setIsLoaded(true);
      document.body.classList.add('loaded');
    }, 1500);
    return () => clearTimeout(timer);
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
      <FloatingDock activeView={activeView} handleViewSwitch={handleViewSwitch} />

      {/* 11. AUDIO PLAYER & TRIGGER */}
      <AudioPlayer />
      <VinylTrigger />
    </AudioProvider>
  );
}
