import React, { useState, useEffect } from 'react';
import { slidesData } from '../constants/staticData';

export default function BackgroundSlider() {
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % slidesData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slider">
      {slidesData.map((slide, idx) => (
        <picture 
          key={idx}
          className={`slide-item ${idx === sliderIndex ? 'active' : ''}`}
        >
          <source media="(max-width: 768px)" srcSet={slide.mobile} />
          <img 
            src={slide.desktop} 
            alt={slide.alt} 
            loading={idx === 0 ? "eager" : "lazy"} 
            fetchPriority={idx === 0 ? "high" : "low"}
            className="slide-img" 
          />
        </picture>
      ))}
    </div>
  );
}
