import { SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';

export default function SoundToggle({ isVisible, isMuted, onToggle }) {
  return (
    <button
      className={`sound-toggle ${isVisible ? 'visible' : ''}`}
      onClick={onToggle}
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? (
        <SpeakerSlash size={18} weight="bold" />
      ) : (
        <SpeakerHigh size={18} weight="bold" />
      )}
    </button>
  );
}
