export default function SplashScreen({ isHidden, onEnter }) {
  return (
    <div
      className={`splash-screen ${isHidden ? 'hidden' : ''}`}
      onClick={onEnter}
    >
      <div className="splash-username">
        <span className="icon">✦</span>
        <span>XiiO2</span>
        <span className="icon">⚙</span>
      </div>
      <div className="splash-hint">Click anywhere to enter</div>
    </div>
  );
}
