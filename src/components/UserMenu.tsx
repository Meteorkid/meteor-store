'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';

export default function UserMenu() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (loading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200"
      >
        登录
      </Link>
    );
  }

  const initial = (user.name?.[0] || user.email[0]).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white transition-transform hover:scale-105"
        aria-label="用户菜单"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p className="text-sm font-medium text-white">{user.name || '用户'}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <div className="py-1">
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              我的产品
            </Link>
            <Link
              href="/student"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              学生优惠
            </Link>
          </div>
          <div className="border-t border-white/[0.06] py-1">
            <button
              type="button"
              onClick={() => { logout(); setOpen(false); }}
              className="block w-full px-4 py-2 text-left text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-red-400"
            >
              退出登录
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
