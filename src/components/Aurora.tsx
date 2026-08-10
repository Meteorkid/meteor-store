'use client';

export default function Aurora({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0015] to-black" />
      <div
        className="absolute inset-[-50%] opacity-60 blur-[100px] animate-aurora-1"
        style={{
          background: 'conic-gradient(from 0deg, transparent, rgba(139,92,246,0.18) 45deg, transparent 120deg, rgba(236,72,153,0.12) 200deg, transparent 300deg)',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute inset-[-30%] opacity-50 blur-[80px] animate-aurora-2"
        style={{
          background: 'conic-gradient(from 120deg, transparent, rgba(99,102,241,0.15) 60deg, transparent 150deg, rgba(168,85,247,0.1) 250deg, transparent 340deg)',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute inset-[-40%] opacity-40 blur-[120px] animate-aurora-3"
        style={{
          background: 'conic-gradient(from 240deg, transparent, rgba(244,114,182,0.12) 30deg, transparent 80deg, rgba(124,58,237,0.08) 160deg, transparent 240deg)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
