'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';
import { attractParticle, createParticles, createParticleSprites, homeParticleOpacity, particleAlpha, particleDrift, releaseParticleSprites } from '@/lib/home-sky/particles';
import { useOptionalSiteTheme } from '../theme/ThemeProvider';

const FRAME_INTERVAL = 1000 / 30;
const DESKTOP_COUNT = 460;
const MOBILE_COUNT = 260;

/** 首页纵向粒子层：固定视口，滚过 Hero 后出现，黑洞接近时退场。 */
export default function HomePageParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useOptionalSiteTheme()?.theme ?? 'nebula';
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (theme === 'classic') return;
    const element = canvasRef.current;
    const context = element?.getContext('2d');
    if (!element || !context) return;
    const canvasElement: HTMLCanvasElement = element;
    const drawingContext: CanvasRenderingContext2D = context;

    const doc = canvasElement.ownerDocument;
    const win = doc.defaultView ?? window;
    const allParticles = createParticles();
    const sprites = createParticleSprites(doc);
    const pointer = { x: 0, y: 0, strength: 0, targetX: 0, targetY: 0, targetStrength: 0 };
    let particles = allParticles;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let scrollY = win.scrollY;
    let heroBottom = 0;
    let blackHoleTop = Number.POSITIVE_INFINITY;
    let sceneTime = 0;
    let lastPaint = -Infinity;
    let lastFrame = 0;
    let frame = 0;
    let disposed = false;

    function opacity(): number {
      return homeParticleOpacity(scrollY, heroBottom, blackHoleTop, win.innerHeight);
    }

    function measure(): void {
      const bounds = canvasElement.getBoundingClientRect();
      width = Math.max(0, bounds.width);
      height = Math.max(0, bounds.height);
      dpr = Math.min(win.devicePixelRatio || 1, 2);
      canvasElement.width = Math.round(width * dpr);
      canvasElement.height = Math.round(height * dpr);
      particles = allParticles.slice(0, width < 621 ? MOBILE_COUNT : DESKTOP_COUNT);
      const hero = doc.querySelector('[data-home-celestial]');
      heroBottom = hero ? hero.getBoundingClientRect().bottom + win.scrollY : 0;
      const end = doc.querySelector('[data-home-particle-end]');
      blackHoleTop = end ? end.getBoundingClientRect().top + win.scrollY : Number.POSITIVE_INFINITY;
      draw(true);
    }

    function draw(force = false): void {
      if (disposed || width <= 0 || height <= 0) return;
      const now = win.performance.now();
      if (!force && now - lastPaint < FRAME_INTERVAL) return;
      lastPaint = now;
      const visibility = opacity();
      canvasElement.style.opacity = String(visibility);
      drawingContext.setTransform(1, 0, 0, 1, 0, 0);
      drawingContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
      if (visibility <= .001) return;

      const ease = reducedMotion ? 1 : .28;
      pointer.x += (pointer.targetX - pointer.x) * ease;
      pointer.y += (pointer.targetY - pointer.y) * ease;
      pointer.strength += (pointer.targetStrength - pointer.strength) * (reducedMotion ? 1 : .2);
      const radius = width < 621 ? 118 : 200;
      const strength = width < 621 ? 32 : 56;
      const wrap = height + 120;
      const scrollOffset = scrollY * .07;
      drawingContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawingContext.globalCompositeOperation = 'lighter';
      for (const particle of particles) {
        const sprite = sprites[particle.colorIndex];
        if (!sprite) continue;
        const drift = particleDrift(particle, sceneTime);
        const x = particle.x * width + drift.x;
        const y = ((particle.y * height + drift.y + scrollOffset + 60) % wrap + wrap) % wrap - 60;
        const attracted = attractParticle(x, y, pointer.x, pointer.y, radius, strength * pointer.strength);
        const size = particle.size * (1 + particle.depth * .45) * (width < 621 ? .86 : 1);
        drawingContext.globalAlpha = particleAlpha(particle, sceneTime) * (1 + attracted.influence * .58);
        drawingContext.drawImage(sprite, attracted.x - size / 2, attracted.y - size / 2, size, size);
      }
      drawingContext.globalAlpha = 1;
      drawingContext.globalCompositeOperation = 'source-over';
    }

    function tick(now: number): void {
      frame = 0;
      const delta = lastFrame ? Math.min(.1, (now - lastFrame) / 1000) : 0;
      lastFrame = now;
      sceneTime += delta;
      draw();
      if (!disposed && !reducedMotion && opacity() > .001) frame = win.requestAnimationFrame(tick);
    }

    function start(): void {
      if (disposed || reducedMotion || frame !== 0 || opacity() <= .001) return;
      lastFrame = win.performance.now();
      frame = win.requestAnimationFrame(tick);
    }

    function onScroll(): void {
      scrollY = win.scrollY;
      draw(true);
      start();
    }

    function onResize(): void {
      measure();
      start();
    }

    function onPointerMove(event: PointerEvent): void {
      if (event.pointerType !== 'mouse') return;
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      pointer.targetStrength = 1;
      start();
    }

    function releasePointer(): void {
      pointer.targetStrength = 0;
      start();
    }

    function onVisibility(): void {
      if (doc.hidden) {
        if (frame !== 0) win.cancelAnimationFrame(frame);
        frame = 0;
      } else {
        start();
      }
    }

    measure();
    win.addEventListener('scroll', onScroll, { passive: true });
    win.addEventListener('resize', onResize);
    win.addEventListener('pointermove', onPointerMove, { passive: true });
    win.addEventListener('pointerleave', releasePointer);
    win.addEventListener('blur', releasePointer);
    doc.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      disposed = true;
      if (frame !== 0) win.cancelAnimationFrame(frame);
      win.removeEventListener('scroll', onScroll);
      win.removeEventListener('resize', onResize);
      win.removeEventListener('pointermove', onPointerMove);
      win.removeEventListener('pointerleave', releasePointer);
      win.removeEventListener('blur', releasePointer);
      doc.removeEventListener('visibilitychange', onVisibility);
      releaseParticleSprites(sprites);
    };
  }, [reducedMotion, theme]);

  if (theme === 'classic') return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-home-page-particles="true"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }}
    />
  );
}
