import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { generateDailyEnglish } from '../english-generator';

function lesson() {
  return {
    title: '和室友商量安静时间',
    summary: '用三个表达商量共同生活中的安排，提出建议并确认约定。',
    content: {
      kind: 'english',
      vocabulary: [
        { term: 'work out', meaning: '商量并解决', example: 'We can work out a plan together.', translation: '我们可以一起商量出一个计划。' },
        { term: 'keep it down', meaning: '把声音放低', example: 'Could you keep it down after ten?', translation: '十点以后可以小声一点吗？' },
        { term: 'agree on', meaning: '就某事达成一致', example: 'We agreed on a quiet hour.', translation: '我们约定了一个安静时段。' },
      ],
      passage: 'Lina shares a room with two classmates. She enjoys their company, but she sometimes finds it hard to study when they watch videos at night. Instead of leaving an angry message, she asks them to talk after dinner. She explains that she has an early class and needs to sleep before eleven. One roommate also wants time to call her family, so they work out a plan together. They agree on a quiet hour that starts at ten thirty. Before that time, everyone can talk normally. Later, they will use headphones and keep it down. Lina writes the agreement on a small card near the door. A week later, they check whether the plan is working for everyone. The conversation does not solve every problem, but it gives them a clear starting point.',
      passageTranslation: 'Lina 和两位同学住在一起。她喜欢室友的陪伴，但室友晚上看视频时，她有时难以学习。她没有留下生气的消息，而是约室友晚饭后聊聊。她说明自己第二天有早课，需要十一点前睡觉。一位室友还想和家人通话，因此大家一起商量计划。他们约定十点半开始保持安静，在此之前可以正常聊天，之后则戴耳机并降低音量。Lina 把约定写在门边的小卡片上。一周后，他们再看看计划是否适合所有人。谈话没有解决所有问题，却让大家有了明确的起点。',
      questions: [
        { question: 'Why does Lina need to sleep early?', options: ['She has an early class.', 'She is leaving campus.', 'She dislikes dinner.'], answerIndex: 0, explanation: '文中说明她第二天有早课，所以需要早睡。' },
        { question: 'What does “keep it down” mean here?', options: ['Write a note.', 'Make less noise.', 'Leave the room.'], answerIndex: 1, explanation: '这里指降低音量，与安静时段的约定相呼应。' },
      ],
    },
  };
}

function completion(content: unknown = lesson(), finishReason = 'stop') {
  return Response.json({ choices: [{ message: { content: JSON.stringify(content) }, finish_reason: finishReason }] });
}

