import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '博客 - Meteor Store',
  description: 'Meteor Store 技术博客与产品动态',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">博客</h1>
          <p className="text-gray-400 text-lg mb-12">
            产品更新、技术分享和行业洞察
          </p>

          {/* 占位内容 */}
          <div className="text-center py-20">
            <div className="text-6xl mb-6">✍️</div>
            <h2 className="text-2xl font-semibold mb-3">即将上线</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              我们正在准备精彩的技术内容。敬请期待产品更新日志、
              技术教程和行业洞察文章。
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
