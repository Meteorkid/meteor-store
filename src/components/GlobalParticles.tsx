'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

export default function GlobalParticles() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = ref.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, connectR = 0, cursorR = 0;
    const isMobile = window.innerWidth < 768;
    const mouse = { x: 0, y: 0, active: false };

    type Star = { x: number; y: number; r: number; depth: number; phase: number; sp: number };
    type Dot = { x: number; y: number; vx: number; vy: number; r: number; hue: number };

    let stars: Star[] = [];
    let dots: Dot[] = [];

    function initStars() {
      const n = isMobile ? 60 : 120;
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        depth: Math.random(),
        phase: Math.random() * Math.PI * 2,
        sp: Math.random() * 1.5 + 0.5,
      }));
    }

    function initDots() {
      const n = isMobile ? 15 : 35;
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.8,
        hue: 260 + Math.random() * 60,
      }));
    }

    const resize = () => {
      const pW = W, pH = H;
      W = window.innerWidth * dpr;
      H = window.innerHeight * dpr;
      canvas.width = W;
      canvas.height = H;
      connectR = Math.min(W, H) * 0.13;
      cursorR = Math.min(W, H) * 0.2;
      initStars();
      if (pW > 0 && dots.length) {
        for (const d of dots) { d.x = (d.x / pW) * W; d.y = (d.y / pH) * H; }
      } else {
        initDots();
      }
    };
    resize();

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; mouse.active = true;
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      mouse.x = t.clientX * dpr; mouse.y = t.clientY * dpr; mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onTouch, { passive: true });
    document.addEventListener('touchend', onLeave);
    window.addEventListener('resize', resize);
    window.addEventListener('blur', onLeave);

    let raf = 0, lt = 0;
    const ctx = canvas.getContext('2d')!;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = lt ? Math.min((now - lt) / 16.67, 3) : 1;
      lt = now;
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);

      for (const s of stars) {
        const pf = s.depth * 20;
        const px = mouse.active ? (mouse.x / W - 0.5) * pf : 0;
        const py = mouse.active ? (mouse.y / H - 0.5) * pf : 0;
        const tw = 0.4 + 0.6 * Math.sin(t * s.sp + s.phase);
        ctx.beginPath();
        ctx.arc(s.x + px, s.y + py, s.r * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${tw * 0.45})`;
        ctx.fill();
      }

      for (const d of dots) {
        if (mouse.active) {
          const dx = mouse.x - d.x, dy = mouse.y - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < cursorR && dist > 5) {
            const f = (0.25 / dist) * dt;
            d.vx += dx * f; d.vy += dy * f;
          }
        }
        d.x += d.vx * dt; d.y += d.vy * dt;
        d.vx *= 0.985 ** dt; d.vy *= 0.985 ** dt;
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
      }

      if (!isMobile) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < dots.length; i++) {
          for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
            const d2 = dx * dx + dy * dy;
            if (d2 < connectR * connectR) {
              const d = Math.sqrt(d2);
              ctx.beginPath();
              ctx.moveTo(dots[i].x, dots[i].y);
              ctx.lineTo(dots[j].x, dots[j].y);
              ctx.strokeStyle = `rgba(139,92,246,${(1 - d / connectR) * 0.1})`;
              ctx.lineWidth = 0.6 * dpr;
              ctx.stroke();
            }
          }
        }
        if (mouse.active) {
          for (const d of dots) {
            const dx = mouse.x - d.x, dy = mouse.y - d.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < cursorR) {
              ctx.beginPath();
              ctx.moveTo(d.x, d.y); ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = `rgba(168,85,247,${(1 - dist / cursorR) * 0.2})`;
              ctx.lineWidth = 0.8 * dpr;
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 3 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${d.hue},70%,60%,0.04)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${d.hue},70%,72%,0.5)`;
        ctx.fill();
      }

      if (mouse.active) {
        const gr = 90 * dpr;
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, gr);
        g.addColorStop(0, 'rgba(139,92,246,0.07)');
        g.addColorStop(0.5, 'rgba(139,92,246,0.02)');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, gr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    frame(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onTouch);
      document.removeEventListener('touchend', onLeave);
      window.removeEventListener('resize', resize);
      window.removeEventListener('blur', onLeave);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
