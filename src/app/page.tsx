import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ProductShowcase from '@/components/ProductShowcase';
import FeaturesSection from '@/components/FeaturesSection';
import CTASection from '@/components/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Products Section */}
      <ProductShowcase />

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  );
}
