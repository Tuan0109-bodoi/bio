import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 30;
const COLORS = [
  'rgba(232, 160, 191, 0.9)',
  'rgba(200, 140, 255, 0.8)',
  'rgba(255, 200, 220, 0.85)',
  'rgba(180, 160, 255, 0.7)',
  'rgba(255, 255, 255, 0.6)',
];

function createParticle(x, y) {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 1.5 + 0.5;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 1,
    life: 1,
    decay: Math.random() * 0.01 + 0.005, // Lower decay means longer life
    size: Math.random() * 4 + 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 8,
    shape: Math.random() > 0.5 ? 'circle' : 'star',
  };
}

function drawStar(ctx, cx, cy, size, rotation) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotation * Math.PI) / 180);
  const spikes = 4;
  const outerR = size;
  const innerR = size * 0.4;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (Math.PI / spikes) * i - Math.PI / 2;
    if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.restore();
}

export default function FairyDustCursor() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameRef.current++;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const px = prevMouseRef.current.x;
      const py = prevMouseRef.current.y;
      const dx = mx - px;
      const dy = my - py;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Spawn particles based on cursor speed
      if (speed > 2 && frameRef.current % 2 === 0) {
        const count = Math.min(Math.floor(speed / 4) + 1, 4);
        for (let i = 0; i < count; i++) {
          if (particlesRef.current.length < PARTICLE_COUNT) {
            const offsetX = (Math.random() - 0.5) * 10;
            const offsetY = (Math.random() - 0.5) * 10;
            particlesRef.current.push(createParticle(mx + offsetX, my + offsetY));
          }
        }
      }

      prevMouseRef.current = { x: mx, y: my };

      // Update & draw
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03; // gentle gravity
        p.vx *= 0.99;
        p.life -= p.decay;
        p.rotation += p.rotationSpeed;

        if (p.life <= 0) return false;

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;

        if (p.shape === 'star') {
          drawStar(ctx, p.x, p.y, p.size * p.life, p.rotation);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fill();
        }

        // Glow
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6 * p.life;
        ctx.fill();
        ctx.shadowBlur = 0;

        return true;
      });

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  );
}
