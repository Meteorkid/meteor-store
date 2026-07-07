'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

/** 支付成功页的一次性流星彩带：挂载后播放约 3 秒，不循环 */
export default function MeteorConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.4,
      vx: (Math.random() - 0.5) * 2.5,
      vy: 2.5 + Math.random() * 3.5,
      hue: [265, 290, 320, 45][Math.floor(Math.random() * 4)],
      len: 8 + Math.random() * 14,
    }));

    const start = performance.now();
    let raf = 0;
    const animate = (now: number) => {
      const elapsed = now - start;
      if (elapsed > 3200) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
      raf = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const fade = elapsed > 2400 ? 1 - (elapsed - 2400) / 800 : 1;
      pieces.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        const grad = ctx.createLinearGradient(p.x, p.y, p.x - p.vx * p.len, p.y - p.vy * p.len);
        grad.addColorStop(0, `hsla(${p.hue},85%,72%,${fade})`);
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * p.len, p.y - p.vy * p.len);
        ctx.stroke();
      });
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-40"
    />
  );
}
