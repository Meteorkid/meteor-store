'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from './AuthProvider';

interface PassStatus {
  hasPass: boolean;
  currentPlan: string | null;
}

export default function UserMenu() {
  const t = useTranslations('Header');
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [passStatus, setPassStatus] = useState<PassStatus | null>(null);

  // 渲染期调整：user 由有变无时重置 Pass 状态（React Compiler：不在 effect 里同步 setState）
  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    if (!user) setPassStatus(null);
  }

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetch('/api/pass/status')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setPassStatus(d);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [user]);

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
        {t('login')}
      </Link>
    );
  }

  const initial = (user.name?.[0] || user.email[0]).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white transition-transform hover:scale-105 overflow-hidden"
        aria-label={t('userMenuAria')}
      >
        {passStatus?.hasPass && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 border border-black" />
          </span>
        )}
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt=""
            width={32}
            height={32}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p className="text-sm font-medium text-white flex items-center gap-2">
              {user.name || t('defaultUserName')}
              {passStatus?.hasPass && (
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500/20 to-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-300">
                  PASS
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <div className="py-1">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              {t('account')}
            </Link>
            <Link
              href="/blog/submit"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              {t('writeArticle')}
            </Link>
            <Link
              href="/blog/my-posts"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              {t('myPosts')}
            </Link>
            <Link
              href="/blog/favorites"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              {t('myFavorites')}
            </Link>
            {user.isAdmin && (
              <>
                <Link
                  href="/admin/review"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-amber-300/80 transition-colors hover:bg-white/5 hover:text-amber-300"
                >
                  {t('pendingReview')}
                </Link>
                <Link
                  href="/admin/invite-codes"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-amber-300/80 transition-colors hover:bg-white/5 hover:text-amber-300"
                >
                  {t('inviteCodes')}
                </Link>
              </>
            )}
            <Link
              href="/apps"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              {t('myProducts')}
            </Link>
            <Link
              href="/redeem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              {t('redeem')}
            </Link>
            <Link
              href="/student"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              {t('studentDiscount')}
            </Link>
          </div>
          <div className="border-t border-white/[0.06] py-1">
            <button
              type="button"
              onClick={() => { logout(); setOpen(false); }}
              className="block w-full px-4 py-2 text-left text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-red-400"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
