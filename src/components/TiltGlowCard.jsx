import { useRef, useCallback } from 'react';

export default function TiltGlowCard({ children, className = '', glowColor = 'rgba(232, 160, 191, 0.5)', intensity = 12 }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    // Move glow to follow cursor
    if (glowRef.current) {
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      glowRef.current.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, ${glowColor}, transparent 60%)`;
    }
  }, [intensity, glowColor]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    if (glowRef.current) {
      glowRef.current.style.background = 'transparent';
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className={`tilt-glow-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="glow-border" />
      <div ref={glowRef} className="glow-follow" />
      <div className="tilt-glow-content">
        {children}
      </div>
    </div>
  );
}
