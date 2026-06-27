'use client';

import { useEffect, useRef, useState } from 'react';

const stats = [
  { label: '精品工具', value: 9, suffix: '+' },
  { label: '活跃用户', value: 1000, suffix: '+' },
  { label: '用户评分', value: 4.9, suffix: '' },
  { label: '技术支持', value: 24, suffix: '/7' },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, duration / steps);
          
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [value]);
  
  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-foreground mb-2">
      {value % 1 === 0 ? Math.floor(count) : count.toFixed(1)}{suffix}
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-secondary/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center scroll-animate"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
