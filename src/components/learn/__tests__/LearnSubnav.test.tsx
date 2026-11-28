import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ pathname: '/pathfinder/opportunities' }));
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
vi.mock('@/i18n/navigation', () => ({
  usePathname: () => state.pathname,
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode } & Record<string, unknown>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

import LearnSubnav from '../LearnSubnav';

function render(pathname: string) {
  state.pathname = pathname;
  return renderToStaticMarkup(<LearnSubnav />);
}

describe('学习与机会统一栏目条', () => {
  it('发现页把机会库、主题与机构、本周收在第二级', () => {
    const html = render('/pathfinder/opportunities');
    expect(html).toContain('href="/pathfinder/opportunities"');
    expect(html).toContain('href="/pathfinder/topics"');
    expect(html).toContain('href="/pathfinder/weekly"');
    expect(html).toContain('aria-label="secondaryAria"');
    expect((html.match(/aria-current="true"/g) ?? [])).toHaveLength(1);
    expect((html.match(/aria-current="page"/g) ?? [])).toHaveLength(1);
    expect(html).not.toContain('href="/study/courses"');
  });

  it('学习工作台不再平铺所有学习页，课程、算法、写作、生词本归到第二级', () => {
    const html = render('/study/courses');
    expect(html).toContain('href="/study/courses"');
    expect(html).toContain('href="/study/algorithms"');
    expect(html).toContain('href="/study/ielts"');
    expect(html).toContain('href="/study/vocabulary"');
    expect(html).not.toContain('href="/pathfinder/opportunities"');
    expect((html.match(/aria-current="true"/g) ?? [])).toHaveLength(1);
    expect((html.match(/aria-current="page"/g) ?? [])).toHaveLength(1);
  });

  it('雅思听力是一级入口，不再被工作台或写作吞掉', () => {
    const html = render('/study/ielts/listening');
    expect((html.match(/aria-current="true"/g) ?? [])).toHaveLength(1);
    expect(html).not.toContain('aria-label="secondaryAria"');
    expect(html).not.toContain('aria-current="page"');
  });

  it('申请日历只保留一级入口，不与日历页内部的硕士/博士 Tab 重复', () => {
    const html = render('/masters');
    expect(html).toContain('href="/masters"');
    expect(html).toContain('aria-current="true"');
    expect(html).not.toContain('aria-label="secondaryAria"');
    expect(html).not.toContain('href="/phd"');
  });

  it('一级导航包含七个有区别的目的地', () => {
    const html = render('/pathfinder');
    for (const href of ['/pathfinder', '/study', '/study/ielts/listening', '/pathfinder/directions/ai', '/pathfinder/plan', '/masters', '/pathfinder/saved']) {
      expect(html).toContain(`href="${href}"`);
    }
  });
});
