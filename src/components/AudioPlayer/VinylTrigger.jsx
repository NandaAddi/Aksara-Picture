import React from 'react';
import { useAudio } from '../../context/AudioContext';

export default function VinylTrigger() {
  const { isPlaying, audioPlayerOpen, setAudioPlayerOpen } = useAudio();

  return (
    <div 
      className="audio-trigger" 
      onClick={() => setAudioPlayerOpen(!audioPlayerOpen)}
    >
      <div className="vinyl-spin"></div>
      <i className="fa-solid fa-music trigger-icon"></i>
    </div>
  );
}
