'use client';

import { useEffect, useRef } from 'react';

const stats = [
  { label: '精品工具', value: 9, suffix: '+', icon: '⚡' },
  { label: '活跃用户', value: 1000, suffix: '+', icon: '👥' },
  { label: '用户评分', value: 4.9, suffix: '', icon: '⭐' },
  { label: '响应延迟', value: 50, suffix: 'ms', icon: '🚀' },
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
            <div
              key={stat.label}
              className="group relative p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-300 text-center scroll-animate"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              <div className="text-xs text-white/40 uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
