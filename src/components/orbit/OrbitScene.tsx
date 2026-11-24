'use client';

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { useReducedMotion } from '@/lib/motion';
import { ORBIT_BODIES } from './orbit-bodies';
import type { createOrbitRenderer } from './orbit-renderer';
import styles from './OrbitScene.module.css';

interface OrbitSceneProps {
  planets: readonly { id: string; name: string }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  sunLabel: string;
  viewLabel: string;
  resetCount: number;
  playing: boolean;
  speed: number;
  zoomRequest: { factor: number } | null;
  onAvailabilityChange: (available: boolean) => void;
}

interface DragGesture {
  pointerId: number;
  x: number;
  y: number;
  started: boolean;
}

const stars = Array.from({ length: 168 }, (_, index) => ({
  x: (index * 161.803 + 17 * Math.sin(index)) % 1000,
  y: (index * 92.976 + 27 * Math.cos(index)) % 600,
  radius: index % 17 === 0 ? 1.25 : .46 + index % 9 * .06,
  opacity: .17 + (index % 11) * .037,
}));

export default function OrbitScene({
  planets, selectedId, onSelect, sunLabel, viewLabel, resetCount, playing, speed, zoomRequest, onAvailabilityChange,
}: OrbitSceneProps) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sunRef = useRef<HTMLSpanElement>(null);
  const buttonsRef = useRef(new Map<string, HTMLButtonElement>());
  const engine = useRef<ReturnType<typeof createOrbitRenderer> | null>(null);
  const view = useRef({ selectedId, reducedMotion });
  const playback = useRef({ playing, speed });
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<DragGesture | null>(null);
  const contacts = useRef(new Map<number, [number, number]>());
  const pinchDistance = useRef<number | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    view.current = { selectedId, reducedMotion };
    engine.current?.move(selectedId, reducedMotion);
  }, [selectedId, reducedMotion, resetCount]);

  useEffect(() => {
    playback.current = { playing, speed };
    engine.current?.setPlayback(playing, speed);
  }, [playing, speed]);

  useEffect(() => {
    if (zoomRequest) engine.current?.zoom(zoomRequest.factor);
  }, [zoomRequest]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let active = true;
    let renderer: ReturnType<typeof createOrbitRenderer> | undefined;

    const markLost = (event: Event) => {
      event.preventDefault();
      renderer?.setContext(false);
      drag.current = null;
      contacts.current.clear();
      pinchDistance.current = null;
      setDragging(false);
      setReady(false);
      onAvailabilityChange(false);
    };
    const markRestored = () => {
      if (!renderer) return;
      try {
        renderer.setContext(true);
        setReady(true);
        onAvailabilityChange(true);
      } catch {
        renderer.setContext(false);
      }
    };

    import('./orbit-renderer').then(({ createOrbitRenderer }) => {
      if (!active) return;
      const context = window.WebGL2RenderingContext
        ? canvas.getContext('webgl2', { alpha: false, antialias: true, powerPreference: 'high-performance' })
        : null;
      if (!context) {
        onAvailabilityChange(false);
        return;
      }
      renderer = createOrbitRenderer(canvas, context, planets.map(({ id }) => ({ id, button: buttonsRef.current.get(id) ?? null })), sunRef.current);
      engine.current = renderer;
      renderer.move(view.current.selectedId, view.current.reducedMotion, true);
      if (!view.current.selectedId && !view.current.reducedMotion) renderer.open();
      renderer.setPlayback(playback.current.playing, playback.current.speed);
      canvas.addEventListener('webglcontextlost', markLost);
      canvas.addEventListener('webglcontextrestored', markRestored);
      setReady(true);
      onAvailabilityChange(true);
    }).catch(() => {
      // 图形驱动或 WebGL 不可用时，静态星图继续提供同一份选择入口。
      if (active) {
        setReady(false);
        onAvailabilityChange(false);
      }
    });

    return () => {
      active = false;
      canvas.removeEventListener('webglcontextlost', markLost);
      canvas.removeEventListener('webglcontextrestored', markRestored);
      renderer?.dispose();
      engine.current = null;
    };
  }, [planets, onAvailabilityChange]);

  function contactDistance() {
    const [first, second] = contacts.current.values();
    return Math.hypot(first[0] - second[0], first[1] - second[1]);
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (ready && event.pointerType === 'touch') {
      if (contacts.current.size >= 2) return;
      contacts.current.set(event.pointerId, [event.clientX, event.clientY]);
      if (contacts.current.size === 2) {
        drag.current = null;
        pinchDistance.current = contactDistance();
        suppressClick.current = true;
        for (const id of contacts.current.keys()) event.currentTarget.setPointerCapture(id);
        setDragging(true);
        return;
      }
    }
    if (!event.isPrimary || event.button !== 0) return;
    suppressClick.current = false;
    if (!ready) return;
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, started: false };
    // 行星会在按下和松开之间继续公转，将这次轻触留给最初命中的按钮。
    if (event.target instanceof Element) {
      event.target.closest<HTMLButtonElement>('[data-orbit-planet]')?.setPointerCapture(event.pointerId);
    }
  }

  function dragView(event: PointerEvent<HTMLDivElement>) {
    if (contacts.current.has(event.pointerId)) {
      contacts.current.set(event.pointerId, [event.clientX, event.clientY]);
      const previous = pinchDistance.current;
      if (previous !== null) {
        const next = contactDistance();
        if (next > 0 && previous > 0) engine.current?.zoom(previous / next);
        pinchDistance.current = next;
        return;
      }
    }
    const gesture = drag.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (!gesture.started) {
      if (Math.hypot(dx, dy) < 5) return;
      gesture.started = true;
      suppressClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    engine.current?.rotate(dx, dy);
    gesture.x = event.clientX;
    gesture.y = event.clientY;
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (contacts.current.delete(event.pointerId) && pinchDistance.current !== null) {
      pinchDistance.current = null;
      setDragging(false);
    }
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
  }

  function preventDragClick(event: MouseEvent<HTMLDivElement>) {
    if (event.detail === 0 || !suppressClick.current) return;
    suppressClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  }

  function rotateWithKey(event: KeyboardEvent<HTMLDivElement>) {
    if (!ready || event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;
    const step = event.currentTarget.clientHeight / 36;
    switch (event.key) {
      case 'ArrowLeft': engine.current?.rotate(-step, 0); break;
      case 'ArrowRight': engine.current?.rotate(step, 0); break;
      case 'ArrowUp': engine.current?.rotate(0, -step); break;
      case 'ArrowDown': engine.current?.rotate(0, step); break;
      case '+':
      case '=': engine.current?.zoom(0.8); break;
      case '-': engine.current?.zoom(1.25); break;
      default: return;
    }
    event.preventDefault();
  }

  return (
    <div
      className={styles.stage}
      data-orbit-scene
      data-orbit-webgl={ready ? 'ready' : 'fallback'}
      data-dragging={dragging || undefined}
      role="group"
      aria-label={ready ? viewLabel : undefined}
      tabIndex={ready ? 0 : undefined}
      onPointerDown={startDrag}
      onPointerMove={dragView}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={event => {
        if (event.target === event.currentTarget) endDrag(event);
      }}
      onPointerLeave={event => {
        if (!drag.current?.started) endDrag(event);
      }}
      onClickCapture={preventDragClick}
      onKeyDown={rotateWithKey}
    >
      <svg className={styles.sky} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {stars.map((star, index) => <circle key={index} cx={star.x} cy={star.y} r={star.radius} opacity={star.opacity} />)}
      </svg>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <svg className={styles.orbits} viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
        {ORBIT_BODIES.map(body => <ellipse key={body.id} cx="620" cy="276" rx={body.distance * 6.4} ry={body.distance * 1.86} className={body.id === selectedId ? styles.activeOrbit : undefined} />)}
      </svg>
      <span ref={sunRef} className={styles.sun} data-orbit-sun>
        <span className={styles.sunDisk} aria-hidden="true" />
        <span className={styles.sunName}>{sunLabel}</span>
      </span>
      {planets.map(planet => {
        const body = ORBIT_BODIES.find(body => body.id === planet.id);
        if (!body) return null;
        const placement = {
          '--fallback-x': `${body.fallback[0]}%`,
          '--fallback-y': `${body.fallback[1]}%`,
          '--compact-x': `${body.compact[0]}%`,
          '--compact-y': `${body.compact[1]}%`,
          '--fallback-diameter': `${body.size}px`,
          '--planet-shade': body.colours[0],
          '--planet-light': body.colours[1],
        } as CSSProperties;
        return (
          <button
            key={planet.id}
            ref={element => {
              if (element) buttonsRef.current.set(planet.id, element);
              else buttonsRef.current.delete(planet.id);
            }}
            className={styles.marker}
            style={placement}
            type="button"
            aria-label={planet.name}
            aria-pressed={planet.id === selectedId}
            data-orbit-planet={planet.id}
            onPointerEnter={event => {
              if (event.pointerType === 'mouse') engine.current?.setHover(planet.id);
            }}
            onPointerLeave={() => engine.current?.setHover(undefined)}
            onClick={() => onSelect(planet.id)}
          >
            <span className={styles.planetDisk} aria-hidden="true" />
            <span className={styles.planetName} aria-hidden="true">{planet.name}</span>
          </button>
        );
      })}
    </div>
  );
}
