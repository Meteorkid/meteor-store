import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ProductShowcase from '@/components/ProductShowcase';
import ProductDemo from '@/components/ProductDemo';
import FeaturesSection from '@/components/FeaturesSection';
import StatsSection from '@/components/StatsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PartnersSection from '@/components/PartnersSection';
import NewsletterSection from '@/components/NewsletterSection';
import FAQSection from '@/components/FAQSection';
import TerminalSection from '@/components/TerminalSection';
import PricingSection from '@/components/PricingSection';
import CTASection from '@/components/CTASection';
import BackToTop from '@/components/BackToTop';
import { appComponents } from '@/components/apps/registry';
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
  const t = await getTranslations({ locale, namespace: 'HomePage' });

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
        title={t('coreAdvantages')}
        subtitle={t('coreAdvantagesSubtitle')}
        featureCount={4}
      />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section —— 全站唯一的定价区块。
          数量在服务端算：appComponents 是「真的能在浏览器打开」的唯一权威，
          products 里带 appUrl 但没注册进去的产品只会渲染成占位符，不能算数 */}
      {SHOW_PRICING && (
        <PricingSection
          productCount={products.length}
          webAppCount={Object.keys(appComponents).length}
        />
      )}

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* 店主的终端 — 彩蛋区 & 作者小序入口 */}
      <TerminalSection />

      {/* CTA Sections */}
      <CTASection variant="bold" />
      <CTASection variant="subtle" />

      <Footer showSocial />

      {/* Back to top button */}
      <BackToTop />
    </div>
  );
}
