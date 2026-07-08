'use client';

import GlowButton from './GlowButton';
import MeteorShower from './MeteorShower';
import Hero3D from './Hero3D';
import { SHOW_PRICING } from '@/lib/constants';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0015] to-black" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/15 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-violet-500/8 rounded-full blur-[80px] animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* 流星雨氛围层（Meteor Store 的品牌本命） */}
      <MeteorShower />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      <div className="relative container mx-auto px-4 py-24 lg:py-28">
        {/* 非对称编辑式布局：文字左，3D 玻璃环右；lg 以下回退居中堆叠 */}
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] items-center gap-12 lg:gap-8">
          {/* 左列：文案 */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-white/70 tracking-wide uppercase">全平台工具矩阵 · 持续迭代中</span>
            </div>

            {/* Main Heading */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              <span className="text-white">构建未来的</span>
              <br />
              <span className="gradient-text">开发者工具箱</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg md:text-xl text-white/50 mb-6 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              从智能爬虫到 AI 记忆系统，从 3D 解剖到设计系统——
              <br className="hidden sm:block" />
              每一款工具，都为解决真实问题而生。
            </p>

            {/* Trust Line */}
            <p
              className="text-sm text-white/30 mb-10 animate-fade-in-up"
              style={{ animationDelay: '0.25s' }}
            >
              {SHOW_PRICING ? '已服务 1000+ 开发者 · 开源驱动 · 终身免费更新' : '开源驱动 · 社区驱动 · 欢迎贡献'}
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-14 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <GlowButton variant="primary" size="lg" renderAs="a" href="/products">
                <span className="flex items-center gap-2">
                  <span>探索全部产品</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </GlowButton>
              <GlowButton variant="ghost" size="lg" renderAs="a" href="https://github.com/Meteorkid" target="_blank">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span>GitHub 开源</span>
                </span>
              </GlowButton>
            </div>

            {/* Hero Stats — 左对齐窄条 */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              {[
                { value: '9+', label: '精品工具' },
                { value: '1K+', label: '活跃用户' },
                { value: '4.9', label: '平均评分' },
                { value: '< 50ms', label: '响应延迟' },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 右列：3D 玻璃莫比乌斯环（桌面）/ ASCII 环（降级），移动端隐藏保持简洁 */}
          <div className="hidden lg:block relative">
            <Hero3D className="w-full aspect-square max-w-[620px] mx-auto" />
            {/* 底部柔光承托 */}
            <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[70%] h-16 bg-purple-600/20 blur-[60px] rounded-full pointer-events-none" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <span className="text-xs text-white/30 tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
