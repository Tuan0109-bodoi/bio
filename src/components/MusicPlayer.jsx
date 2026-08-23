import { useState, useRef, useEffect, useCallback } from 'react';
import {
  SkipBack,
  Pause,
  Play,
  SkipForward,
} from '@phosphor-icons/react';
import '../styles/music-player.css';
import '../styles/tilt-glow.css';
import TiltGlowCard from './TiltGlowCard';

export default function MusicPlayer({ audioRef, isPlaying, togglePlay, coverUrl, songTitle }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(121); // 2:01 default

  const formatTime = useCallback((seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 121);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioRef]);


  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <TiltGlowCard className="player-bar-wrapper" intensity={6}>
        <div className="player-bar glass">
        <img
          className="player-cover"
          src={coverUrl}
          alt={songTitle}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect fill="%231a1a2e" width="48" height="48" rx="8"/><text x="24" y="28" text-anchor="middle" fill="%23666" font-size="10">♫</text></svg>';
          }}
        />

        <div className="player-info">
          <div className="player-title">
            {songTitle}
          </div>
          <div className="player-progress-wrapper">
            <span className="player-time">{formatTime(currentTime)}</span>
            <div className="progress-bar" onClick={handleProgressClick}>
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="player-time">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-controls">
          <button
            className="control-btn"
            aria-label="Previous"
            onClick={() => {
              if (audioRef.current) audioRef.current.currentTime = 0;
            }}
          >
            <SkipBack size={16} weight="fill" />
          </button>
          <button
            className="control-btn play-pause"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause size={20} weight="fill" />
            ) : (
              <Play size={20} weight="fill" />
            )}
          </button>
          <button
            className="control-btn"
            aria-label="Next"
          >
            <SkipForward size={16} weight="fill" />
          </button>
        </div>
        </div>
      </TiltGlowCard>
    </>
  );
}
