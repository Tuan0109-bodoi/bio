import { useState, useRef, useCallback, useEffect } from 'react';
import VideoBackground from './components/VideoBackground';
import SplashScreen from './components/SplashScreen';
import ProfileCard from './components/ProfileCard';
import MusicPlayer from './components/MusicPlayer';
import SoundToggle from './components/SoundToggle';
import Particles from './components/Particles';
import FairyDustCursor from './components/FairyDustCursor';
import KuromiCursor from './components/KuromiCursor';

export default function App() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const handleEnter = useCallback(() => {
    setIsRevealed(true);
    // Auto-play music when entering
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src="/assets/nhac.mp4" preload="metadata" loop />
      <VideoBackground isRevealed={isRevealed} videoRef={videoRef} />
      <Particles count={25} />
      <FairyDustCursor />
      <KuromiCursor size={40} />
      <SplashScreen isHidden={isRevealed} onEnter={handleEnter} />
      <div className={`main-layout ${isRevealed ? 'visible' : ''}`}>
        <ProfileCard />
        <MusicPlayer audioRef={audioRef} isPlaying={isPlaying} togglePlay={togglePlay} />
      </div>
      <SoundToggle
        isVisible={isRevealed}
        isMuted={!isPlaying}
        onToggle={togglePlay}
      />
    </>
  );
}
