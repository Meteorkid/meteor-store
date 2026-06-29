'use client';

import GlowButton from './GlowButton';
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
              ? 'bg-gradient-to-br from-primary via-primary/80 to-purple-600'
              : 'bg-white/[0.02] border border-white/[0.06]'
          }`}
        >
          {/* Background grid */}
          {isBold && (
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
          )}

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
              {isBold ? '准备好提升效率了吗？' : '准备好开始了吗？'}
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
              <GlowButton
                variant="primary"
                size="lg"
                renderAs="a"
                href="/products"
                className={isBold ? 'bg-white text-primary hover:bg-white/90' : ''}
              >
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
