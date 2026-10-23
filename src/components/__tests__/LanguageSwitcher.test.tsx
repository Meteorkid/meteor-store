import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const navigation = vi.hoisted(() => ({
  locale: 'zh',
  pathname: '/daily',
  replace: vi.fn(),
}));

vi.mock('next-intl', () => ({ useLocale: () => navigation.locale }));
vi.mock('@/i18n/navigation', () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ replace: navigation.replace }),
}));

import LanguageSwitcher from '../LanguageSwitcher';

beforeEach(() => {
  navigation.locale = 'zh';
  navigation.pathname = '/daily';
  navigation.replace.mockClear();
});
afterEach(() => vi.unstubAllGlobals());

describe('语言切换保留当前位置', () => {
  it.each([
    ['/daily', '?view=all&date=2026-10-16', '#internships'],
    ['/masters', '?year=2027&region=hong-kong', '#round-example'],
    ['/login', '?next=%2Fproducts%2Fxisland%23download', ''],
    ['/products', '', '#lab'],
    ['/docs', '', ''],
  ])('%s 的查询参数和锚点随语言一起切换', (pathname, search, hash) => {
    navigation.pathname = pathname;
    vi.stubGlobal('window', { location: { search, hash } });

    LanguageSwitcher().props.onClick();

    expect(navigation.replace).toHaveBeenCalledExactlyOnceWith(`${pathname}${search}${hash}`, { locale: 'en' });
  });

  it('从英文切回中文时保留点击时的最新锚点', () => {
    navigation.locale = 'en';
    const location = { search: '?view=all', hash: '#papers' };
    vi.stubGlobal('window', { location });
    const button = LanguageSwitcher();
    location.hash = '#open-source';

    button.props.onClick();

    expect(navigation.replace).toHaveBeenCalledExactlyOnceWith('/daily?view=all#open-source', { locale: 'zh' });
  });

  it.each([
    ['https://www.imagentx.top/en/blog/tag/Shared', '/blog/tag/Shared?section=tech#results'],
    [null, '/blog/tags'],
    ['https://outside.example/en/blog/tag/Shared', '/blog/tags'],
    ['https://www.imagentx.top/zh/blog/tag/Shared', '/blog/tags'],
    ['https://www.imagentx.top/en/account', '/blog/tags'],
    ['https://user@www.imagentx.top/en/blog/tag/Shared', '/blog/tags'],
  ])('标签页只接受真实本站目标语言候选：%s', (href, expected) => {
    navigation.pathname = '/blog/tag/SHARED';
    vi.stubGlobal('window', { location: { origin: 'https://www.imagentx.top', search: '?section=tech', hash: '#results' } });
    vi.stubGlobal('document', { querySelector: () => href ? { getAttribute: () => href } : null });
    LanguageSwitcher().props.onClick();
    expect(navigation.replace).toHaveBeenCalledExactlyOnceWith(expected, { locale: 'en' });
  });

  it('英文标签切回真实中文候选，在本地预览也只采用本站规范地址', () => {
    navigation.locale = 'en'; navigation.pathname = '/blog/tag/Shared';
    vi.stubGlobal('window', { location: { origin: 'http://127.0.0.1:3000', search: '', hash: '' } });
    vi.stubGlobal('document', { querySelector: () => ({ getAttribute: () => 'https://www.imagentx.top/zh/blog/tag/SHARED' }) });
    LanguageSwitcher().props.onClick();
    expect(navigation.replace).toHaveBeenCalledExactlyOnceWith('/blog/tag/SHARED', { locale: 'zh' });
  });
});
