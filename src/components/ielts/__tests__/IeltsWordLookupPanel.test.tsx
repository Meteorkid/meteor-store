import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import IeltsWordLookupPanel from '../IeltsWordLookupPanel';
import type { WordLookupRequest } from '@/lib/ielts/word-lookup';

const request: WordLookupRequest = { slug: 'test-essay', segmentIndex: 0, side: 'high', word: 'benefits' };

function render(locale: 'zh' | 'en') {
  return renderToStaticMarkup(<IeltsWordLookupPanel request={request} locale={locale} anchor={{} as HTMLElement} onClose={() => {}} />);
}

afterEach(() => vi.unstubAllGlobals());

describe('IeltsWordLookupPanel 初始语义', () => {
  it('提供可命名的非模态对话框与中文加载、关闭入口', () => {
    const html = render('zh');
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="false"');
    const titleId = html.match(/aria-labelledby="([^"]+)"/)?.[1];
    expect(titleId).toBeTruthy();
    expect(html).toContain(`id="${titleId}"`);
    expect(html).toContain('benefits</h3>');
    expect(html).toContain('aria-label="关闭词语释义"');
    expect(html).toContain('正在查询当前句中的意思');
  });

  it('英文界面在释义返回前已提供可用的朗读按钮', () => {
    const html = render('en');
    expect(html).toContain('Close word meaning');
    expect(html).toContain('Looking up the meaning in this sentence');
    expect(html).toContain('Read aloud</button>');
    expect(html).not.toContain('disabled');
    expect(html).not.toContain('aria-modal="true"');
  });

  it('静态渲染不发请求、不播放语音、不把未返回结果标为 AI 释义', () => {
    const fetch = vi.fn();
    const speak = vi.fn();
    vi.stubGlobal('fetch', fetch);
    vi.stubGlobal('speechSynthesis', { speak });
    const html = render('zh');
    expect(fetch).not.toHaveBeenCalled();
    expect(speak).not.toHaveBeenCalled();
    expect(html).not.toContain('AI 语境释义');
    expect(html).not.toContain('本文词汇');
  });
});
