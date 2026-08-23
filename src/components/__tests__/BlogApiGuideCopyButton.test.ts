import { describe, expect, it, vi } from 'vitest';
import {
  copyBlogApiGuide,
  getBlogApiGuideCopyLabel,
} from '../BlogApiGuideCopyButton';

describe('BlogApiGuideCopyButton', () => {
  it('请求调用指南并把完整 Markdown 原样写入剪贴板', async () => {
    const markdown = '# 博客发布 API\n\n完整调用指南。\n';
    const fetchGuide = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue(markdown),
    });
    const writeText = vi.fn().mockResolvedValue(undefined);

    await copyBlogApiGuide(fetchGuide, writeText);

    expect(fetchGuide).toHaveBeenCalledWith('/api/guide');
    expect(writeText).toHaveBeenCalledWith(markdown);
  });

  it('接口失败时不写入剪贴板', async () => {
    const fetchGuide = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    const writeText = vi.fn();

    await expect(copyBlogApiGuide(fetchGuide, writeText)).rejects.toThrow('500');
    expect(writeText).not.toHaveBeenCalled();
  });

  it('剪贴板写入失败时向调用方报告错误', async () => {
    const fetchGuide = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue('# 指南'),
    });
    const writeText = vi.fn().mockRejectedValue(new Error('clipboard denied'));

    await expect(copyBlogApiGuide(fetchGuide, writeText)).rejects.toThrow('clipboard denied');
  });

  it('为中英文状态提供可感知文案', () => {
    expect(getBlogApiGuideCopyLabel('zh', 'idle')).toBe('复制给 LLM');
    expect(getBlogApiGuideCopyLabel('zh', 'copying')).toBe('复制中…');
    expect(getBlogApiGuideCopyLabel('zh', 'success')).toBe('已复制');
    expect(getBlogApiGuideCopyLabel('zh', 'error')).toBe('复制失败');

    expect(getBlogApiGuideCopyLabel('en', 'idle')).toBe('Copy for LLM');
    expect(getBlogApiGuideCopyLabel('en', 'success')).toBe('Copied');
    expect(getBlogApiGuideCopyLabel('en', 'error')).toBe('Copy failed');
  });
});
