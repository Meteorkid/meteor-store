'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-6">💥</div>
          <h1 className="text-2xl font-bold mb-4">应用出错了</h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            抱歉，应用遇到了严重错误。请尝试刷新页面。
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          >
            重新加载
          </button>
        </div>
      </body>
    </html>
  );
}
