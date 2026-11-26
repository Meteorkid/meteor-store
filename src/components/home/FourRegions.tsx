import { Link } from '@/i18n/navigation';
import { FOUR_SYMBOLS, type FourSymbolId } from '@/data/celestial';
import type { Locale } from '@/i18n/routing';
import { fourRegionsCopy } from './four-regions-copy';

const REGION_ORDER: Array<{
  symbolId: FourSymbolId;
  href: string;
}> = [
  { symbolId: 'azureDragon', href: '/products#core' },
  { symbolId: 'blackTortoise', href: '/products#lab' },
  { symbolId: 'vermilionBird', href: '/blog' },
  { symbolId: 'whiteTiger', href: '/docs' },
];

/** 每个星区一个极简星连线图形，不依赖图片资源。 */
const GLYPHS: Record<FourSymbolId, {
  points: Array<[number, number]>;
  links: Array<[number, number]>;
}> = {
  azureDragon: {
    points: [[2, 13], [6, 9], [11, 7], [16, 3]],
    links: [[0, 1], [1, 2], [2, 3]],
  },
  blackTortoise: {
    points: [[3, 4], [14, 5], [6, 14], [15, 12]],
    links: [[0, 1], [1, 3], [3, 2], [2, 0]],
  },
  vermilionBird: {
    points: [[2, 7], [8, 3], [11, 14], [16, 8]],
    links: [[0, 1], [1, 3], [3, 2], [2, 0]],
  },
  whiteTiger: {
    points: [[3, 3], [8, 8], [13, 6], [16, 13]],
    links: [[0, 1], [1, 2], [2, 3]],
  },
};

function RegionGlyph({ symbolId }: { symbolId: FourSymbolId }) {
  const glyph = GLYPHS[symbolId];

  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
      <g stroke="currentColor" strokeWidth="1" opacity="0.62">
        {glyph.links.map(([from, to]) => (
          <line
            key={`${from}-${to}`}
            x1={glyph.points[from][0]}
            y1={glyph.points[from][1]}
            x2={glyph.points[to][0]}
            y2={glyph.points[to][1]}
          />
        ))}
      </g>
      {glyph.points.map(([cx, cy], index) => (
        <circle
          key={index}
          cx={cx}
          cy={cy}
          r={index === glyph.points.length - 1 ? 1.7 : 1.25}
          fill="currentColor"
          opacity={index === glyph.points.length - 1 ? 0.95 : 0.7}
        />
      ))}
    </svg>
  );
}

/**
 * 首页「四象分野」：一条很薄的星区索引，不是四张内容卡。
 *
 * 只保留四个入口；每个入口用一个星连线图形和名称说明方向，
 * 具体介绍留给进入后的产品页、实验室、博客和帮助中心。
 */
export default function FourRegions({ locale }: { locale: Locale }) {
  const copy = fourRegionsCopy[locale];
  const regions = REGION_ORDER.map((item) => ({
    ...item,
    symbol: FOUR_SYMBOLS[item.symbolId],
    entry: copy.entries[item.symbolId],
  }));

  return (
    <section
      id="regions"
      aria-label={copy.eyebrow}
      className="relative border-y border-white/10 py-4 md:py-5"
    >
      <nav
        aria-label={copy.eyebrow}
        className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-2 px-4 md:grid-cols-4"
      >
          {regions.map(({ symbolId, href, symbol, entry }) => {
            const rgb = symbol.rgb;

            return (
              <Link
                key={symbolId}
                href={href}
                className="group relative inline-flex min-h-11 w-full items-center justify-center gap-2.5 overflow-hidden rounded-lg border border-white/[0.09] bg-white/[0.025] px-3.5 py-2 text-[13px] font-medium text-white/70 outline-none transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-1.5 left-0 w-px opacity-70"
                  style={{ backgroundColor: `rgb(${rgb})` }}
                />
                <span
                  aria-hidden="true"
                  className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{
                    color: `rgb(${rgb})`,
                    background: `radial-gradient(circle, rgb(${rgb} / 0.18), transparent 68%)`,
                  }}
                >
                  <RegionGlyph symbolId={symbolId} />
                </span>
                <span className="whitespace-nowrap">{entry.label}</span>
              </Link>
            );
          })}
      </nav>
    </section>
  );
}
