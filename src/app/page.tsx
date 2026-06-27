import Header from '@/components/Header';
import EnhancedFooter from '@/components/EnhancedFooter';
import HeroSection from '@/components/HeroSection';
import ProductShowcase from '@/components/ProductShowcase';
import FeaturesSection from '@/components/FeaturesSection';
import FeaturesGrid from '@/components/FeaturesGrid';
import FeaturesList from '@/components/FeaturesList';
import StatsSection from '@/components/StatsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PartnersSection from '@/components/PartnersSection';
import NewsletterSection from '@/components/NewsletterSection';
import FAQSection from '@/components/FAQSection';
import PricingSection from '@/components/PricingSection';
import FeaturesComparison from '@/components/FeaturesComparison';
import CTABanner from '@/components/CTABanner';
import CTASection from '@/components/CTASection';
import BackToTop from '@/components/BackToTop';

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

      {/* Features Section */}
      <FeaturesSection />

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Features List */}
      <FeaturesList />

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

      {/* CTA Banner */}
      <CTABanner />

      {/* CTA Section */}
      <CTASection />

      <EnhancedFooter />

      {/* Back to top button */}
      <BackToTop />
    </div>
  );
}
