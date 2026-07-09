'use client';

import { useEffect, useRef } from 'react';

export default function FilmGrain() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const size = 150;
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d')!;
    const img = ctx.createImageData(size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    el.style.backgroundImage = `url(${c.toDataURL('image/png')})`;
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.028]"
      style={{ backgroundRepeat: 'repeat', backgroundSize: '150px 150px', mixBlendMode: 'overlay' }}
      aria-hidden="true"
    />
  );
}
