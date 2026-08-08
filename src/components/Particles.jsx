import { useMemo } from 'react';

export default function Particles({ count = 20 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${2 + Math.random() * 2}px`,
      duration: `${8 + Math.random() * 12}s`,
      delay: `${Math.random() * 10}s`,
      opacity: 0.3 + Math.random() * 0.5,
    }));
  }, [count]);

  return (
    <div className="particles">
      {particles.map(({ id, left, size, duration, delay, opacity }) => (
        <div
          key={id}
          className="particle"
          style={{
            left,
            width: size,
            height: size,
            animationDuration: duration,
            animationDelay: delay,
            opacity,
          }}
        />
      ))}
    </div>
  );
}
