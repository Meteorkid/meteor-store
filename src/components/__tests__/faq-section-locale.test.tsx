import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ locale: 'en' }));
vi.mock('next-intl', () => ({
  useLocale: () => state.locale,
  useTranslations: () => (key: string) => key,
}));

import FAQSection from '../FAQSection';

describe('FAQSection 本地化', () => {
  it('英文首页的 FAQ 使用英文问题和答案，不回落成中文', () => {
    state.locale = 'en';
    const html = renderToStaticMarkup(<FAQSection />);
    expect(html).toContain('Do products get updates?');
    expect(html).toContain('We continue to maintain our products');
    expect(html).not.toContain('产品是否提供更新？');
    expect(html).not.toMatch(/[\u4e00-\u9fff]/);
  });
});
