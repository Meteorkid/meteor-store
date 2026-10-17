'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { getHeaderNavigation, isHeaderLinkActive } from '@/data/header-navigation';
import { SHOW_PRICING } from '@/lib/constants';
import { useAuth } from './AuthProvider';
import UserMenu from './UserMenu';
import LanguageSwitcher from './LanguageSwitcher';
import BrandMark from './BrandMark';
import NotificationBell from './NotificationBell';
import styles from './Header.module.css';

const navigation = getHeaderNavigation(SHOW_PRICING);
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex="0"]';
const accountLinks = [
  { href: '/account', key: 'account' },
  { href: '/apps', key: 'myProducts' },
  { href: '/orders', key: 'myOrders' },
  { href: '/blog/submit', key: 'writeArticle' },
  { href: '/blog/my-posts', key: 'myPosts' },
  { href: '/blog/favorites', key: 'myFavorites' },
  { href: '/redeem', key: 'redeem' },
  { href: '/student', key: 'studentDiscount' },
] as const;

function closeUtilityMenus(except?: EventTarget | null) {
  window.dispatchEvent(new CustomEvent('header:close-popovers', { detail: except }));
}

function isGroupActive(group: (typeof navigation)[number], pathname: string) {
  return pathname.startsWith(`${group.overview.href}/`)
    || [group.overview, ...group.sections.flatMap(section => section.links)].some(link => isHeaderLinkActive(link.href, pathname));
}

