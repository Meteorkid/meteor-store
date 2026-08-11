'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

/**
 * 帮助中心专用星场背景
 * 比全站 GlobalParticles 更安静：星点更小、连线更淡、无鼠标交互、
 * 模拟深空星图的沉浸感。
 */
export default function HelpCosmicBg() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = ref.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;

    type Star = {
      x: number; y: number; r: number;
      twinkleSpeed: number; twinklePhase: number;
      hue: number;
    };

    let stars: Star[] = [];

    function initStars() {
      const n = Math.min(80, Math.floor((W * H) / 18000));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 0.8 + 0.15,
        twinkleSpeed: Math.random() * 0.8 + 0.2,
        twinklePhase: Math.random() * Math.PI * 2,
        hue: 240 + Math.random() * 80, // 蓝紫到紫
      }));
    }

    const resize = () => {
      W = window.innerWidth * dpr;
      H = window.innerHeight * dpr;
      canvas.width = W;
      canvas.height = H;
      initStars();
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    const ctx = canvas.getContext('2d')!;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);

      // 极淡的底色，让星星更明显
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, 0, W, H);

      for (const s of stars) {
        const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(t * s.twinkleSpeed + s.twinklePhase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue},50%,70%,${twinkle * 0.5})`;
        ctx.fill();
      }

      // 偶尔画出星点间的微弱连线（模拟星座碎片）
      for (let i = 0; i < stars.length; i += 7) {
        for (let j = i + 1; j < stars.length && j < i + 7; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 * dpr) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${(1 - dist / (150 * dpr)) * 0.06})`;
            ctx.lineWidth = 0.4 * dpr;
            ctx.stroke();
          }
        }
      }
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
