import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PlaygroundTabs from '@/components/PlaygroundTabs';

export const metadata: Metadata = {
  title: 'Playground - Meteor Store',
  description: '在浏览器里试玩 Meteor Store 产品，不用安装，不用付费。',
};

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
            Playground
          </p>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">在线试玩</h1>
          <p className="mb-14 max-w-2xl text-lg text-gray-400">
            不用安装，不用付费。点击运行，看产品跑起来。
          </p>

          <PlaygroundTabs />
        </div>
      </main>
      <Footer />
    </div>
  );
}
