'use client';

import { useState } from 'react';
import GlowButton from './GlowButton';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setEmail('');
  };
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 to-pink-500/10 border border-border p-12 md:p-16 text-center scroll-animate">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
          
          <div className="relative">
            {/* Icon */}
            <div className="text-5xl mb-6">📬</div>
            
            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              订阅我们的通讯
            </h2>
            
            {/* Description */}
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              获取最新的产品更新、技术分享和独家优惠
            </p>
            
            {/* Form */}
            {isSubmitted ? (
              <div className="flex items-center justify-center gap-2 text-success">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>订阅成功！感谢您的关注。</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入你的邮箱"
                  required
                  className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <GlowButton type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? '订阅中...' : '订阅'}
                </GlowButton>
              </form>
            )}
            
            {/* Privacy note */}
            <p className="text-sm text-muted-foreground mt-4">
              我们尊重您的隐私，不会向您发送垃圾邮件。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
