'use client';

import { useEffect, useRef } from 'react';
import GlassCard from './GlassCard';

const statIcon = (path: string) => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const stats = [
  { label: '精品工具', value: 9, suffix: '+', icon: statIcon('M13 10V3L4 14h7v7l9-11h-7z') },
  { label: '活跃用户', value: 1000, suffix: '+', icon: statIcon('M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z') },
  { label: '用户评分', value: 4.9, suffix: '', icon: statIcon('M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z') },
  { label: '响应延迟', value: 50, suffix: 'ms', icon: statIcon('M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z') },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const useFixed = value % 1 === 0;

          timerRef.current = setInterval(() => {
            current += increment;
            if (current >= value) {
              current = value;
              clearInterval(timerRef.current!);
            }
            // 直接操作 DOM，避免 re-render
            if (ref.current) {
              const textNode = ref.current.childNodes[0];
              if (textNode) {
                textNode.textContent = useFixed ? String(Math.floor(current)) : current.toFixed(1);
              }
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [value]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-white mb-1">
      {'0'}
      <span className="text-primary">{suffix}</span>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <GlassCard
              key={stat.label}
              className="group p-6 rounded-2xl text-center scroll-animate"
              tilt
            >
              <div className="mb-3 flex justify-center text-primary/80 group-hover:scale-110 group-hover:text-primary transition-all duration-300">
                {stat.icon}
              </div>
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              <div className="text-xs text-white/40 uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
