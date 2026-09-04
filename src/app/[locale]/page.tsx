import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ProductShowcase from '@/components/ProductShowcase';
import ProductDemo from '@/components/ProductDemo';
import FeaturesSection from '@/components/FeaturesSection';
import PartnersSection from '@/components/PartnersSection';
import NewsletterSection from '@/components/NewsletterSection';
import FAQSection from '@/components/FAQSection';
import TerminalSection from '@/components/TerminalSection';
import PricingSection from '@/components/PricingSection';
import CTASection from '@/components/CTASection';
import BackToTop from '@/components/BackToTop';
import { labProductIds, productLineIds } from '@/data/product-tracks';
import { products } from '@/data/products';
import { webAppCount } from '@/data/app-manifest';
import { helpArticles } from '@/data/help-articles';
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
      {/* Hero 的四个数字由服务端从真实数据算出：产品总数、可在浏览器直接打开的数量、
          完全免费的数量、帮助文档篇数。全部可核实，且随目录自动变化——
          此前是写死的「1K+ 活跃用户 / 4.9 评分 / < 50ms 延迟」，没有任何数据源 */}
      <HeroSection
        productCount={products.length}
        webAppCount={webAppCount}
        freeCount={labProductIds.length}
        helpCount={helpArticles.length}
      />

      {/* Partners Section */}
      <PartnersSection />

      {/* Products Section */}
      <ProductShowcase />

      {/* Product Demo */}
      <ProductDemo />

      {/* Features Section（核心能力） */}
      <FeaturesSection layout="grid" featureCount={4} />

      {/* Pricing Section —— 全站唯一的定价区块。
          数量在服务端算，且只数主产品线：Pass 不覆盖实验室那七款（它们本来就免费） */}
      {SHOW_PRICING && <PricingSection productCount={productLineIds.length} />}

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
