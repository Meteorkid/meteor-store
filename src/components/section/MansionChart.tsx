import { FOUR_SYMBOLS, MANSION_GROUPS, MANSION_NAMES, type FourSymbolId } from '@/data/celestial';
import type { Locale } from '@/i18n/routing';
import type { MansionChartCopy } from './mansion-chart-copy';

interface MansionChartProps {
  locale: Locale;
  lineCount: number;
  labCount: number;
  copy: MansionChartCopy;
}

const SYMBOL_ORDER: FourSymbolId[] = ['azureDragon', 'blackTortoise', 'vermilionBird', 'whiteTiger'];

/**
 * 二十八宿星图索引。
 *
 * 产品卡上的宿名不是装饰性随机字符：主线取青龙七宿，实验室取玄武七宿，
 * 四象各七宿合起来才是完整的二十八宿。这里把整张星图摊开，并标出当前被
 * 使用的两个星区、尚未启用的两个星区，以及青龙里留给后续作品的空位。
 */
export default function MansionChart({ locale, lineCount, labCount, copy }: MansionChartProps) {
  return (
    <section id="mansion-chart" aria-labelledby="mansion-chart-title" className="scroll-mt-24 border-b border-white/10 py-10 md:py-12">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="glass-card relative overflow-hidden rounded-3xl p-5 md:p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgb(94_234_212/0.10),transparent_70%)]"
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="t-eyebrow text-white/45">{copy.eyebrow}</p>
              <h2 id="mansion-chart-title" className="mt-3 t-title-2 text-balance text-white">
                {copy.title}
              </h2>
              <p className="mt-3 t-footnote text-pretty text-white/60">{copy.description}</p>
            </div>
            <p className="t-footnote shrink-0 text-white/45">{copy.total}</p>
          </div>

          <div className="relative mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 xl:grid-cols-4">
            {SYMBOL_ORDER.map((symbolId) => {
              const group = MANSION_GROUPS.find((item) => item.symbolId === symbolId);
              const symbol = FOUR_SYMBOLS[symbolId];
              if (!group) return null;

              const active = symbolId === 'azureDragon' || symbolId === 'blackTortoise';
              const used = symbolId === 'azureDragon' ? lineCount : symbolId === 'blackTortoise' ? Math.min(labCount, 7) : 0;
              const role = active
                ? (symbolId === 'azureDragon' ? copy.line : copy.lab)
                : copy.future;

              return (
                <div
                  key={symbolId}
                  className={`min-w-[15rem] snap-start rounded-2xl border p-4 transition-colors sm:min-w-0 ${
                    active
                      ? 'border-white/15 bg-white/[0.035]'
                      : 'border-white/[0.07] bg-white/[0.015] opacity-55'
                  }`}
                  style={active ? { borderColor: `rgb(${symbol.rgb} / 0.22)` } : undefined}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="t-eyebrow" style={active ? { color: `rgb(${symbol.rgb} / 0.95)` } : undefined}>
                        {symbol.shortLabel[locale]}
                      </p>
                      <p className="mt-1 text-xs text-white/60">{role}</p>
                    </div>
                    {active && (
                      <span
                        aria-hidden="true"
                        className="mt-1 h-1.5 w-1.5 rounded-full"
                        style={{ background: `rgb(${symbol.rgb})`, boxShadow: `0 0 10px rgb(${symbol.rgb} / 0.5)` }}
                      />
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-7 gap-1">
                    {group.mansions.map((mansion, index) => {
                      const reserved = active && index >= used;
                      const name = locale === 'en' ? MANSION_NAMES[mansion]?.en ?? mansion : mansion;
                      return (
                        <span
                          key={mansion}
                          title={reserved ? copy.reserved : `${symbol.shortLabel[locale]} · ${name}${copy.mansionSuffix}`}
                          className={`grid aspect-square place-items-center rounded-md border px-0.5 text-center leading-tight ${locale === 'en' ? 'break-words text-[8px] tracking-tight sm:text-[9px]' : 'text-[11px] sm:text-xs'} ${
                            reserved
                              ? 'border-dashed border-white/10 text-white/30'
                              : active
                                ? 'border-white/10 text-white/80'
                                : 'border-white/[0.06] text-white/35'
                          }`}
                          style={active && !reserved ? { background: `rgb(${symbol.rgb} / 0.06)` } : undefined}
                        >
                          {locale === 'en' ? MANSION_NAMES[mansion]?.shortEn ?? name : mansion}
                        </span>
                      );
                    })}
                  </div>

                  {(symbolId === 'azureDragon' || symbolId === 'blackTortoise') && (
                    <p className="mt-3 t-footnote text-pretty text-white/50">
                      {symbolId === 'azureDragon' ? copy.lineNote : copy.labNote}
                    </p>
                  )}

                  {symbolId === 'blackTortoise' && labCount > 7 && (
                    <p className="mt-2 inline-flex max-w-full flex-wrap items-center gap-x-1.5 gap-y-1 rounded-full border border-dashed border-white/15 px-2.5 py-1 text-[11px] leading-4 text-white/55">
                      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[rgb(94_129_172)]" />
                      {copy.guestStar} · +{labCount - 7}
                      <span className="text-white/35">{locale === 'en' ? '·' : '｜'} {copy.guestNote}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <p className="relative mt-3 flex items-start gap-2 t-footnote text-white/45 sm:mt-5">
            <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/30" />
            {copy.futureNote}
          </p>
          <p className="relative mt-3 t-footnote text-white/35 sm:hidden">{copy.swipeHint}</p>
        </div>
      </div>
    </section>
  );
}
