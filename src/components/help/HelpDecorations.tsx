/**
 * 帮助中心的宇宙装饰元素
 * - MeteorTrail: 流星尾迹，用于卡片 hover 或重点区域
 * - ConstellationNode: 星宿节点，用于分类导航
 * - StarDust: 星尘分隔符
 */

export function MeteorTrail({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <line
        x1="4" y1="4" x2="18" y2="18"
        stroke="url(#mt-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="18" cy="18" r="2.5" fill="url(#mt-grad)" />
      <circle cx="4" cy="4" r="0.8" fill="rgba(167,139,250,0.3)" />
      <defs>
        <linearGradient id="mt-grad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(167,139,250,0.05)" />
          <stop offset="0.5" stopColor="rgba(167,139,250,0.4)" />
          <stop offset="1" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function StarDust({ className = '' }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`text-violet-400/40 ${className}`}>
      ✦
    </span>
  );
}

export function ConstellationDot({ active = false }: { active?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-1.5 w-1.5 rounded-full transition-all duration-300 ${
        active
          ? 'bg-violet-300 shadow-[0_0_6px_rgba(196,181,253,0.6)]'
          : 'bg-white/20'
      }`}
    />
  );
}

export function SectionDivider() {
  return (
    <div className="flex items-center gap-3 py-2" aria-hidden="true">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      <ConstellationDot active />
      <ConstellationDot />
      <ConstellationDot active />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
    </div>
  );
}
