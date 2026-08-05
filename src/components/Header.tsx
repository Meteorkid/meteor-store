'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { SHOW_PRICING } from '@/lib/constants';
import { useAuth } from './AuthProvider';
import UserMenu from './UserMenu';
import LanguageSwitcher from './LanguageSwitcher';

const navLinks = [
  { key: 'home', href: '/' },
  { key: 'products', href: '/products' },
  ...(SHOW_PRICING ? [{ key: 'pricing', href: '/#pricing' }] : []),
  { key: 'docs', href: '/docs' },
  { key: 'blog', href: '/blog' },
  { key: 'openSource', href: '/open-source' },
  { key: 'pathfinder', href: '/pathfinder' },
];

/** 当前页高亮：锚点链接不参与，其余按路径前缀匹配 */
function isActiveLink(href: string, pathname: string): boolean {
  if (href.includes('#')) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

// 顶部这段距离内导航栏始终可见
const REVEAL_ZONE = 80;
// 忽略小于该值的滚动抖动，避免导航栏频繁闪烁
const DIRECTION_THRESHOLD = 6;
// 停止滚动多久后重新显示导航栏
const IDLE_REVEAL_DELAY = 180;

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations('Header');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // 向下滚动时隐藏；向上滚动或停止滚动时恢复显示
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const { user, logout } = useAuth();

  useEffect(() => {
    let rafId = 0;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setHidden(false), IDLE_REVEAL_DELAY);

      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastScrollY.current;
        setScrolled(y > 20);
        if (y <= REVEAL_ZONE) {
          setHidden(false);
        } else if (Math.abs(delta) > DIRECTION_THRESHOLD) {
          setHidden(delta > 0);
        }
        lastScrollY.current = y;
        rafId = 0;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full will-change-transform transition-all duration-300 motion-reduce:transition-none ${
        scrolled
          ? 'glass !border-b-0 !shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.3),0_4px_24px_rgba(0,0,0,0.35)]'
          : 'bg-transparent'
      } ${hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        {/* data-meteor-logo: 移动端连点 7 次触发流星雨秘技（见 EasterEggs） */}
        <Link href="/" className="flex items-center gap-2 group" data-meteor-logo>
          <span className="text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">☄️</span>
          <span className="text-xl font-bold gradient-text">Meteor Store</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActiveLink(link.href, pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  active
                    ? 'text-white bg-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
          {/* Spotlight 搜索入口 */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('spotlight:open'))}
            aria-label={t('searchShortcut')}
            title={t('searchShortcutTitle')}
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
            </svg>
            <kbd className="text-[10px] border border-white/15 rounded px-1 py-0.5 font-mono text-white/40">⌘K</kbd>
          </button>
          <div className="w-px h-5 bg-border mx-2" />
          <LanguageSwitcher />
          <UserMenu />
        </nav>

        {/* Mobile: 搜索 + Hamburger */}
        <div className="md:hidden flex items-center gap-1">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('spotlight:open'))}
          aria-label={t('search')}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5 text-foreground/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
          </svg>
        </button>
        <LanguageSwitcher />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span
              className={`block h-0.5 bg-foreground rounded-full transition-all duration-300 origin-center ${
                mobileOpen ? 'rotate-45 translate-y-[7px]' : ''
              }`}
            />
            <span
              className={`block h-0.5 bg-foreground rounded-full transition-all duration-200 ${
                mobileOpen ? 'opacity-0 scale-x-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 bg-foreground rounded-full transition-all duration-300 origin-center ${
                mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''
              }`}
            />
          </div>
        </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-xl transition-all duration-300 z-40 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="container mx-auto px-4 py-8 flex flex-col gap-2">
          {navLinks.map((link) => {
            const active = isActiveLink(link.href, pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`px-4 py-3 text-lg rounded-xl transition-colors ${
                  active ? 'bg-white/[0.09] text-white' : 'text-foreground hover:bg-white/5'
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
          <div className="h-px bg-border my-4" />
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-4 py-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                  {(user.name?.[0] || user.email[0]).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{user.name || t('defaultUserName')}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-lg text-foreground hover:bg-white/5 rounded-xl transition-colors"
              >
                {t('account')}
              </Link>
              <Link
                href="/blog/submit"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-lg text-foreground hover:bg-white/5 rounded-xl transition-colors"
              >
                {t('writeArticle')}
              </Link>
              <Link
                href="/blog/my-posts"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-lg text-foreground hover:bg-white/5 rounded-xl transition-colors"
              >
                {t('myPosts')}
              </Link>
              <Link
                href="/blog/favorites"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-lg text-foreground hover:bg-white/5 rounded-xl transition-colors"
              >
                {t('myFavorites')}
              </Link>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-lg text-amber-300/80 hover:bg-white/5 rounded-xl transition-colors"
                >
                  {t('adminDashboard')}
                </Link>
              )}
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="w-full px-6 py-3 text-lg font-medium text-red-400 hover:bg-white/5 rounded-xl text-center transition-colors"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="px-6 py-3 text-lg font-medium bg-gradient-to-r from-purple-6 to-pink-6 text-white rounded-xl text-center hover:opacity-90 transition-opacity block"
            >
              {t('login')}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
