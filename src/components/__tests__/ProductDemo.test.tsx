import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import zh from '../../../messages/zh.json';
import en from '../../../messages/en.json';

const state = vi.hoisted(() => ({ activeDemo: 0, locale: 'zh' as 'zh' | 'en' }));

vi.mock('react', async (importOriginal) => ({
  ...await importOriginal<typeof import('react')>(),
  useState: () => [state.activeDemo, vi.fn()],
}));
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const messages = state.locale === 'en' ? en.ProductDemo : zh.ProductDemo;
    return messages[key as keyof typeof messages];
  },
}));
vi.mock('@/i18n/navigation', () => ({ Link: 'a' }));

import ProductDemo from '../ProductDemo';

describe('产品演示标题与当前产品一致', () => {
  it.each(['zh', 'en'] as const)('%s Ex-Memory 显示首用流程，移除 API 产品预期', (locale) => {
    state.locale = locale;
    state.activeDemo = 1;
    const messages = locale === 'en' ? en.ProductDemo : zh.ProductDemo;
    const html = renderToStaticMarkup(<ProductDemo />);

    expect(html).toContain(messages.memoryEyebrow);
    expect(html).toContain(messages.memoryTitle);
    expect(html).toContain(messages.memorySubtitle);
    expect(html).toContain(messages.demo2Step1Title);
    expect(html).toContain(messages.demo2Step2Title);
    expect(html).toContain(messages.demo2Step3Title);
    expect(html).not.toContain(messages.title);
    expect(html).not.toContain("import { Memory }");
  });

  it.each([0, 2])('其他产品第 %i 项保持原来的代码演示标题', (activeDemo) => {
    state.locale = 'zh';
    state.activeDemo = activeDemo;
    const html = renderToStaticMarkup(<ProductDemo />);

    expect(html).toContain(zh.ProductDemo.eyebrow);
    expect(html).toContain(zh.ProductDemo.title);
    expect(html).toContain(zh.ProductDemo.subtitle);
    expect(html).not.toContain(zh.ProductDemo.memoryTitle);
  });
});
