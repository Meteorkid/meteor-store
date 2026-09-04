'use client';

import { useTranslations } from 'next-intl';
import GlowButton from './GlowButton';
import HeroCanvas from "./HeroCanvas";
import Aurora from './Aurora';
import ScrambleText from './ScrambleText';
import MagneticWrap from './MagneticWrap';
import { SHOW_PRICING } from '@/lib/constants';

interface HeroSectionProps {
  /** 站内产品总数 */
  productCount: number;
  /** 其中能在浏览器里直接打开的（已登记进 app-manifest 的）数量 */
  webAppCount: number;
  /** 完全免费的数量（实验室全部免费） */
  freeCount: number;
  /** 帮助中心的文章数 */
  helpCount: number;
}

/**
 * 首页 Hero。
 *
 * **这四个数字必须是可核实的事实**，由服务端从真实数据算好传进来。
 * 曾经写死成「1K+ 活跃用户 / 4.9 平均评分 / < 50ms 响应延迟」——三个都没有
 * 任何数据源支撑。对开发者受众，编造的社会证明一眼就能看穿，是负分；
 * 而站点同时是个体工商户的经营主体，虚构用户数据属于虚假宣传。
 * 现在这四个数字随产品目录自动变化，不会再漂移成谎话。
 */
export default function HeroSection({ productCount, webAppCount, freeCount, helpCount }: HeroSectionProps) {
  const t = useTranslations('HeroSection');

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Aurora flowing gradient background */}
      <Aurora />
      <HeroCanvas />

      {/* Interactive particle constellation */}

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          {/* Status Badge — liquid glass pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-white/70 tracking-wide uppercase">{t('badge')}</span>
          </div>

          {/* Main Heading — shimmer + gradient + ambient glow */}
          <div className="relative mb-6">
            {/* Ambient glow halo */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-28 bg-gradient-to-r from-purple-500/20 via-indigo-400/15 to-pink-500/20 rounded-full blur-3xl -z-10 pointer-events-none" aria-hidden="true" />
            <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-bold tracking-tight">
              <span className="hero-shimmer">
                <ScrambleText text={t('headingLine1')} delay={200} />
              </span>
              <br />
              <span className="hero-gradient">
                <ScrambleText text={t('headingLine2')} delay={500} />
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-white/50 mb-6 max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.85s' }}
          >
            {t('subtitleLine1')}
            <br className="hidden sm:block" />
            {t('subtitleLine2')}
          </p>

          {/* Trust Line */}
          <p
            className="text-sm text-white/30 mb-10 animate-fade-in-up"
            style={{ animationDelay: '0.95s' }}
          >
            {SHOW_PRICING ? t('trustLinePricing') : t('trustLineNoPricing')}
          </p>

          {/* CTA Buttons — magnetic cursor */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up"
            style={{ animationDelay: '1.05s' }}
          >
            <MagneticWrap strength={0.25}>
              <GlowButton variant="primary" size="lg" renderAs="a" href="/products">
                <span className="flex items-center gap-2">
                  <span>{t('ctaExplore')}</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </GlowButton>
            </MagneticWrap>
            <MagneticWrap strength={0.25}>
              <GlowButton variant="ghost" size="lg" renderAs="a" href="/docs">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{t('ctaGithub')}</span>
                </span>
              </GlowButton>
            </MagneticWrap>
          </div>

          {/* Stats — glass pills */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in-up"
            style={{ animationDelay: '1.15s' }}
          >
            {[
              { value: String(productCount), label: t('statTools') },
              { value: String(webAppCount), label: t('statPlayable') },
              { value: String(freeCount), label: t('statFree') },
              { value: String(helpCount), label: t('statDocs') },
            ].map((stat) => (
              <div key={stat.label} className="px-4 py-3 rounded-xl backdrop-blur-md bg-white/[0.03] border-t border-t-white/[0.10] border-b border-b-transparent border-x border-x-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Scroll Indicator — glass pill */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
        <span className="text-xs text-white/30 tracking-widest uppercase">Scroll</span>
        <div className="w-6 h-9 rounded-full backdrop-blur-md bg-white/[0.04] border-t border-l border-r border-b border-t-white/[0.18] border-l-white/[0.08] border-r-white/[0.05] border-b-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
