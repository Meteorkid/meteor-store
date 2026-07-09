'use client';

import { useRef, useCallback, type ReactNode, type MouseEvent } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  as?: 'div' | 'section' | 'article';
}

export default function GlassCard({ children, className = '', tilt = false, as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--spec-x', `${x}%`);
    el.style.setProperty('--spec-y', `${y}%`);
    if (tilt) {
      const rx = ((y - 50) / 50) * -3;
      const ry = ((x - 50) / 50) * 3;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    }
  }, [tilt]);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--spec-x', '50%');
    el.style.setProperty('--spec-y', '50%');
    if (tilt) {
      el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    }
  }, [tilt]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={`glass-card ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </Tag>
  );
}
