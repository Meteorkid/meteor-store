/**
 * 星区背景：星点 + 星座连线，铺在区块底下作为氛围层。
 *
 * **位置必须是确定性的**：用 Math.random() 会让服务端和客户端算出两套坐标，
 * React 水合时报 hydration 不匹配。这里用和 StarMap 同一套字符串哈希，
 * 同一个 seed 永远得到同一片星空——刷新不会重排，也不会闪。
 *
 * 纯装饰，`aria-hidden`。颜色由调用方给（用 celestial.ts 里四象的 rgb），
 * 让每个星区有自己的色温而不必各写一份。
 */

interface CelestialFieldProps {
  /** 决定星点分布；同一个值永远得到同一片星空 */
  seed: string;
  /** 四象配色，形如 "94 234 212"（见 src/data/celestial.ts） */
  rgb: string;
  /** 星点数量，默认 48。太多会糊成噪点，反而不像夜空 */
  count?: number;
  className?: string;
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** 线性同余，够用的确定性伪随机 */
function makeRng(seed: number) {
  let state = seed || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

const W = 1200;
const H = 800;

export default function CelestialField({ seed, rgb, count = 48, className = '' }: CelestialFieldProps) {
  const rng = makeRng(hashString(seed));

  const stars = Array.from({ length: count }, () => {
    const r = rng();
    const bright = r > 0.92;
    return {
      // 大星稀少：绝大多数是 0.6~1.4 的微光点，少数亮星做视觉锚
      bright,
      x: rng() * W,
      y: rng() * H,
      size: bright ? 1.8 + rng() * 1.2 : 0.6 + rng() * 0.8,
      opacity: 0.18 + rng() * 0.5,
      // 时长与延迟错开，避免所有亮星同步呼吸（那看起来像在闪烁报警）
      dur: 5 + rng() * 5,
      delay: rng() * 6,
    };
  });

  // 星座连线：只连前若干颗，连成一条蜿蜒的轨迹而不是网
  const path = stars.slice(0, 7).map((s, i) => `${i === 0 ? 'M' : 'L'} ${s.x.toFixed(1)} ${s.y.toFixed(1)}`).join(' ');

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <path d={path} fill="none" stroke={`rgb(${rgb} / 0.14)`} strokeWidth="0.75" strokeLinecap="round" />
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x.toFixed(1)}
          cy={s.y.toFixed(1)}
          r={s.size.toFixed(2)}
          fill={`rgb(${rgb})`}
          opacity={s.opacity.toFixed(2)}
          className={s.bright ? 'celestial-twinkle' : undefined}
          style={
            s.bright
              ? ({
                  '--twinkle-lo': (s.opacity * 0.45).toFixed(2),
                  '--twinkle-hi': s.opacity.toFixed(2),
                  '--twinkle-dur': `${s.dur.toFixed(1)}s`,
                  '--twinkle-delay': `${s.delay.toFixed(1)}s`,
                } as React.CSSProperties)
              : undefined
          }
        />
      ))}
    </svg>
  );
}
