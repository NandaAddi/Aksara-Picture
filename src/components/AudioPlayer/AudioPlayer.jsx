import React from 'react';
import { useAudio } from '../../context/AudioContext';

export default function AudioPlayer() {
  const {
    isPlaying,
    audioPlayerOpen,
    currTimeSec,
    durationSec,
    nextTrack,
    prevTrack,
    playPauseTrack,
    handleSeekChange,
    formatTime,
    currentTrack
  } = useAudio();

  return (
    <div 
      id="audio-widget" 
      className={`audio-widget ${audioPlayerOpen ? 'open' : ''} ${isPlaying ? 'playing' : ''}`}
    >
      <div className="audio-card">
        <div className="track-info">
          <div 
            className="track-art" 
            style={{ backgroundImage: `url('${currentTrack.image}')` }}
          />
          <div className="track-details">
            <div className="track-name">{currentTrack.name}</div>
            <div className="track-artist">{currentTrack.artist}</div>
          </div>
        </div>
        
        <div className="progress-container">
          <div className="time-display">{formatTime(currTimeSec)}</div>
          <input 
            type="range" 
            min="0" 
            max={durationSec || 100} 
            value={currTimeSec} 
            onChange={handleSeekChange}
            className="progress-bar" 
          />
          <div className="time-display">{formatTime(durationSec)}</div>
        </div>
        
        <div className="controls">
          <button className="control-btn" onClick={prevTrack}>
            <i className="fa-solid fa-backward-step"></i>
          </button>
          <button className="control-btn play-btn" onClick={playPauseTrack}>
            {isPlaying ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
          </button>
          <button className="control-btn" onClick={nextTrack}>
            <i className="fa-solid fa-forward-step"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
