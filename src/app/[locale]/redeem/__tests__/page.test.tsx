import { describe, expect, it, vi } from 'vitest';
vi.mock('next-intl/server', () => ({ setRequestLocale: vi.fn(), getTranslations: async () => (key: string) => key === 'title' ? '历史邀请码兑换' : '仅供此前发出的历史邀请码兑换' }));
vi.mock('@/components/Header', () => ({ default: () => null }));
vi.mock('@/components/Footer', () => ({ default: () => null }));
vi.mock('@/components/RedeemForm', () => ({ default: () => null }));
vi.mock('@/lib/auth', () => ({ getSession: vi.fn() }));
vi.mock('@/i18n/navigation', () => ({ redirect: vi.fn() }));
import { generateMetadata } from '../page';

describe('历史兑换页元信息', () => {
  it('保留历史页面但不进入搜索索引', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: 'zh' }) });
    expect(metadata.title).toBe('历史邀请码兑换');
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
