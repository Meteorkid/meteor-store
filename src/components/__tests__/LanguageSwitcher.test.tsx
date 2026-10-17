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
});
