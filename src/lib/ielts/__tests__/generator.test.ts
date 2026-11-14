import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { curatedIeltsPairs } from '@/data/ielts';
import { generateIeltsPair } from '../generator';

const mockFetch = vi.fn();
const completion = (body: unknown) => new Response(JSON.stringify({ choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(body) } }] }));
const essayResponse = () => {
  const { prompt, title, segments, criteria, takeaways } = curatedIeltsPairs[0].content;
  const essay = { prompt, title, segments, criteria, takeaways };
  return completion(essay);
};
beforeEach(() => {
  vi.stubEnv('DEEPSEEK_API_KEY', 'test-only-not-a-real-key');
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('自动生成包含学习笔记', () => {
  it('新生成不允许缺译文，补齐后才进入笔记阶段', async () => {
    const { prompt, title, segments, criteria, takeaways } = curatedIeltsPairs[0].content;
    const missingTranslations = structuredClone(segments);
    for (const segment of missingTranslations) delete segment.translationZh;
    mockFetch.mockResolvedValueOnce(completion({ prompt, title, segments: missingTranslations, criteria, takeaways }))
      .mockResolvedValueOnce(essayResponse()).mockResolvedValueOnce(completion(curatedIeltsPairs[0].content.learning));
    const result = await generateIeltsPair({ task: 'task2', topic: 'education', category: 'opinion' });
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(result.content.segments.every(segment => segment.translationZh?.low && segment.translationZh.high)).toBe(true);
  });

  it('两阶段共用截止时间，笔记与正文一起返回', async () => {
    mockFetch.mockResolvedValueOnce(essayResponse()).mockResolvedValueOnce(completion(curatedIeltsPairs[0].content.learning));
    const result = await generateIeltsPair({ task: 'task2', topic: 'education', category: 'opinion' });
    expect(result.content.learning?.vocabulary.length).toBeGreaterThanOrEqual(6);
    expect(result.content.segments).toEqual(curatedIeltsPairs[0].content.segments);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    const first = mockFetch.mock.calls[0][1];
    const second = mockFetch.mock.calls[1][1];
    expect(first.signal).toBe(second.signal);
    const request = JSON.parse(second.body);
    expect(request.messages[1].content).toContain(curatedIeltsPairs[0].content.segments[0].high);
  });

  it('错位词汇仅重试笔记，不重新生成作文', async () => {
    const invalid = structuredClone(curatedIeltsPairs[0].content.learning!);
    invalid.vocabulary[0].term = 'nonexistent-term';
    mockFetch.mockResolvedValueOnce(essayResponse()).mockResolvedValueOnce(completion(invalid))
      .mockResolvedValueOnce(completion(curatedIeltsPairs[0].content.learning));
    const result = await generateIeltsPair({ task: 'task2', topic: 'education', category: 'opinion' });
    expect(result.content.learning).toEqual(curatedIeltsPairs[0].content.learning);
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(JSON.parse(mockFetch.mock.calls[2][1].body).messages[1].content).toContain('validationError');
  });

  it('没有有效笔记时不返回可保存的半成品', async () => {
    mockFetch.mockResolvedValueOnce(essayResponse()).mockResolvedValueOnce(completion({})).mockResolvedValueOnce(completion({}));
    await expect(generateIeltsPair({ task: 'task2', topic: 'education', category: 'opinion' })).rejects.toThrow('学习笔记生成失败');
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('总超时中断后不继续重试', async () => {
    const controller = new AbortController();
    const timeout = vi.spyOn(AbortSignal, 'timeout').mockReturnValue(controller.signal);
    mockFetch.mockImplementationOnce(async () => { controller.abort(); throw new Error('aborted'); });
    try {
      await expect(generateIeltsPair({ task: 'task2', topic: 'education', category: 'opinion' })).rejects.toThrow('超时');
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(timeout).toHaveBeenCalledWith(50_000);
    } finally { timeout.mockRestore(); }
  });
});
