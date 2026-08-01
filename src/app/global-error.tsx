'use client';

import { useEffect, useState } from 'react';
import zhMessages from '../../messages/zh.json';
import enMessages from '../../messages/en.json';

type Messages = typeof zhMessages;

function getMessages(): Messages {
  if (typeof window !== 'undefined') {
    return window.location.pathname.startsWith('/en') ? enMessages : zhMessages;
  }
  return zhMessages;
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [messages, setMessages] = useState<Messages>(zhMessages);

  useEffect(() => {
    setMessages(getMessages());
    console.error('Global error:', error);
  }, [error]);

  const t = messages.GlobalError;
  const locale = messages === enMessages ? 'en' : 'zh';

  return (
    <html lang={locale === 'en' ? 'en' : 'zh-CN'}>
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
