import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ParticleBackground from '@/components/ParticleBackground';
import GlowButton from '@/components/GlowButton';
import { products } from '@/data/products';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Particle Background */}
        <ParticleBackground />

        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-pink-500/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">
                Meteor Store
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              高质量的开发者工具和 AI 应用
            </p>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              从爬虫框架到 AI 记忆系统，从 3D 解剖平台到设计工具，
              我们提供一系列精心打造的工具，帮助你提升效率。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlowButton variant="primary" size="lg">
                <a href="#products">浏览产品</a>
              </GlowButton>
              <GlowButton variant="ghost" size="lg">
                <a href="https://github.com/Meteorkid" target="_blank">查看 GitHub</a>
              </GlowButton>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 scroll-animate">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">产品列表</h2>
            <p className="text-muted-foreground text-lg">选择适合你的工具</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div key={product.id} className="scroll-animate" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 scroll-animate">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">为什么选择我们</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 scroll-animate" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl mb-4 animate-float">🚀</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">高性能</h3>
              <p className="text-muted-foreground">
                所有工具都经过精心优化，确保最佳性能
              </p>
            </div>
            <div className="text-center p-6 scroll-animate" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl mb-4 animate-float" style={{ animationDelay: '0.5s' }}>🔒</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">安全可靠</h3>
              <p className="text-muted-foreground">
                隐私保护是我们的首要任务
              </p>
            </div>
            <div className="text-center p-6 scroll-animate" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl mb-4 animate-float" style={{ animationDelay: '1s' }}>💡</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">持续更新</h3>
              <p className="text-muted-foreground">
                我们不断改进产品，添加新功能
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 to-pink-500/20 border border-border p-12 text-center scroll-animate">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              准备好开始了吗？
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              立即选择适合你的产品，提升你的工作效率
            </p>
            <GlowButton variant="primary" size="lg">
              <a href="#products">立即开始</a>
            </GlowButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
