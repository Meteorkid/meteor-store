'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-6xl mb-6">😵</div>
        <h1 className="text-2xl font-bold mb-4">页面出错了</h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          抱歉，页面加载时遇到了问题。请尝试刷新页面或返回首页。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          >
            重试
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-white/10 rounded-lg text-white font-medium hover:bg-white/20 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
