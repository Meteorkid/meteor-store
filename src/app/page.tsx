import type { Metadata } from 'next';
import Header from '@/components/Header';
import EnhancedFooter from '@/components/EnhancedFooter';
import HeroSection from '@/components/HeroSection';
import ProductShowcase from '@/components/ProductShowcase';
import ProductDemo from '@/components/ProductDemo';
import FeaturesSection from '@/components/FeaturesSection';
import StatsSection from '@/components/StatsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PartnersSection from '@/components/PartnersSection';
import NewsletterSection from '@/components/NewsletterSection';
import FAQSection from '@/components/FAQSection';
import PricingSection from '@/components/PricingSection';
import FeaturesComparison from '@/components/FeaturesComparison';
import CTASection from '@/components/CTASection';
import BackToTop from '@/components/BackToTop';

export const metadata: Metadata = {
  title: 'Meteor Store — 开发者工具与 AI 应用',
  description:
    '精心打造的开发者工具矩阵：智能爬虫框架 OmniCrawl、AI 记忆系统 Ex-Memory、3D 解剖图谱 Skeleton Anatomy。开源驱动，终身免费更新。',
  openGraph: {
    title: 'Meteor Store — 开发者工具与 AI 应用',
    description:
      '精心打造的开发者工具矩阵：智能爬虫、AI 记忆、3D 解剖、设计系统。开源驱动，终身免费更新。',
    url: 'https://www.imagentx.top',
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Partners Section */}
      <PartnersSection />

      {/* Products Section */}
      <ProductShowcase />

      {/* Product Demo */}
      <ProductDemo />

      {/* Features Section */}
      <FeaturesSection layout="grid" featureCount={6} />

      {/* Features List */}
      <FeaturesSection
        layout="list"
        title="核心优势"
        subtitle="我们致力于提供最优质的开发者工具和 AI 应用"
        featureCount={4}
      />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Features Comparison */}
      <FeaturesComparison />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Sections */}
      <CTASection variant="bold" />
      <CTASection variant="subtle" />

      <EnhancedFooter />

      {/* Back to top button */}
      <BackToTop />
    </div>
  );
}
