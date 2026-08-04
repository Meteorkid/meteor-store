'use client';

import { useEffect, useSyncExternalStore } from 'react';
import zhMessages from '../../messages/zh.json';
import enMessages from '../../messages/en.json';
// global-error 会替换根布局，拿不到 [locale]/layout.tsx 里的那次 import，
// 不显式引一次的话下面的 Tailwind 类全是空转，只剩 UA 默认样式撑着
import './globals.css';

function subscribePathname(notify: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('popstate', notify);
  return () => window.removeEventListener('popstate', notify);
}

function readLocale(): 'zh' | 'en' {
  if (typeof window === 'undefined') return 'zh';
  return window.location.pathname.startsWith('/en') ? 'en' : 'zh';
}

function readLocaleServer(): 'zh' | 'en' {
  return 'zh';
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useSyncExternalStore(subscribePathname, readLocale, readLocaleServer);
  const messages = locale === 'en' ? enMessages : zhMessages;

  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  const t = messages.GlobalError;

  return (
    // global-error 会替换掉根布局，拿不到 [locale]/layout 的 viewport 声明，
    // 所以这里自己声明一次 color-scheme，避免浅色系统下错误页出现白色滚动条
    <html lang={locale === 'en' ? 'en' : 'zh-CN'} style={{ colorScheme: 'dark' }}>
      <body className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-6">💥</div>
          <h1 className="text-2xl font-bold mb-4">{t.title}</h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            {t.description}
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          >
            {t.reload}
          </button>
        </div>
      </body>
    </html>
  );
}