function Chevron() {
  return <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function SearchIcon() {
  return <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" /></svg>;
}

export default function Header() {
  const pathname = usePathname();
  const locale = useLocale() === 'en' ? 'en' : 'zh';
  const t = useTranslations('Header');
  const { user, logout } = useAuth();
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  const [animateDesktop, setAnimateDesktop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [animateMobile, setAnimateMobile] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const desktopKeyboard = useRef(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // 同一布局内切页及语言切换也要关闭导航，避免旧页面的菜单留在新页面上。
  const routeKey = `${locale}:${pathname}`;
  const [previousRoute, setPreviousRoute] = useState(routeKey);
  if (previousRoute !== routeKey) {
    setPreviousRoute(routeKey);
    setDesktopOpen(null);
    setMobileOpen(false);
    setMobileGroup(null);
    setFocusWithin(false);
  }

  const clearTimers = useCallback(() => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  }, []);

  const closeDesktop = useCallback(() => {
    clearTimers();
    setDesktopOpen(null);
  }, [clearTimers]);

  const closeMobile = useCallback((restoreFocus = false) => {
    setMobileOpen(false);
    setMobileGroup(null);
    if (restoreFocus) hamburgerRef.current?.focus();
  }, []);

  const closeNavigation = () => {
    closeDesktop();
    closeMobile();
  };

  const openDesktop = (id: string, keyboard = false) => {
    clearTimers();
    closeUtilityMenus();
    desktopKeyboard.current = keyboard;
    setAnimateDesktop(!keyboard && !desktopOpen);
    setDesktopOpen(id);
  };

  const hoverGroup = (id: string, pointerType: string) => {
    if (pointerType === 'touch' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    clearTimers();
    if (desktopOpen === id) return;
    if (desktopOpen) openDesktop(id);
    else openTimer.current = setTimeout(() => openDesktop(id), 120);
  };

  const leaveGroup = () => {
    clearTimers();
    closeTimer.current = setTimeout(() => {
      // 键盘展开时连触发器也属于操作范围，不让无关的鼠标移动收起菜单。
      const currentGroup = desktopOpen ? triggerRefs.current[desktopOpen]?.parentElement : null;
      if (desktopKeyboard.current && currentGroup?.contains(document.activeElement)) return;
      if (!panelRef.current?.contains(document.activeElement)) setDesktopOpen(null);
    }, 200);
  };

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('spotlight:open'));
  };

  useEffect(() => {
    closeUtilityMenus();
    clearTimers();
    return clearTimers;
  }, [routeKey, clearTimers]);

  useEffect(() => {
    const onSearch = () => {
      // 按钮与快捷键共用交接，先释放导航的滚动锁和浮层，再让搜索接管。
      flushSync(() => {
        closeDesktop();
        closeMobile();
        closeUtilityMenus();
      });
    };
    window.addEventListener('spotlight:open', onSearch);
    return () => window.removeEventListener('spotlight:open', onSearch);
  }, [closeDesktop, closeMobile]);

  useEffect(() => {
    let previousY = window.scrollY;
    let rafId = 0;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setHidden(false), 180);
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - previousY;
        setScrolled(y > 20);
        if (y <= 80) setHidden(false);
        else if (Math.abs(delta) > 6) setHidden(delta > 0);
        previousY = y;
        rafId = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      clearTimeout(idleTimer);
    };
  }, []);

  useEffect(() => {
    const onOutsidePointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) closeDesktop();
    };
    const desktopMedia = window.matchMedia('(min-width: 1024px)');
    const onResize = () => {
      closeDesktop();
      closeMobile();
      closeUtilityMenus();
    };
    document.addEventListener('pointerdown', onOutsidePointer);
    desktopMedia.addEventListener('change', onResize);
    window.addEventListener('popstate', onResize);
    window.addEventListener('hashchange', onResize);
    return () => {
      document.removeEventListener('pointerdown', onOutsidePointer);
      desktopMedia.removeEventListener('change', onResize);
      window.removeEventListener('popstate', onResize);
      window.removeEventListener('hashchange', onResize);
    };
  }, [closeDesktop, closeMobile]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => mobileRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus());
    const getFocusable = () => [headerRef.current, mobileRef.current].flatMap(root =>
      Array.from(root?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(element => element.getClientRects().length > 0),
    );
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (headerRef.current?.querySelector('[data-header-popover-open]')) return;
        event.preventDefault();
        closeMobile(true);
      }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const onFocus = (event: FocusEvent) => {
      const target = event.target as Node;
      if (!headerRef.current?.contains(target) && !mobileRef.current?.contains(target)) {
        mobileRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('focusin', onFocus);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focusin', onFocus);
    };
  }, [mobileOpen, closeMobile]);

  const navLabel = locale === 'en' ? 'Main navigation' : '主导航';

  return (
    <>
      <header
        ref={headerRef}
        className={`${styles.header} ${scrolled || desktopOpen || mobileOpen ? styles.headerSurface : ''} ${hidden && !desktopOpen && !mobileOpen && !focusWithin ? styles.headerHidden : ''}`}
        onFocusCapture={() => setFocusWithin(true)}
        onBlurCapture={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setFocusWithin(false);
            closeDesktop();
          }
        }}
        onKeyDown={event => {
          if (event.key === 'Escape' && desktopOpen) {
            event.preventDefault();
            triggerRefs.current[desktopOpen]?.focus();
            closeDesktop();
          }
        }}
      >
        <div className={`container mx-auto ${styles.bar}`}>
          {/* 移动端连点 7 次的流星雨入口需要保留此标记。 */}
          <Link href="/" className={styles.brand} data-meteor-logo onClick={closeNavigation} aria-label={`Meteor Store · ${t('home')}`}>
            <BrandMark className="h-7 w-7" />
            <span className={styles.brandName}>Meteor Store</span>
          </Link>

          <nav className={styles.desktopNav} aria-label={navLabel}>
            {navigation.map(group => {
              const expanded = desktopOpen === group.id;
              const active = isGroupActive(group, pathname);
              return (
                <div key={group.id} onPointerEnter={event => hoverGroup(group.id, event.pointerType)} onPointerLeave={leaveGroup}
                  onBlur={event => { if (desktopOpen === group.id && !event.currentTarget.contains(event.relatedTarget)) closeDesktop(); }}>
                  <button
                    type="button"
                    ref={element => { triggerRefs.current[group.id] = element; }}
                    id={`header-trigger-${group.id}`}
                    aria-expanded={expanded}
                    aria-controls={`header-panel-${group.id}`}
                    data-active={active || undefined}
                    className={styles.navTrigger}
                    onClick={event => expanded ? closeDesktop() : openDesktop(group.id, event.detail === 0)}
                    onKeyDown={event => {
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        openDesktop(group.id, true);
                        requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus());
                      }
                    }}
                  >
                    {group.label[locale]}<Chevron />
                  </button>
                  {expanded && (
                    <div ref={panelRef} id={`header-panel-${group.id}`} aria-labelledby={`header-trigger-${group.id}`} data-animate={animateDesktop || undefined} className={styles.desktopPanel} onPointerEnter={clearTimers}>
                      <div className={`container mx-auto ${styles.panelContent}`}>
                        <div className={styles.panelIntro}>
                          <p className="t-eyebrow">{group.label[locale]}</p>
                          <p className={`t-title-3 ${styles.panelDescription}`}>{group.description[locale]}</p>
                          <Link href={group.overview.href} className={styles.overviewLink} onClick={closeNavigation} aria-current={isHeaderLinkActive(group.overview.href, pathname) ? 'page' : undefined}>
                            {group.overview.label[locale]}<span aria-hidden="true">↗</span>
                          </Link>
                        </div>
                        {group.sections.map(section => (
                          <section className={styles.panelSection} key={section.id} aria-labelledby={`header-section-${group.id}-${section.id}`}>
                            <h2 className={`t-footnote ${styles.sectionLabel}`} id={`header-section-${group.id}-${section.id}`}>{section.label[locale]}</h2>
                            <ul className={styles.linkList}>
                              {section.links.map(link => (
                                <li key={link.id}>
                                  <Link href={link.href} className={styles.panelLink} onClick={closeNavigation} aria-current={isHeaderLinkActive(link.href, pathname) ? 'page' : undefined}>
                                    <span className="t-title-4">{link.label[locale]}</span>
                                    {link.description && <span className={`t-footnote ${styles.linkDescription}`}>{link.description[locale]}</span>}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </section>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className={styles.utilities}
            onClickCapture={event => {
              if (event.target instanceof Element && event.target.closest('a[href]')) {
                closeNavigation();
                closeUtilityMenus();
              }
            }}
            onPointerDownCapture={event => { closeDesktop(); closeUtilityMenus(event.target); }} onFocusCapture={event => { closeDesktop(); closeUtilityMenus(event.target); }}>
            <button type="button" className={styles.iconButton} onClick={openSearch} aria-label={t('search')} title={t('searchShortcutTitle')}><SearchIcon /></button>
            <NotificationBell />
            <LanguageSwitcher />
            <div className={styles.desktopAccount}><UserMenu /></div>
            <button
              ref={hamburgerRef}
              type="button"
              className={`${styles.iconButton} ${styles.hamburger}`}
              aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={mobileOpen}
              aria-controls="header-mobile-panel"
              onClick={event => {
                closeUtilityMenus();
                if (mobileOpen) closeMobile(true);
                else {
                  setAnimateMobile(event.detail > 0);
                  setMobileOpen(true);
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                {mobileOpen ? <path d="m5 5 10 10M5 15 15 5" /> : <path d="M3 6h14M3 14h14" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 与 header 平级，避免 transform/backdrop-filter 把 fixed 面板限制在导航栏高度内。 */}
      {mobileOpen && (
        <div ref={mobileRef} id="header-mobile-panel" data-animate={animateMobile || undefined} className={styles.mobilePanel}>
          <nav className={`container mx-auto ${styles.mobileContent}`} aria-label={navLabel}>
            {navigation.map(group => {
              const expanded = mobileGroup === group.id;
              return (
                <div className={styles.mobileGroup} key={group.id}>
                  <button type="button" className={styles.mobileTrigger} data-active={isGroupActive(group, pathname) || undefined} aria-expanded={expanded} aria-controls={`header-mobile-${group.id}`} onClick={() => setMobileGroup(expanded ? null : group.id)}>
                    <span className="t-title-3">{group.label[locale]}</span><Chevron />
                  </button>
                  {expanded && (
                    <div id={`header-mobile-${group.id}`} className={styles.mobileLinks}>
                      <Link href={group.overview.href} className={styles.overviewLink} onClick={closeNavigation} aria-current={isHeaderLinkActive(group.overview.href, pathname) ? 'page' : undefined}>{group.overview.label[locale]}<span aria-hidden="true">↗</span></Link>
                      {group.sections.map(section => (
                        <section key={section.id}>
                          <h2 className={`t-footnote ${styles.sectionLabel}`}>{section.label[locale]}</h2>
                          <ul className={styles.linkList}>
                            {section.links.map(link => (
                              <li key={link.id}>
                                <Link href={link.href} className={styles.panelLink} onClick={closeNavigation} aria-current={isHeaderLinkActive(link.href, pathname) ? 'page' : undefined}>
                                  <span className="t-title-4">{link.label[locale]}</span>
                                  {link.description && <span className={`t-footnote ${styles.linkDescription}`}>{link.description[locale]}</span>}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </section>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className={styles.mobileAccount}>
              {user ? (
                <>
                  <p className={`t-footnote ${styles.sectionLabel}`}>{user.name || t('defaultUserName')}</p>
                  <div className={styles.accountLinks}>
                    {accountLinks.map(link => <Link key={link.href} href={link.href} className={styles.accountLink} onClick={closeNavigation}>{t(link.key)}</Link>)}
                    {user.isAdmin && (
                      <Link href="/admin" className={styles.accountLink} onClick={closeNavigation}>{t('adminDashboard')}</Link>
                    )}
                  </div>
                  <button type="button" className={styles.logout} onClick={() => { logout(); closeMobile(); }}>{t('logout')}</button>
                </>
              ) : <Link href="/login" className={styles.login} onClick={closeNavigation}>{t('login')}</Link>}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
