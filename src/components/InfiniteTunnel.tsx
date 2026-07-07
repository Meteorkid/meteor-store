'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

/**
 * 无限隧道背景：同心几何框向观者涌来，营造"进入工具矩阵"的纵深感。
 * 用于 CTA 区块；prefers-reduced-motion 时渲染静态同心框。
 */
export default function InfiniteTunnel() {
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

    const RINGS = 14;

    const drawRing = (z: number) => {
      const cx = canvas.width / 2, cy = canvas.height / 2;
      const s = Math.pow(z, 2.2) * Math.max(canvas.width, canvas.height) * 0.75;
      const hue = 265 + z * 50;
      ctx.strokeStyle = `hsla(${hue}, 80%, ${28 + z * 45}%, ${z * 0.85})`;
      ctx.lineWidth = 1 + z * 2;
      ctx.strokeRect(cx - s, cy - s * 0.55, s * 2, s * 1.1);
    };

    if (reducedMotion) {
      // 静态同心框
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 1; i <= RINGS; i++) drawRing(i / RINGS);
      window.removeEventListener('resize', resize);
      return;
    }

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(canvas);

    let t = 0;
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < RINGS; i++) {
        drawRing((i / RINGS + t) % 1);
      }
      t = (t + 0.0035) % 1;
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
      className="absolute inset-0 w-full h-full pointer-events-none opacity-70"
    />
  );
}
