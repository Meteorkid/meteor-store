import Link from 'next/link';
import KaleidoscopeCanvas from '@/components/KaleidoscopeCanvas';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* 镜面万花筒背景 */}
      <KaleidoscopeCanvas />

      <div className="relative text-center">
        <p className="text-8xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          404
        </p>
        <h1 className="text-2xl font-bold text-white mb-4">镜中无此页</h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          这个页面可能去打工赚学费了，替它向你道个歉。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            返回首页
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/15 text-white/80 rounded-lg hover:bg-white/5 transition-colors font-medium"
          >
            看看产品（顺便帮它凑凑学费）
          </Link>
        </div>
        <p className="text-white/25 text-xs mt-10">
          盯着万花筒看 10 秒，有助于原谅一切 404
        </p>
      </div>
    </div>
  );
}
