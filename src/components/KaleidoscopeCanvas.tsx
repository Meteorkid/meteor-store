'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

/**
 * 万花筒镜面动画：粒子在多轴镜像下形成对称图形，404 页专用。
 * prefers-reduced-motion 时渲染静态对称图案。
 */
export default function KaleidoscopeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const SEGMENTS = 8;

    const drawSymmetric = (t: number) => {
      const cx = canvas.width / 2, cy = canvas.height / 2;
      const r = 60 + Math.sin(t * 1.7) * 40;
      const x = Math.cos(t) * r + Math.sin(t * 2.3) * 26;
      const y = Math.sin(t * 1.3) * r * 0.7;
      for (let s = 0; s < SEGMENTS; s++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((s / SEGMENTS) * Math.PI * 2);
        if (s % 2) ctx.scale(1, -1);
        const hue = 270 + Math.sin(t) * 40;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue},85%,68%,0.9)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x * 0.6 + 20, y * 0.6, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue + 40},85%,72%,0.7)`;
        ctx.fill();
        ctx.restore();
      }
    };

    if (reducedMotion) {
      // 静态图案：叠几个瞬间形成对称雪花
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let t = 0; t < 6; t += 0.3) drawSymmetric(t);
      window.removeEventListener('resize', resize);
      return;
    }

    let raf = 0;
    let t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawSymmetric(t);
      t += 0.018;
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
    />
  );
}
