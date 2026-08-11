'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

export default function BlackHole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;
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

    const cx = () => W / 2;
    const cy = () => H / 2;
    const BH_R = () => Math.min(W, H) * 0.28;
    const PHOTON_R = () => BH_R() * 1.05;
    const DISK_INNER = () => BH_R() * 1.25;
    const DISK_OUTER = () => BH_R() * 2.8;
    const DISK_TILT = 0.35;

    // --- 背景星场 ---
    const STAR_COUNT = 250;
    interface Star { x: number; y: number; r: number; twinkle: number; baseBright: number }
    const stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.2 + Math.random() * 0.9,
        twinkle: Math.random() * Math.PI * 2,
        baseBright: 0.15 + Math.random() * 0.5,
      });
    }

    // --- 静态渲染 ---
    if (reducedMotion) {
      drawAll(0);
      window.removeEventListener('resize', resize);
      return;
    }

    // --- 动画 ---
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(canvas);

    let time = 0;
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      drawAll(time);
      time += 1;
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };

    // ===== 所有绘制函数定义在 useEffect 闭包内，ctx 已通过 null 检查 =====

    function drawAll(time: number) {
      ctx!.clearRect(0, 0, W, H);
      drawStarfield(time);
      drawAccretionDisk(time);
      drawEventHorizon();
      drawPhotonRing();
    }

    function drawStarfield(time: number) {
      for (const s of stars) {
        const dx = s.x - cx();
        const dy = s.y - cy();
        const dist = Math.sqrt(dx * dx + dy * dy);
        const lensZone = BH_R() * 1.3;
        let sx = s.x, sy = s.y;
        let alpha = s.baseBright + 0.2 * Math.sin(s.twinkle + time * 0.015);

        if (dist < lensZone * 2.5) {
          const strength = Math.max(0, 1 - dist / (lensZone * 2.5));
          const bend = strength * strength * lensZone * 0.3;
          const nx = dx / (dist || 1);
          const ny = dy / (dist || 1);
          sx -= nx * bend;
          sy -= ny * bend;
          if (dist < lensZone * 1.6 && dist > lensZone * 0.9) {
            alpha = Math.min(0.95, alpha + 0.3);
          }
        }
        if (sx < 0 || sx > W || sy < 0 || sy > H) continue;

        ctx!.beginPath();
        ctx!.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(200, 210, 240, ${alpha.toFixed(3)})`;
        ctx!.fill();
      }
    }

    function drawPhotonRing() {
      const r = PHOTON_R();
      for (let i = 3; i >= 0; i--) {
        const glowR = r + i * 2.5;
        const alpha = 0.5 - i * 0.12;
        ctx!.beginPath();
        ctx!.arc(cx(), cy(), glowR, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
        ctx!.lineWidth = 1.5 + i * 1.2;
        ctx!.shadowColor = `rgba(255, 255, 255, ${(0.6 - i * 0.15).toFixed(3)})`;
        ctx!.shadowBlur = 6 + i * 8;
        ctx!.stroke();
        ctx!.shadowBlur = 0;
      }
    }

    function drawAccretionDisk(_time: number) {
      const inner = DISK_INNER();
      const outer = DISK_OUTER();
      const rings = 60;

      for (let i = 0; i < rings; i++) {
        const t = i / rings;
        const r = inner + (outer - inner) * t;
        const radialBright = 1 - Math.pow(t, 0.35);
        const ringAlpha = radialBright * (0.08 + 0.04 * (1 - t));
        const rx = r;
        const ry = r * (1 - DISK_TILT);

        ctx!.beginPath();
        ctx!.ellipse(cx(), cy(), rx, ry, 0, 0, Math.PI * 2);

        const grad = ctx!.createLinearGradient(cx() - rx, cy(), cx() + rx, cy());
        const hotR = Math.min(255, 200 + 55 * radialBright);
        const hotG = Math.min(255, 170 + 60 * radialBright);
        const hotB = Math.min(255, 120 + 50 * radialBright);
        const coolR = Math.min(255, 140 + 40 * radialBright);
        const coolG = Math.min(255, 100 + 30 * radialBright);
        const coolB = Math.min(255, 60 + 20 * radialBright);

        grad.addColorStop(0, `rgba(${hotR},${hotG},${hotB},${ringAlpha.toFixed(3)})`);
        grad.addColorStop(0.35, `rgba(${Math.round((hotR+coolR)/2)},${Math.round((hotG+coolG)/2)},${Math.round((hotB+coolB)/2)},${(ringAlpha*0.6).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${coolR},${coolG},${coolB},${(ringAlpha*0.5).toFixed(3)})`);

        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 0.6 + (1 - t) * 1.6;
        ctx!.stroke();
      }

      // 引力透镜弧
      drawLensedArc(1);
      drawLensedArc(-1);
    }

    function drawLensedArc(side: number) {
      const r = BH_R() * 1.4;
      const arcSpan = Math.PI * 0.55;
      for (let layer = 0; layer < 8; layer++) {
        const layerR = r + layer * 4;
        const alpha = 0.18 - layer * 0.018;
        if (alpha <= 0) continue;
        const startAngle = side > 0 ? -Math.PI / 2 - arcSpan / 2 : Math.PI / 2 - arcSpan / 2;
        ctx!.beginPath();
        ctx!.ellipse(cx(), cy(), layerR, layerR * 0.4, 0, startAngle, startAngle + arcSpan);
        ctx!.strokeStyle = `rgba(220, 200, 160, ${alpha.toFixed(3)})`;
        ctx!.lineWidth = 1.2;
        ctx!.stroke();
      }
    }

    function drawEventHorizon() {
      const r = BH_R();
      const glow = ctx!.createRadialGradient(cx(), cy(), r, cx(), cy(), r * 1.25);
      glow.addColorStop(0, 'rgba(0,0,0,0)');
      glow.addColorStop(0.5, 'rgba(100,130,180,0.03)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx!.beginPath();
      ctx!.arc(cx(), cy(), r * 1.25, 0, Math.PI * 2);
      ctx!.fillStyle = glow;
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(cx(), cy(), r, 0, Math.PI * 2);
      ctx!.fillStyle = '#000000';
      ctx!.fill();
    }
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
