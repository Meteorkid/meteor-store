import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                Meteor Store
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              高质量的开发者工具和 AI 应用
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              从爬虫框架到 AI 记忆系统，从 3D 解剖平台到设计工具，
              我们提供一系列精心打造的工具，帮助你提升效率。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#products"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                浏览产品
              </a>
              <a
                href="https://github.com/Meteorkid"
                target="_blank"
                className="px-8 py-4 bg-white/10 rounded-xl text-white font-semibold text-lg hover:bg-white/20 transition-colors"
              >
                查看 GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">产品列表</h2>
            <p className="text-gray-400 text-lg">选择适合你的工具</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">为什么选择我们</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-2">高性能</h3>
              <p className="text-gray-400">
                所有工具都经过精心优化，确保最佳性能
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-white mb-2">安全可靠</h3>
              <p className="text-gray-400">
                隐私保护是我们的首要任务
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold text-white mb-2">持续更新</h3>
              <p className="text-gray-400">
                我们不断改进产品，添加新功能
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10 p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              准备好开始了吗？
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              立即选择适合你的产品，提升你的工作效率
            </p>
            <a
              href="#products"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              立即开始
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
