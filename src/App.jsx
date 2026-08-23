import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoBackground from './components/VideoBackground';
import SplashScreen from './components/SplashScreen';
import ProfileCard from './components/ProfileCard';
import MusicPlayer from './components/MusicPlayer';
import SoundToggle from './components/SoundToggle';
import Particles from './components/Particles';
import FairyDustCursor from './components/FairyDustCursor';
import KuromiCursor from './components/KuromiCursor';
import { supabase } from './lib/supabaseClient';

export default function App() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loadStatus, setLoadStatus] = useState('loading'); // loading | found | not-found
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setLoadStatus('loading');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .eq('status', 'approved')
        .maybeSingle();

      if (cancelled) return;

      if (error || !data) {
        setLoadStatus('not-found');
        return;
      }

      setProfile(data);
      setLoadStatus('found');
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [username]);

  useEffect(() => {
    if (profile?.display_name) {
      document.title = profile.display_name;
    }
  }, [profile]);

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

  if (loadStatus === 'loading') {
    return <div className="status-screen">Đang tải...</div>;
  }

  if (loadStatus === 'not-found') {
    return (
      <div className="status-screen">
        Không tìm thấy trang của "{username}".
      </div>
    );
  }

  const audioSrc = profile.audio_url || '/assets/nhac.mp4';
  const videoSrc = profile.video_url || '/assets/video.mp4';

  return (
    <>
      <audio ref={audioRef} src={audioSrc} preload="metadata" loop />
      <VideoBackground isRevealed={isRevealed} videoRef={videoRef} videoSrc={videoSrc} />
      <Particles count={25} />
      <FairyDustCursor />
      <KuromiCursor size={40} />
      <SplashScreen isHidden={isRevealed} onEnter={handleEnter} displayName={profile.display_name} />
      <div className={`main-layout ${isRevealed ? 'visible' : ''}`}>
        <ProfileCard profile={profile} />
        <MusicPlayer
          audioRef={audioRef}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          coverUrl={profile.avatar_url || '/assets/anh_chinh.jpg'}
          songTitle={profile.song_title || 'Untitled'}
        />
      </div>
      <SoundToggle
        isVisible={isRevealed}
        isMuted={!isPlaying}
        onToggle={togglePlay}
      />
    </>
  );
}
