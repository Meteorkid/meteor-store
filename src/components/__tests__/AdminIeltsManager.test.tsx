import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import AdminIeltsManager, { type AdminIeltsPair, type AdminIeltsRow } from '@/components/admin/AdminIeltsManager';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, locale, children, ...props }: { href: string; locale: string; children: ReactNode }) =>
    <a href={`/${locale}${href}`} {...props}>{children}</a>,
}));

const row: AdminIeltsRow = {
  slug: 'generated-draft', task: 'task2', category: 'opinion', topic: 'education', status: 'draft',
  source: 'generated', sortOrder: 0, title: { zh: '待检查草稿', en: 'Draft to review' },
  updatedAt: '2026-11-14T00:00:00.000Z', inCurated: false,
};
const filePair: AdminIeltsPair = {
  slug: 'curated-public', task: 'task2', category: 'opinion', topic: 'education',
  source: 'curated', sortOrder: 1, title: { zh: '文件精选', en: 'Curated pair' }, fromDatabase: false,
};

describe('雅思后台预览入口', () => {
  it.each(['zh', 'en'] as const)('%s 数据库行打开专属预览，纯文件打开公开详情', locale => {
    const html = renderToStaticMarkup(<AdminIeltsManager locale={locale} initialRows={[row]} initialPairs={[filePair]} />);
    expect(html).toContain(`href="/${locale}/admin/ielts/${row.slug}"`);
    expect(html).toContain(`href="/${locale}/study/ielts/${filePair.slug}"`);
    expect(html).not.toContain(`/study/ielts/${row.slug}`);
    expect(html).toContain(locale === 'zh' ? '预览' : 'Preview');
    expect(html.indexOf(`/admin/ielts/${row.slug}`)).toBeLessThan(html.lastIndexOf(locale === 'zh' ? '发布' : 'Publish'));
  });

  it.each(['hidden', 'published'] as const)('%s 数据库行也保留专属预览', status => {
    const html = renderToStaticMarkup(<AdminIeltsManager locale="zh" initialRows={[{ ...row, status }]} initialPairs={[]} />);
    expect(html).toContain(`href="/zh/admin/ielts/${row.slug}"`);
  });
});
