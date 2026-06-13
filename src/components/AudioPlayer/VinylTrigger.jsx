import React from 'react';
import { useAudio } from '../../context/AudioContext';

export default function VinylTrigger({ t }) {
  const { isPlaying, audioPlayerOpen, setAudioPlayerOpen } = useAudio();

  return (
    <button 
      className="audio-trigger" 
      onClick={() => setAudioPlayerOpen(!audioPlayerOpen)}
      aria-label={t ? t("aria-toggle-audio") : "Toggle audio player"}
      style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
    >
      <div className="vinyl-spin"></div>
      <i className="fa-solid fa-music trigger-icon"></i>
    </button>
  );
}
