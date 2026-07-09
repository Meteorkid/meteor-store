'use client';

import { useRef, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export default function MagneticWrap({ children, strength = 0.3, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    el.style.transition = 'transform 0.12s ease-out';
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 0.5s var(--ease-out-spring)';
    el.style.transform = 'translate(0,0)';
  };

  return (
    <div ref={ref} className={`inline-block ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}
