'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

interface Particle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  opacity: number;
  hue: number;
  /** 0=稳定轨道, 1=螺旋坠落中 */
  fallProgress: number;
  fallSpeed: number;
}

/**
 * 动态黑洞背景：吸积盘粒子环绕、光子环、事件视界辉光。
 * 用于 CTA 区块替代原 InfiniteTunnel；prefers-reduced-motion 时渲染静态环。
 */
export default function BlackHole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // --- 黑洞参数 ---
    const cx = () => W / 2;
    const cy = () => H / 2;
    const MAX_R = () => Math.min(W, H) * 0.42;
    const HORIZON_R = () => MAX_R() * 0.16;
    const PHOTON_R = () => MAX_R() * 0.22;

    // --- 生成粒子 ---
    const PARTICLE_COUNT = 180;
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = i / PARTICLE_COUNT;
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: HORIZON_R() * 1.2 + Math.pow(Math.random(), 0.6) * (MAX_R() - HORIZON_R() * 1.2),
        speed: 0.0008 + Math.random() * 0.004,
        size: 0.3 + Math.random() * 1.8,
        opacity: 0.15 + Math.random() * 0.55,
        hue: 260 + Math.random() * 60,
        fallProgress: 0,
        fallSpeed: 0.0002 + Math.random() * 0.001,
      });
    }

    // --- 静态渲染 ---
    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      drawEventHorizon();
      drawPhotonRing();
      for (const p of particles) {
        const x = cx() + Math.cos(p.angle) * p.radius;
        const y = cy() + Math.sin(p.angle) * p.radius * 0.55;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${p.opacity * 0.6})`;
        ctx.fill();
      }
    };

    if (reducedMotion) {
      drawStatic();
      window.removeEventListener('resize', resize);
      return;
    }

    // --- 绘制函数 ---
    const drawEventHorizon = () => {
      // 外层辉光（多层径向渐变）
      const r = HORIZON_R();
      for (let i = 4; i >= 0; i--) {
        const glowR = r * (1 + i * 0.7);
        const grad = ctx.createRadialGradient(cx(), cy(), r * 0.7, cx(), cy(), glowR);
        grad.addColorStop(0, 'rgba(0,0,0,1)');
        grad.addColorStop(0.5, `rgba(147,112,219,${0.06 - i * 0.01})`);
        grad.addColorStop(1, 'rgba(147,112,219,0)');
        ctx.beginPath();
        ctx.arc(cx(), cy(), glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      // 视界本体
      ctx.beginPath();
      ctx.arc(cx(), cy(), r, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();
    };

    const drawPhotonRing = () => {
      const r = PHOTON_R();
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx(), cy(), r, 0, Math.PI * 2);
      ctx.strokeStyle = 'hsla(280, 80%, 70%, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.shadowColor = 'hsla(280, 80%, 60%, 0.5)';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();
    };

    const drawParticle = (p: Particle, t: number) => {
      const r = p.radius * (1 - p.fallProgress * 0.85);
      if (r < HORIZON_R() * 1.05) return; // 坠入视界，消失

      const x = cx() + Math.cos(p.angle) * r;
      const y = cy() + Math.sin(p.angle) * r * 0.55;

      // 靠近视界时色温升高（红移→白热）
      const distRatio = (r - HORIZON_R()) / (MAX_R() - HORIZON_R());
      const hue = p.hue - (1 - distRatio) * 40;
      const saturation = 60 + (1 - distRatio) * 15;
      const lightness = 55 + (1 - distRatio) * 30;
      const alpha = p.opacity * Math.min(1, distRatio * 3);

      // 运动拖尾
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
      ctx.fill();

      // 粒子光晕
      if (p.size > 1.0 && distRatio < 0.4) {
        ctx.beginPath();
        ctx.arc(x, y, p.size * 2.5, 0, Math.PI * 2);
        const halo = ctx.createRadialGradient(x, y, 0, x, y, p.size * 2.5);
        halo.addColorStop(0, `hsla(${hue}, 70%, 80%, ${alpha * 0.5})`);
        halo.addColorStop(1, 'hsla(0,0%,0%,0)');
        ctx.fillStyle = halo;
        ctx.fill();
      }
      ctx.restore();
    };

    // --- 背景星场 ---
    const stars: { x: number; y: number; size: number; twinkle: number }[] = [];
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: 0.3 + Math.random() * 0.8,
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    const drawStars = (t: number) => {
      for (const s of stars) {
        const alpha = 0.2 + 0.3 * Math.sin(s.twinkle + t * 0.02);
        const dist = Math.hypot(s.x - cx(), s.y - cy());
        // 靠近黑洞的星光被引力透镜扭曲（位置偏移 + 亮度增强）
        const lensDist = dist / MAX_R();
        let lensX = s.x;
        let lensY = s.y;
        let lensAlpha = alpha;
        if (lensDist < 2.0) {
          const strength = Math.max(0, 1 - lensDist / 2) * 6;
          const dx = s.x - cx();
          const dy = s.y - cy();
          lensX += dx * strength * 0.02;
          lensY += dy * strength * 0.02;
          lensAlpha = Math.min(0.8, alpha + (1 - lensDist / 2) * 0.3);
        }
        ctx.beginPath();
        ctx.arc(lensX, lensY, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,210,255,${lensAlpha})`;
        ctx.fill();
      }
    };

    // --- 动画循环 ---
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(canvas);

    let time = 0;
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;

      ctx.clearRect(0, 0, W, H);
      drawStars(time);
      drawEventHorizon();
      drawPhotonRing();

      // 更新并绘制粒子
      for (const p of particles) {
        p.angle += p.speed;
        if (p.angle > Math.PI * 2) p.angle -= Math.PI * 2;

        // 随机触发螺旋坠落
        if (p.fallProgress <= 0 && Math.random() < 0.0003) {
          p.fallProgress = 0.001;
        }
        if (p.fallProgress > 0) {
          p.fallProgress += p.fallSpeed;
          if (p.fallProgress >= 1) {
            // 粒子被"吞没"后在远轨重生
            p.radius = HORIZON_R() * 1.5 + Math.pow(Math.random(), 0.6) * (MAX_R() - HORIZON_R() * 1.5);
            p.angle = Math.random() * Math.PI * 2;
            p.fallProgress = 0;
            p.speed = 0.0008 + Math.random() * 0.004;
          }
        }

        drawParticle(p, time);
      }

      time += 1;
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
