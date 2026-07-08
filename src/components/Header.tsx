'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SHOW_PRICING } from '@/lib/constants';

const navLinks = [
  { label: '首页', href: '/' },
  { label: '产品', href: '/products' },
  ...(SHOW_PRICING ? [{ label: '定价', href: '/#pricing' }] : []),
  { label: '文档', href: '/docs' },
  { label: '博客', href: '/blog' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        rafId = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-border bg-background/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        {/* data-meteor-logo: 移动端连点 7 次触发流星雨秘技（见 EasterEggs） */}
        <Link href="/" className="flex items-center gap-2 group" data-meteor-logo>
          <span className="text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">🚀</span>
          <span className="text-xl font-bold gradient-text">Meteor Store</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="https://github.com/Meteorkid"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-all duration-200"
          >
            GitHub
          </Link>
          {/* Spotlight 搜索入口 */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('spotlight:open'))}
            aria-label="搜索（快捷键 ⌘K）"
            title="搜索 ⌘K"
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
            </svg>
            <kbd className="text-[10px] border border-white/15 rounded px-1 py-0.5 font-mono text-white/40">⌘K</kbd>
          </button>
          <div className="w-px h-5 bg-border mx-2" />
          {SHOW_PRICING ? (
            <Link
              href="/#pricing"
              className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-purple-6 to-pink-6 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              开始使用
            </Link>
          ) : (
            <Link
              href="/products"
              className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-purple-6 to-pink-6 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              浏览产品
            </Link>
          )}
        </nav>

        {/* Mobile: 搜索 + Hamburger */}
        <div className="md:hidden flex items-center gap-1">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('spotlight:open'))}
          aria-label="搜索"
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5 text-foreground/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
          </svg>
        </button>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-lg text-foreground hover:bg-white/5 rounded-xl transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="https://github.com/Meteorkid"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="px-4 py-3 text-lg text-foreground hover:bg-white/5 rounded-xl transition-colors"
          >
            GitHub
          </Link>
          <div className="h-px bg-border my-4" />
          <Link
            href={SHOW_PRICING ? '/#pricing' : '/products'}
            onClick={() => setMobileOpen(false)}
            className="px-6 py-3 text-lg font-medium bg-gradient-to-r from-purple-6 to-pink-6 text-white rounded-xl text-center hover:opacity-90 transition-opacity"
          >
            {SHOW_PRICING ? '开始使用' : '浏览产品'}
          </Link>
        </nav>
      </div>
    </header>
  );
}
