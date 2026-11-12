import type { CSSProperties } from 'react';

/**
 * 产品页的固定星象：北斗七星。
 *
 * 七颗星使用手工定好的坐标，先组成斗魁，再由斗柄向右上方展开；每次渲染
 * 都是同一幅星图。它们不在长星区上随机连成贯穿卡片的折线，而是在首屏内
 * 形成一小段“从远处找到方向”的星路。
 */
const STORY_STARS = [
  { x: 168, y: 259, radius: 1.7, glow: 5.6, duration: 7.6, delay: 0 },
  { x: 250, y: 207, radius: 2.0, glow: 6.4, duration: 8.4, delay: 1.1 },
  { x: 326, y: 236, radius: 2.4, glow: 7.4, duration: 7.1, delay: 2.4 },
  { x: 298, y: 315, radius: 2.8, glow: 8.6, duration: 9.2, delay: 3.3 },
  { x: 397, y: 255, radius: 3.2, glow: 10.2, duration: 8.1, delay: 4.2 },
  { x: 497, y: 211, radius: 3.9, glow: 12.4, duration: 7.8, delay: 5.1 },
  { x: 590, y: 157, radius: 4.8, glow: 15.2, duration: 9.6, delay: 6.2 },
] as const;

const STORY_LINES = 'M168 259 L250 207 L326 236 L298 315 Z M298 315 L397 255 L497 211 L590 157';

interface ProductStarStoryProps {
  /** 东方青龙的色温，形如 "94 234 212"。 */
  rgb: string;
}

export default function ProductStarStory({ rgb }: ProductStarStoryProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 flex items-end justify-start overflow-hidden pb-[max(4.5rem,10vh)] pl-[8vw]"
    >
      <svg
        viewBox="0 0 720 420"
        className="h-auto w-[min(520px,72vw)] opacity-85"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="products-star-story-line" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="rgb(178 224 232 / .035)" />
            <stop offset=".7" stopColor="rgb(198 230 238 / .12)" />
            <stop offset="1" stopColor="rgb(222 246 250 / .22)" />
          </linearGradient>
        </defs>
        <path
          d={STORY_LINES}
          fill="none"
          stroke="url(#products-star-story-line)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {STORY_STARS.map((star, index) => {
          const twinkle = {
            '--twinkle-lo': (0.48 + index * 0.055).toFixed(2),
            '--twinkle-hi': (0.68 + index * 0.045).toFixed(2),
            '--twinkle-dur': `${star.duration}s`,
            '--twinkle-delay': `${star.delay}s`,
          } as CSSProperties;
          return (
            <g
              key={`${star.x}-${star.y}`}
              data-story-star={index}
              transform={`translate(${star.x} ${star.y})`}
              className="celestial-twinkle"
              style={twinkle}
            >
              <circle r={star.glow} fill={`rgb(${rgb} / .055)`} />
              <circle r={star.radius} fill="rgb(226 245 249 / .94)" />
              <path
                d={`M0-${star.radius * 2.8} ${star.radius * .48}-${star.radius * .48} ${star.radius * 2.8} 0 ${star.radius * .48} ${star.radius * .48} 0 ${star.radius * 2.8} -${star.radius * .48} ${star.radius * .48} -${star.radius * 2.8} 0 -${star.radius * .48}-${star.radius * .48}Z`}
                fill={`rgb(${rgb} / ${index === STORY_STARS.length - 1 ? .42 : .24})`}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
