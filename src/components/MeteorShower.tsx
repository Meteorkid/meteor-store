'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { createFrameGuard, isLateNight, useReducedMotion } from '@/lib/motion';
import { showToast } from './EasterEggs';

interface Star {
  x: number; y: number; size: number; twinkle: number;
}

/** 北斗七星（归一化 0..1 坐标）：流星雨夜空里偶尔浮现的一勺北斗，又缓缓隐去 */
const BEIDOU = [
  { x: 0.36, y: 0.12 }, // 天枢
  { x: 0.12, y: 0.34 }, // 天璇
  { x: 0.34, y: 0.62 }, // 天玑
  { x: 0.58, y: 0.42 }, // 天权
  { x: 0.76, y: 0.56 }, // 玉衡
  { x: 0.87, y: 0.70 }, // 开阳
  { x: 0.94, y: 0.85 }, // 摇光
];
/** 北斗连线：斗魁四边形 + 斗柄（索引指向 BEIDOU） */
const BEIDOU_LINKS: [number, number][] = [
  [1, 2], [2, 3], [3, 0], [0, 1], [3, 4], [4, 5], [5, 6],
];
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
  // 静默页面（后台、认证、法律、退款）不渲染
  const pathname = usePathname();
  const isQuiet = /^(?:\/[a-z]{2})?\/(?:admin|login|register|forgot-password|reset-password|verify-email|refund|terms|privacy|eula)/.test(pathname);
  if (isQuiet) return null;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const t = useTranslations('MeteorShower');
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);

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
      const wrapper = document.createElement('div');
      wrapper.setAttribute('role', 'button');
      wrapper.setAttribute('tabindex', '0');
      wrapper.setAttribute('aria-label', tRef.current('wishButtonAria'));
      wrapper.style.cssText = [
        'position:absolute', 'top:15%', 'right:-200px', 'z-index:20',
        'cursor:pointer', 'pointer-events:auto',
        'transition:right 3.6s cubic-bezier(.22,.5,.33,1), top 3.6s cubic-bezier(.22,.5,.33,1), opacity .4s ease',
      ].join(';');

      /* 流星尾迹 — 渐隐光带 */
      const tail = document.createElement('div');
      tail.style.cssText = [
        'position:absolute', 'right:0', 'top:50%',
        'width:120px', 'height:2px',
        'background:linear-gradient(90deg, transparent, rgba(196,181,253,0.15) 20%, rgba(167,139,250,0.6) 60%, rgba(232,225,255,0.9))',
        'border-radius:1px',
        'transform:translateY(-50%) rotate(-3deg)',
        'pointer-events:none',
      ].join(';');

      /* 流星尾迹光晕 — 更宽更淡的版本 */
      const tailGlow = document.createElement('div');
      tailGlow.style.cssText = [
        'position:absolute', 'right:0', 'top:50%',
        'width:140px', 'height:6px',
        'background:linear-gradient(90deg, transparent, rgba(139,92,246,0.08) 30%, rgba(167,139,250,0.25) 65%, rgba(196,181,253,0.4))',
        'border-radius:3px',
        'filter:blur(2px)',
        'transform:translateY(-50%) rotate(-3deg)',
        'pointer-events:none',
      ].join(';');

      /* 流星核 — 亮白紫光点 */
      const head = document.createElement('div');
      head.style.cssText = [
        'position:absolute', 'right:-3px', 'top:50%',
        'width:8px', 'height:8px',
        'border-radius:50%',
        'background:radial-gradient(circle, #f5f0ff 10%, #c4b5fd 40%, rgba(139,92,246,0.4) 70%, transparent 100%)',
        'box-shadow:0 0 12px 4px rgba(196,181,253,0.5), 0 0 24px 8px rgba(139,92,246,0.25)',
        'transform:translateY(-50%)',
        'animation:wish-head-pulse 1.6s ease-in-out infinite',
        'pointer-events:none',
      ].join(';');

      /* 文字标签 */
      const label = document.createElement('span');
      label.textContent = tRef.current('wishButtonText');
      label.style.cssText = [
        'position:absolute', 'right:12px', 'top:50%',
        'transform:translateY(-140%)',
        'font-size:12px', 'color:#e9d5ff',
        'white-space:nowrap',
        'text-shadow:0 0 8px rgba(167,139,250,0.5)',
        'pointer-events:none',
        'letter-spacing:0.04em',
      ].join(';');

      wrapper.appendChild(tailGlow);
      wrapper.appendChild(tail);
      wrapper.appendChild(head);
      wrapper.appendChild(label);

      wrapper.onclick = () => {
        showToast(tRef.current('wishRecorded'), 5000);
        wrapper.remove();
        wishActive = false;
        rearmIdle();
      };
      wrapper.onkeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showToast(tRef.current('wishRecorded'), 5000);
          wrapper.remove();
          wishActive = false;
          rearmIdle();
        }
      };

      canvas.parentElement?.appendChild(wrapper);
      requestAnimationFrame(() => {
        wrapper.style.right = 'calc(100% + 200px)';
        wrapper.style.top = '35%';
      });
      setTimeout(() => {
        wrapper.style.opacity = '0';
        setTimeout(() => {
          wrapper.remove();
          wishActive = false;
          rearmIdle();
        }, 400);
      }, 3600);
    };
    // 主循环（离屏暂停）
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(canvas);

    let raf = 0;
    // 北斗偶现状态机：正常时不打扰，隔一阵浮现一勺北斗又隐去
    let beidouStart = 0;
    let beidouNext = performance.now() + 18000 + Math.random() * 25000;
    const drawBeidou = (alpha: number) => {
      const pts = BEIDOU.map((b) => ({ x: b.x * canvas.width, y: b.y * canvas.height }));
      ctx.strokeStyle = `rgba(205,205,255,${0.5 * alpha})`;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      BEIDOU_LINKS.forEach(([a, b]) => {
        ctx.moveTo(pts[a].x, pts[a].y);
        ctx.lineTo(pts[b].x, pts[b].y);
      });
      ctx.stroke();
      BEIDOU.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, i === 0 ? 3.2 : 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,232,244,${alpha})`;
        ctx.fill();
      });
    };
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

      // 北斗偶现：淡入 → 停留 → 淡出
      if (now >= beidouNext && beidouStart === 0) beidouStart = now;
      if (beidouStart > 0) {
        const t = now - beidouStart;
        let alpha = 0;
        if (t < 1400) alpha = t / 1400;
        else if (t < 5200) alpha = 1;
        else if (t < 6600) alpha = 1 - (t - 5200) / 1400;
        else { alpha = 0; beidouStart = 0; beidouNext = now + 26000 + Math.random() * 30000; }
        if (alpha > 0) drawBeidou(alpha);
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
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.85 }}
    />
  );
}
