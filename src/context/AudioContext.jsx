import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { playlist } from '../constants/staticData';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [audioPlayerOpen, setAudioPlayerOpen] = useState(false);
  const [currTimeSec, setCurrTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);

  const audioRef = useRef(null);

  if (!audioRef.current) {
    audioRef.current = new Audio();
  }

  // Manage audio play, pause, source load, and metadata
  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDurationSec(audio.duration);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    if (isPlaying) {
      // Lazy-load the src on first play or track change
      if (audio.src !== playlist[trackIndex].source) {
        audio.src = playlist[trackIndex].source;
        audio.load();
      }
      audio.play().catch(err => {
        console.log("Audio play error:", err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [trackIndex, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrTimeSec(audio.currentTime);
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const nextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const prevTrack = () => {
    setTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const playPauseTrack = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeekChange = (e) => {
    const val = Number(e.target.value);
    audioRef.current.currentTime = val;
    setCurrTimeSec(val);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return '0:00';
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    if (sec < 10) sec = `0${sec}`;
    return `${min}:${sec}`;
  };

  return (
    <AudioContext.Provider value={{
      isPlaying,
      setIsPlaying,
      trackIndex,
      setTrackIndex,
      audioPlayerOpen,
      setAudioPlayerOpen,
      currTimeSec,
      durationSec,
      nextTrack,
      prevTrack,
      playPauseTrack,
      handleSeekChange,
      formatTime,
      currentTrack: playlist[trackIndex]
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
