'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

export default function HeroCanvas({ className = '' }: { className?: string }) {
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
    type Trail = { x: number; y: number; a: number };
    type Streak = { x: number; y: number; vx: number; vy: number; life: number; len: number; hue: number };
    type Spark = { x: number; y: number; vx: number; vy: number; life: number; r: number; hue: number };

    let stars: Star[] = [];
    let dots: Dot[] = [];
    const trail: Trail[] = [];
    const streaks: Streak[] = [];
    const sparks: Spark[] = [];
    const rings: { x: number; y: number; r: number; a: number }[] = [];
    let nextStreak = 0;

    function initStars() {
      const n = isMobile ? 100 : 180;
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        depth: Math.random(),
        phase: Math.random() * Math.PI * 2,
        sp: Math.random() * 1.5 + 0.5,
      }));
    }

    function initDots() {
      const n = isMobile ? 25 : 55;
      dots = Array.from({ length: n }, () => ({
        x: W * 0.1 + Math.random() * W * 0.8,
        y: H * 0.1 + Math.random() * H * 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        hue: 260 + Math.random() * 60,
      }));
    }

    const resize = () => {
      const pW = W, pH = H;
      W = canvas.offsetWidth * dpr;
      H = canvas.offsetHeight * dpr;
      canvas.width = W;
      canvas.height = H;
      connectR = Math.min(W, H) * 0.12;
      cursorR = Math.min(W, H) * 0.18;
      initStars();
      if (pW > 0 && dots.length) {
        for (const d of dots) { d.x = (d.x / pW) * W; d.y = (d.y / pH) * H; }
      } else {
        initDots();
      }
    };
    resize();

    const bounds = () => canvas.getBoundingClientRect();
    const onMove = (e: MouseEvent) => {
      const r = bounds();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x >= 0 && x <= r.width && y >= 0 && y <= r.height) {
        mouse.x = x * dpr; mouse.y = y * dpr; mouse.active = true;
      } else {
        mouse.active = false;
      }
    };
    const onTouch = (e: TouchEvent) => {
      const r = bounds(), t = e.touches[0];
      const x = t.clientX - r.left, y = t.clientY - r.top;
      if (x >= 0 && x <= r.width && y >= 0 && y <= r.height) {
        mouse.x = x * dpr; mouse.y = y * dpr; mouse.active = true;
      }
    };
    const onLeave = () => { mouse.active = false; };
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a,button,input')) return;
      const r = bounds();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || x > r.width || y < 0 || y > r.height) return;
      const cx = x * dpr, cy = y * dpr;
      rings.push({ x: cx, y: cy, r: 0, a: 0.45 });
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
        sparks.push({
          x: cx, y: cy,
          vx: Math.cos(a) * (2 + Math.random() * 3),
          vy: Math.sin(a) * (2 + Math.random() * 3),
          life: 1, r: Math.random() * 2 + 1,
          hue: 265 + Math.random() * 45,
        });
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onTouch, { passive: true });
    document.addEventListener('touchend', onLeave);
    document.addEventListener('click', onClick);
    window.addEventListener('resize', resize);
    window.addEventListener('blur', onLeave);

    let visible = true;
    const obs = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    obs.observe(canvas);

    let raf = 0, lt = 0;
    const ctx = canvas.getContext('2d')!;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = lt ? Math.min((now - lt) / 16.67, 3) : 1;
      lt = now;
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);

      // Stars with parallax + twinkle
      for (const s of stars) {
        const pf = s.depth * 25;
        const px = mouse.active ? (mouse.x / W - 0.5) * pf : 0;
        const py = mouse.active ? (mouse.y / H - 0.5) * pf : 0;
        const tw = 0.4 + 0.6 * Math.sin(t * s.sp + s.phase);
        ctx.beginPath();
        ctx.arc(s.x + px, s.y + py, s.r * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${tw * 0.6})`;
        ctx.fill();
      }

      // Particle physics (gravity toward cursor)
      for (const d of dots) {
        if (mouse.active) {
          const dx = mouse.x - d.x, dy = mouse.y - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < cursorR && dist > 5) {
            const f = (0.3 / dist) * dt;
            d.vx += dx * f; d.vy += dy * f;
          }
        }
        d.x += d.vx * dt; d.y += d.vy * dt;
        d.vx *= 0.98 ** dt; d.vy *= 0.98 ** dt;
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
      }

      // Constellation connection lines (desktop only)
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
              ctx.strokeStyle = `rgba(139,92,246,${(1 - d / connectR) * 0.15})`;
              ctx.lineWidth = 0.7 * dpr;
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
              ctx.strokeStyle = `rgba(168,85,247,${(1 - dist / cursorR) * 0.28})`;
              ctx.lineWidth = 1 * dpr;
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      // Draw particles
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 3.5 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${d.hue},70%,60%,0.06)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${d.hue},70%,72%,0.6)`;
        ctx.fill();
      }

      // Cursor spotlight
      if (mouse.active) {
        const gr = 110 * dpr;
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, gr);
        g.addColorStop(0, 'rgba(139,92,246,0.1)');
        g.addColorStop(0.5, 'rgba(139,92,246,0.03)');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, gr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Mouse trail
      if (mouse.active) {
        trail.push({ x: mouse.x, y: mouse.y, a: 1 });
        while (trail.length > 30) trail.shift();
      }
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].a -= 0.028 * dt;
        if (trail[i].a <= 0) { trail.splice(i, 1); continue; }
        const p = trail[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, (p.a * 3 + 0.5) * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,85,247,${p.a * 0.4})`;
        ctx.fill();
      }

      // Shooting stars
      if (now > nextStreak) {
        nextStreak = now + 3000 + Math.random() * 5000;
        const top = Math.random() < 0.6;
        streaks.push({
          x: top ? Math.random() * W : W + 10,
          y: top ? -10 : Math.random() * H * 0.3,
          vx: top ? (Math.random() - 0.2) * 5 : -(4 + Math.random() * 3),
          vy: top ? 4 + Math.random() * 2 : 2 + Math.random() * 2,
          life: 1, len: 50 + Math.random() * 40,
          hue: 260 + Math.random() * 40,
        });
      }
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.x += s.vx * dt * dpr; s.y += s.vy * dt * dpr;
        s.life -= 0.011 * dt;
        if (s.life <= 0 || s.x < -200 || s.x > W + 200 || s.y > H + 200) {
          streaks.splice(i, 1); continue;
        }
        const sp = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        const tx = s.x - (s.vx / sp) * s.len * dpr;
        const ty = s.y - (s.vy / sp) * s.len * dpr;
        const sg = ctx.createLinearGradient(tx, ty, s.x, s.y);
        sg.addColorStop(0, 'transparent');
        sg.addColorStop(1, `hsla(${s.hue},80%,80%,${s.life * 0.7})`);
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = sg; ctx.lineWidth = 1.5 * dpr; ctx.lineCap = 'round'; ctx.stroke();
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue},90%,90%,${s.life})`;
        ctx.fill();
      }

      // Click burst particles
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx * dt * dpr; s.y += s.vy * dt * dpr;
        s.vx *= 0.95 ** dt; s.vy *= 0.95 ** dt;
        s.life -= 0.02 * dt;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * s.life * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue},80%,70%,${s.life * 0.7})`;
        ctx.fill();
      }

      // Click ripples
      for (let i = rings.length - 1; i >= 0; i--) {
        const rp = rings[i];
        rp.r += 2.5 * dt * dpr; rp.a -= 0.007 * dt;
        if (rp.a <= 0) { rings.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(139,92,246,${rp.a})`;
        ctx.lineWidth = 1.5 * dpr;
        ctx.stroke();
      }
    };

    frame(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onTouch);
      document.removeEventListener('touchend', onLeave);
      document.removeEventListener('click', onClick);
      window.removeEventListener('resize', resize);
      window.removeEventListener('blur', onLeave);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={ref}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
