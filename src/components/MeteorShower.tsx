'use client';

import { useEffect, useRef } from 'react';
import { createFrameGuard, isLateNight, useReducedMotion } from '@/lib/motion';
import { showToast } from './EasterEggs';

interface Star {
  x: number; y: number; size: number; twinkle: number;
}
interface Meteor {
  x: number; y: number; vx: number; vy: number; life: number; hue: number; big?: boolean;
}
interface TrailDot {
  x: number; y: number; life: number;
}

/**
 * 流星雨背景：静态星空 + 随机流星 + 鼠标流星尾迹 + 许愿大流星。
 * 深夜（0-5点）流星减速 30%、色调偏暖；监听 meteor:burst 事件进入爆发模式（Konami/console 触发）。
 */
export default function MeteorShower() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return; // 安静模式：只留 CSS 渐变星空（见 return 的 fallback 层）

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const night = isLateNight();
    const speedScale = night ? 0.7 : 1;
    const baseHue = night ? 30 : 265; // 深夜偏暖橙
    const hueSpread = night ? 30 : 50;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const isMobile = window.innerWidth < 768;
    let starCount = isMobile ? 36 : 60;
    let burstUntil = 0;

    let stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.3 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
    }));
    const meteors: Meteor[] = [];
    const trail: TrailDot[] = [];

    // 帧率守卫：低端设备自动减星、停连发
    let degraded = false;
    const frameGuard = createFrameGuard(() => {
      degraded = true;
      starCount = Math.floor(starCount / 2);
      stars = stars.slice(0, starCount);
    });

    const spawnMeteor = (big = false) => {
      meteors.push({
        x: Math.random() * canvas.width * 1.3,
        y: -12,
        vx: -(2 + Math.random() * 3) * speedScale,
        vy: (2 + Math.random() * 2.5) * speedScale,
        life: 1,
        hue: baseHue + Math.random() * hueSpread,
        big,
      });
    };

    let spawnTimer: ReturnType<typeof setTimeout>;
    const scheduleSpawn = () => {
      const bursting = performance.now() < burstUntil;
      spawnTimer = setTimeout(() => {
        spawnMeteor();
        if (bursting) { spawnMeteor(); spawnMeteor(); }
        scheduleSpawn();
      }, bursting ? 90 : (degraded ? 1600 : 400 + Math.random() * 1200));
    };
    scheduleSpawn();

    // 爆发模式（Konami / meteor.secret()）
    const onBurst = () => { burstUntil = performance.now() + 6000; };
    window.addEventListener('meteor:burst', onBurst);

    // 鼠标尾迹 + 静止 10s 许愿流星
    let idleTimer: ReturnType<typeof setTimeout>;
    let wishActive = false;
    const rearmIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (wishActive) return;
        wishActive = true;
        spawnWishMeteor();
      }, 10_000);
    };
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      if (!degraded) trail.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, life: 1 });
      rearmIdle();
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rearmIdle();

    // 许愿大流星：DOM 层实现可点击 + 键盘可达
    const spawnWishMeteor = () => {
      const btn = document.createElement('button');
      btn.textContent = '☄ 许个愿？';
      btn.setAttribute('aria-label', '一颗大流星划过，点击许愿');
      btn.style.cssText = [
        'position:absolute', 'top:18%', 'right:-160px', 'z-index:20',
        'background:rgba(30,15,60,0.75)', 'border:1px solid rgba(196,181,253,0.4)',
        'color:#e9d5ff', 'font-size:13px', 'padding:6px 14px', 'border-radius:999px',
        'cursor:pointer', 'backdrop-filter:blur(4px)',
        'transition:right 3.2s cubic-bezier(.25,.5,.35,1), opacity .5s ease',
        'box-shadow:0 0 24px rgba(167,139,250,0.4)',
      ].join(';');
      btn.onclick = () => {
        showToast('愿望已记录：祝你和店主都心想事成 ☄', 5000);
        btn.remove();
        wishActive = false;
        rearmIdle();
      };
      canvas.parentElement?.appendChild(btn);
      requestAnimationFrame(() => { btn.style.right = 'calc(100% + 160px)'; });
      setTimeout(() => {
        btn.style.opacity = '0';
        setTimeout(() => {
          btn.remove();
          wishActive = false;
          rearmIdle();
        }, 500);
      }, 3400);
    };

    // 主循环（离屏暂停）
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(canvas);

    let raf = 0;
    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      frameGuard(now);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 星空
      stars.forEach(s => {
        s.twinkle += 0.03;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.25 + Math.sin(s.twinkle) * 0.2})`;
        ctx.fill();
      });

      // 鼠标尾迹
      for (let i = trail.length - 1; i >= 0; i--) {
        const d = trail[i];
        d.life -= 0.04;
        if (d.life <= 0) { trail.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.life * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${baseHue + 20},85%,75%,${d.life * 0.5})`;
        ctx.fill();
      }
      if (trail.length > 40) trail.splice(0, trail.length - 40);

      // 流星
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx; m.y += m.vy; m.life -= 0.007;
        const len = m.big ? 22 : 12;
        const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * len, m.y - m.vy * len);
        grad.addColorStop(0, `hsla(${m.hue},90%,78%,${m.life})`);
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.big ? 3 : 2;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * len, m.y - m.vy * len);
        ctx.stroke();
        if (m.life <= 0 || m.y > canvas.height + 30) meteors.splice(i, 1);
      }
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      clearTimeout(spawnTimer);
      clearTimeout(idleTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('meteor:burst', onBurst);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    // 安静模式：静态星空渐变，不动但依然好看
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 12% 28%, rgba(255,255,255,.5) 50%, transparent 50%),' +
            'radial-gradient(1.5px 1.5px at 68% 12%, rgba(255,255,255,.4) 50%, transparent 50%),' +
            'radial-gradient(1px 1px at 42% 64%, rgba(255,255,255,.35) 50%, transparent 50%),' +
            'radial-gradient(2px 2px at 85% 45%, rgba(196,181,253,.4) 50%, transparent 50%),' +
            'radial-gradient(1px 1px at 25% 82%, rgba(255,255,255,.3) 50%, transparent 50%)',
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.85 }}
    />
  );
}
