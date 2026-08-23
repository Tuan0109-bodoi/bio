import { useEffect } from 'react';
import '../styles/splash.css';

export default function VideoBackground({ isRevealed, videoRef, videoSrc = '/assets/video.mp4' }) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const forcePlay = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    forcePlay();

    // Resume if browser paused it (tab switch, etc.)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) forcePlay();
    });
    video.addEventListener('pause', forcePlay);

    return () => {
      document.removeEventListener('visibilitychange', forcePlay);
      video.removeEventListener('pause', forcePlay);
    };
  }, [videoRef]);

  return (
    <div className={`video-bg ${isRevealed ? 'revealed' : 'splash'}`}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}

