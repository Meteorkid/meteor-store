import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a href={String(href)} {...props} />,
}));
import {
  competitionSources,
  nationalCompetitionClassNotes,
  nationalCompetitions,
} from '@/data/national-competitions';
import type { CompetitionFilters } from '@/lib/national-competitions';
import NationalCompetitionPlanner from '../NationalCompetitionPlanner';

const filters: CompetitionFilters = { query: '', field: '', status: 'all', sort: 'soon' };
const nowIso = '2026-11-12T04:00:00.000Z';

function render(locale: 'zh' | 'en' = 'zh', overrides: Partial<CompetitionFilters> = {}) {
  return renderToStaticMarkup(<NationalCompetitionPlanner
    locale={locale}
    year={2026}
    years={[2026, 2025]}
    nowIso={nowIso}
    competitions={nationalCompetitions}
    filters={{ ...filters, ...overrides }}
    bClassNote={nationalCompetitionClassNotes.b[locale]}
    sources={competitionSources}
  />);
}

describe('国家级学科竞赛规划表', () => {
  it('中文页面同时呈现 A 类表格、年度切换、状态和 B 类认定', () => {
    const html = render();
    expect(html).toContain('国家级学科竞赛规划表');
    expect(html).toContain('国家级 A 类');
    expect(html).toContain('国家级 B 类认定');
    expect(html).toContain('57 项赛事');
    expect(html).toContain('全国大学生电子设计竞赛');
    expect(html).toContain('2026-06 — 2026-08');
    expect(html).toContain('已结束');
    expect(html).toContain('nuedcchina.com');
    expect(html).toContain('国家级 B 类没有固定赛事名单');
    expect(html).toContain('2025');
  });

  it('搜索和状态筛选只保留符合条件的赛事', () => {
    const html = render('zh', { query: '电子设计', status: 'ended' });
    expect(html).toContain('全国大学生电子设计竞赛');
    expect(html).not.toContain('全国大学生数学建模竞赛');
    expect(html).toContain('找到 1 项');
  });

  it('英文界面本地化操作文案，保留官方中文赛事名', () => {
    const html = render('en');
    expect(html).toContain('National Academic Competition Planner');
    expect(html).toContain('Registration window');
    expect(html).toContain('National Class B criteria');
    expect(html).toContain('Official competition names are shown in Chinese.');
  });
});

