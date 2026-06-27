'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);
    
    // Add event listeners for route changes
    window.addEventListener('beforeunload', handleStart);
    window.addEventListener('load', handleComplete);
    
    return () => {
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('load', handleComplete);
    };
  }, []);
  
  return (
    <div className="relative">
      {/* Loading indicator */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-primary z-50">
          <div className="h-full bg-gradient-to-r from-primary to-pink-500 animate-pulse" />
        </div>
      )}
      
      {/* Page content */}
      <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        {children}
      </div>
    </div>
  );
}
