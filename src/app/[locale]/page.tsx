import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ProductShowcase from '@/components/ProductShowcase';
import ProductDemo from '@/components/ProductDemo';
import FeaturesSection from '@/components/FeaturesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PartnersSection from '@/components/PartnersSection';
import NewsletterSection from '@/components/NewsletterSection';
import FAQSection from '@/components/FAQSection';
import TerminalSection from '@/components/TerminalSection';
import PricingSection from '@/components/PricingSection';
import CTASection from '@/components/CTASection';
import BackToTop from '@/components/BackToTop';
import { webAppCount } from '@/data/app-manifest';
import { products } from '@/data/products';
import { SHOW_PRICING } from '@/lib/constants';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Partners Section */}
      <PartnersSection />

      {/* Products Section */}
      <ProductShowcase />

      {/* Product Demo */}
      <ProductDemo />

      {/* Features Section（核心能力） */}
      <FeaturesSection layout="grid" featureCount={6} />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section —— 全站唯一的定价区块。
          数量在服务端算：app-manifest 是可安全导入的站内应用轻量清单，
          并由类型与测试保证它和组件注册表、products 中的 appUrl 保持一致 */}
      {SHOW_PRICING && (
        <PricingSection
          productCount={products.length}
          webAppCount={webAppCount}
        />
      )}

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* 店主的终端 — 彩蛋区 & 作者小序入口 */}
      <TerminalSection />

      {/* CTA Section */}
      <CTASection />

      <Footer showSocial />

      {/* Back to top button */}
      <BackToTop />
    </div>
  );
}
