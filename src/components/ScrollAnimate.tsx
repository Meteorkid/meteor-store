'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ScrollAnimateProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function ScrollAnimate({ children, delay = 0, className = '' }: ScrollAnimateProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay * 1000);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [delay]);
  
  return (
    <div ref={ref} className={`scroll-animate ${className}`}>
      {children}
    </div>
  );
}
