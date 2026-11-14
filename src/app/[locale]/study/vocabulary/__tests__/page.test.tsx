import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ getSession: vi.fn(), listVocabulary: vi.fn(), redirect: vi.fn(), manager: vi.fn() }));
vi.mock('@/lib/auth', () => ({ getSession: mocks.getSession }));
vi.mock('@/lib/study/vocabulary-service', () => ({ listVocabulary: mocks.listVocabulary }));
vi.mock('next-intl/server', () => ({ setRequestLocale: vi.fn() }));
vi.mock('@/i18n/navigation', () => ({ redirect: (input: unknown) => { mocks.redirect(input); throw new Error('NEXT_REDIRECT'); } }));
vi.mock('@/components/study/VocabularyManager', () => ({ default: (props: unknown) => { mocks.manager(props); return <div>VOCABULARY_MANAGER</div>; } }));

import VocabularyPage, { dynamic, generateMetadata } from '../page';

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getSession.mockResolvedValue({ userId: 'user-a' });
  mocks.listVocabulary.mockResolvedValue({ entries: [], total: 0, dueCount: 0, nextCursor: null });
});

describe('私人生词本页面', () => {
  it('未登录保留生词本目的地，且不查询私人记录', async () => {
    mocks.getSession.mockResolvedValue(null);
    await expect(VocabularyPage({ params: Promise.resolve({ locale: 'en' }) })).rejects.toThrow('NEXT_REDIRECT');
    expect(mocks.redirect).toHaveBeenCalledWith({ href: '/login?next=%2Fstudy%2Fvocabulary', locale: 'en' });
    expect(mocks.listVocabulary).not.toHaveBeenCalled();
  });

  it('按session账号读取首50条，双语页面禁止索引', async () => {
    const html = renderToStaticMarkup(await VocabularyPage({ params: Promise.resolve({ locale: 'en' }) }));
    expect(html).toContain('My vocabulary');
    expect(mocks.listVocabulary).toHaveBeenCalledWith('user-a', { limit: 50 });
    expect(mocks.manager).toHaveBeenCalledWith(expect.objectContaining({ ownerId: 'user-a', locale: 'en' }));
    expect(await generateMetadata({ params: Promise.resolve({ locale: 'zh' }) })).toMatchObject({ robots: { index: false, follow: false } });
    expect(dynamic).toBe('force-dynamic');
  });

  it('数据库失败以null传给管理器，不伪造空列表', async () => {
    mocks.listVocabulary.mockRejectedValue(new Error('offline'));
    renderToStaticMarkup(await VocabularyPage({ params: Promise.resolve({ locale: 'zh' }) }));
    expect(mocks.manager).toHaveBeenCalledWith(expect.objectContaining({ initialData: null }));
  });
});
