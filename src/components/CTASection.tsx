'use client';

import GlowButton from './GlowButton';
import InfiniteTunnel from './InfiniteTunnel';
import { SHOW_PRICING } from '@/lib/constants';

interface CTASectionProps {
  variant?: 'bold' | 'subtle';
}

export default function CTASection({ variant = 'subtle' }: CTASectionProps) {
  const isBold = variant === 'bold';

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div
          className={`relative overflow-hidden rounded-3xl p-12 md:p-16 text-center scroll-animate ${
            isBold
              ? 'bg-gradient-to-br from-[#12002a] via-[#1a0533] to-black border-t border-l border-r border-b border-t-white/[0.15] border-l-white/[0.08] border-r-white/[0.05] border-b-white/[0.02] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_8px_40px_rgba(0,0,0,0.4)]'
              : 'backdrop-blur-xl bg-white/[0.03] border-t border-l border-r border-b border-t-white/[0.12] border-l-white/[0.06] border-r-white/[0.04] border-b-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_24px_rgba(0,0,0,0.25)]'
          }`}
        >
          {/* 无限隧道背景：进入工具矩阵的纵深感 */}
          {isBold && <InfiniteTunnel />}

          {/* Floating orbs */}
          {isBold && (
            <>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-400/20 rounded-full blur-[60px]" />
            </>
          )}

          <div className="relative">
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
                isBold ? 'text-white' : 'text-foreground'
              }`}
            >
              {isBold ? '进入工具矩阵' : '准备好开始了吗？'}
            </h2>

            <p
              className={`text-lg mb-8 max-w-xl mx-auto ${
                isBold ? 'text-white/70' : 'text-muted-foreground'
              }`}
            >
              {isBold
                ? '浏览我们的产品矩阵，找到适合你的工具'
                : SHOW_PRICING ? '免费开始，按需升级，无隐藏费用' : '所有产品开源免费，欢迎使用'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlowButton variant="primary" size="lg" renderAs="a" href="/products">
                浏览全部产品
              </GlowButton>
              <GlowButton
                variant="ghost"
                size="lg"
                renderAs="a"
                href="https://github.com/Meteorkid"
                target="_blank"
                rel="noopener noreferrer"
                className={isBold ? 'border-white/30 text-white hover:bg-white/10' : ''}
              >
                GitHub 开源
              </GlowButton>
            </div>

            {/* Trust Badges */}
            <div
              className={`mt-10 flex flex-wrap justify-center gap-6 text-sm ${
                isBold ? 'text-white/60' : 'text-muted-foreground'
              }`}
            >
              {(SHOW_PRICING ? ['开源驱动', '终身免费更新', '30 天退款保证'] : ['开源驱动', '终身免费更新']).map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <svg
                    className={`w-4 h-4 ${isBold ? 'text-white/80' : 'text-success'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
