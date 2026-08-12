/**
 * 共享品牌符号：一枚流星。
 * Header 与 Footer 共用，替代此前的 ☄️ / 🚀 emoji。
 * 读屏用户通过 aria-label 感知品牌名。
 */
export default function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-label="Meteor Store"
      role="img"
      fill="none"
    >
      {/* 流星轨迹：左上到右下 */}
      <line
        x1="6" y1="6" x2="22" y2="22"
        stroke="url(#bm-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* 流星头部亮点 */}
      <circle cx="22" cy="22" r="3" fill="url(#bm-grad)" />
      {/* 尾部渐隐光点 */}
      <circle cx="6" cy="6" r="1.2" fill="rgba(167,139,250,0.5)" />
      <defs>
        <linearGradient id="bm-grad" x1="6" y1="6" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(167,139,250,0.1)" />
          <stop offset="0.5" stopColor="rgba(167,139,250,0.6)" />
          <stop offset="1" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>
    </svg>
  );
}
