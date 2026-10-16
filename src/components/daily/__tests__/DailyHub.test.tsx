import type { AnchorHTMLAttributes } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }));
vi.mock('next-intl', () => ({ useLocale: () => 'zh' }));
vi.mock('@/i18n/navigation', () => ({
  Link: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
  useRouter: () => mocks,
}));
vi.mock('@/components/AuthProvider', () => ({ useAuth: () => ({ user: { id: 'user-1' }, loading: false }) }));

import DailyHub, { type DailyHubProps } from '../DailyHub';
import { DAILY_EDITION_CHANNEL_IDS } from '@/lib/daily/channels';

const baseProps: DailyHubProps = {
  date: '2026-10-15', today: '2026-10-16', editions: [], userId: 'user-1',
  initialPreferences: { channels: [], reminders: false },
};

describe('日刊栏目深链', () => {
  beforeEach(() => vi.clearAllMocks());

  it('全栏目深链的首屏就有每个目标，即使账号明确空选', () => {
    const preferences = { channels: [], reminders: false };
    const html = renderToStaticMarkup(<DailyHub {...baseProps} initialPreferences={preferences} viewAll />);
    for (const channel of DAILY_EDITION_CHANNEL_IDS) expect(html).toContain(`id="${channel}"`);
    expect(preferences).toEqual({ channels: [], reminders: false });
    expect(html).toContain('href="/daily?view=all"');
  });

  it('普通访问仍尊重账号的空选或单栏目选择', () => {
    const empty = renderToStaticMarkup(<DailyHub {...baseProps} />);
    expect(empty).toContain('还没有关注任何栏目');
    expect(empty).not.toContain('id="english"');
    const following = renderToStaticMarkup(<DailyHub {...baseProps} initialPreferences={{ channels: ['papers'], reminders: false }} />);
    expect(following).toContain('id="papers"');
    expect(following).not.toContain('id="english"');
  });
});
