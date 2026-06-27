'use client';

import GlowButton from './GlowButton';

export default function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 to-pink-500/20 border border-border p-12 md:p-16 text-center scroll-animate">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
          
          <div className="relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <span className="text-sm text-primary">限时优惠</span>
            </div>
            
            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              准备好开始了吗？
            </h2>
            
            {/* Description */}
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              立即选择适合你的产品，提升你的工作效率
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlowButton variant="primary" size="lg">
                <a href="#products">立即开始</a>
              </GlowButton>
              <GlowButton variant="ghost" size="lg">
                <a href="/products">查看全部产品</a>
              </GlowButton>
            </div>
            
            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>30 天退款保证</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>终身免费更新</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>24/7 技术支持</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