beforeEach(() => {
  vi.stubEnv('DEEPSEEK_API_KEY', 'test-key-not-a-secret');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('每日英语生成', () => {
  it('按日期生成新课程，沿用已验证的 JSON 调用契约并带上近期标题', async () => {
    const fetchMock = vi.fn().mockResolvedValue(completion());
    vi.stubGlobal('fetch', fetchMock);
    const timeoutSpy = vi.spyOn(AbortSignal, 'timeout');

    const result = await generateDailyEnglish('2026-10-15', ['向老师请求反馈', '第一次实习面试']);

    expect(result).toEqual({ ...lesson(), sourceKey: 'english:generated:2026-10-15' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.deepseek.com/chat/completions');
    expect(request).toMatchObject({
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-key-not-a-secret' },
      cache: 'no-store',
    });
    expect(timeoutSpy).toHaveBeenCalledWith(45_000);
    const body = JSON.parse(request.body);
    expect(body).toMatchObject({
      model: 'deepseek-v4-flash', max_tokens: 2200,
      response_format: { type: 'json_object' }, thinking: { type: 'disabled' },
    });
    expect(body.messages[0]).toMatchObject({ role: 'system' });
    expect(body.messages[0].content).toMatch(/JSON/);
    expect(body.messages[0].content).toContain('"answerIndex"');
    expect(body.messages[0].content).toContain('原创');
    expect(body.messages[0].content).toContain('不要捏造新闻');
    expect(body.messages[1].content).toContain('2026-10-15');
    expect(body.messages[1].content).toContain('向老师请求反馈');
    expect(body.messages[1].content).toContain('第一次实习面试');
  });

  it.each([
    ['缺标题', () => ({ ...lesson(), title: undefined })],
    ['缺摘要', () => ({ ...lesson(), summary: undefined })],
    ['缺中文译文', () => ({ ...lesson(), content: { ...lesson().content, passageTranslation: undefined } })],
    ['空白中文译文', () => ({ ...lesson(), content: { ...lesson().content, passageTranslation: '  ' } })],
    ['缺例句译文', () => {
      const value = lesson();
      return { ...value, content: { ...value.content, vocabulary: value.content.vocabulary.map(item => ({ ...item, translation: undefined })) } };
    }],
    ['表达不足三个', () => ({ ...lesson(), content: { ...lesson().content, vocabulary: lesson().content.vocabulary.slice(0, 2) } })],
    ['题目不足两道', () => ({ ...lesson(), content: { ...lesson().content, questions: lesson().content.questions.slice(0, 1) } })],
    ['阅读不足 120 词', () => ({ ...lesson(), content: { ...lesson().content, passage: 'Too short for a lesson.' } })],
    ['阅读超过 200 词', () => ({ ...lesson(), content: { ...lesson().content, passage: 'word '.repeat(201) } })],
    ['答案索引超过选项范围', () => {
      const value = lesson();
      value.content.questions[0].answerIndex = 3;
      return value;
    }],
    ['答案索引是负数', () => {
      const value = lesson();
      value.content.questions[0].answerIndex = -1;
      return value;
    }],
    ['未知课程字段', () => ({ ...lesson(), reviewedBy: 'Human reviewer' })],
    ['未知内容字段', () => ({ ...lesson(), content: { ...lesson().content, sourceUrl: 'https://example.com' } })],
    ['未知表达字段', () => {
      const value = lesson();
      return { ...value, content: { ...value.content, vocabulary: value.content.vocabulary.map(item => ({ ...item, source: 'invented' })) } };
    }],
    ['未知问题字段', () => {
      const value = lesson();
      return { ...value, content: { ...value.content, questions: value.content.questions.map(item => ({ ...item, verified: true })) } };
    }],
  ])('拒绝不完整或不符合约束的课程：%s', async (_label, invalid) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(completion(invalid())));
    await expect(generateDailyEnglish('2026-10-15')).rejects.toThrow('英语课程结构无效');
  });

  it.each(['2026-02-30', '2026-13-01', '2026-1-15', 'not-a-date'])('非法日期 %s 不发出请求', async date => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(generateDailyEnglish(date)).rejects.toThrow('无效的课程日期');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([undefined, '', '  '])('未配置密钥时失败，不发出请求', async key => {
    vi.stubEnv('DEEPSEEK_API_KEY', key);
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(generateDailyEnglish('2026-10-15')).rejects.toThrow('DEEPSEEK_API_KEY 未配置');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('API 错误仅报告状态码，不回显错误正文或密钥', async () => {
    const response = new Response('do-not-leak-server-body test-key-not-a-secret', { status: 429 });
    const textSpy = vi.spyOn(response, 'text');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
    await expect(generateDailyEnglish('2026-10-15')).rejects.toThrow(/^英语生成服务返回 429$/);
    expect(textSpy).not.toHaveBeenCalled();
  });

  it('网络失败和超时不泄露底层错误正文', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('request failed with test-key-not-a-secret')));
    await expect(generateDailyEnglish('2026-10-15')).rejects.toThrow(/^英语生成请求失败或超时$/);
  });

  it.each(['length', 'content_filter', 'tool_calls'])('拒绝未完整完成的返回：%s', async reason => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(completion(lesson(), reason)));
    await expect(generateDailyEnglish('2026-10-15')).rejects.toThrow('英语生成响应不完整或已截断');
  });

  it.each([
    { choices: [] },
    { choices: [{ message: { content: '' }, finish_reason: 'stop' }] },
    { choices: [{ message: { content: JSON.stringify(lesson()) } }] },
  ])('拒绝缺失或空的模型响应', async payload => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(payload)));
    await expect(generateDailyEnglish('2026-10-15')).rejects.toThrow('英语生成响应不完整或已截断');
  });

  it.each([
    () => new Response('{"choices":'),
    () => Response.json({ choices: [{ message: { content: '{"title": "truncated' }, finish_reason: 'stop' }] }),
  ])('JSON 被截断时不返回部分课程或回显内容', async response => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response()));
    await expect(generateDailyEnglish('2026-10-15')).rejects.toThrow(/^英语生成返回非 JSON 内容$/);
  });

  it('无 Content-Length 时仍限制响应体，超过 64 KiB 停止读取', async () => {
    let chunksRead = 0;
    let cancelled = false;
    const body = new ReadableStream({
      pull(controller) {
        chunksRead += 1;
        controller.enqueue(new TextEncoder().encode('x'.repeat(40_000)));
        if (chunksRead === 4) controller.close();
      },
      cancel() { cancelled = true; },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(body)));
    await expect(generateDailyEnglish('2026-10-15')).rejects.toThrow('英语生成响应过大');
    expect(cancelled).toBe(true);
    expect(chunksRead).toBeLessThanOrEqual(3);
  });

  it('服务器声明的响应体超限时直接拒绝', async () => {
    const response = new Response('ignored', { headers: { 'content-length': '65537' } });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
    await expect(generateDailyEnglish('2026-10-15')).rejects.toThrow('英语生成响应过大');
  });

  it('完整课程的标题与近期标题相同时交由上层重试', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(completion()));
    await expect(generateDailyEnglish('2026-10-15', [' 和室友商量安静时间 '])).rejects.toThrow('英语课程标题与近期内容重复');
  });

  it('课程错误最多报告五个字段路径及类别，不泄露输入值、未知键名或密钥', async () => {
    const payload = {
      title: '', summary: '',
      content: {
        kind: 'private-model-value-test-key-not-a-secret',
        vocabulary: [], passage: 'private-model-value', passageTranslation: '', questions: [],
      },
      'private-model-key-test-key-not-a-secret': 'do-not-leak',
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(completion(payload)));
    const error = await generateDailyEnglish('2026-10-15').catch(error => error as Error);
    expect(error).toBeInstanceOf(Error);
    if (!(error instanceof Error)) throw new Error('Expected validation failure');
    expect(error.message).toMatch(/^英语课程结构无效，请重试：/);
    const details = error.message.split('：')[1].split(', ');
    expect(details).toHaveLength(5);
    expect(details).toContain('title:too_small');
    expect(details).toContain('content.kind:invalid_value');
    expect(error.message).not.toMatch(/private-model|test-key-not-a-secret|do-not-leak/);
  });
});
