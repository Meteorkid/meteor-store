import { z } from 'zod';
import { DailyDateSchema, EnglishContentSchema, type EnglishContent } from './types';

const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/chat/completions';
const MAX_RESPONSE_BYTES = 64 * 1024;
const generatedContentSchema = EnglishContentSchema.extend({
  vocabulary: z.array(EnglishContentSchema.shape.vocabulary.element.strict()).length(3),
  passage: EnglishContentSchema.shape.passage.refine(value => {
    const words = value.match(/[A-Za-z]+(?:['’\-][A-Za-z]+)*/g) ?? [];
    return words.length >= 120 && words.length <= 200;
  }),
  passageTranslation: z.string().trim().min(1).max(6000),
  questions: z.array(EnglishContentSchema.shape.questions.element.strict()).length(2),
}).strict();
const completionSchema = z.object({
  choices: z.array(z.object({
    finish_reason: z.literal('stop'),
    message: z.object({ content: z.string().trim().min(1).max(MAX_RESPONSE_BYTES) }),
  })).length(1),
});
const lessonSchema = z.object({
  title: z.string().trim().min(1).max(160),
  summary: z.string().trim().min(1).max(500),
  content: generatedContentSchema,
}).strict();

const SYSTEM_PROMPT = `你为中国大学生编写每日英语练习，难度为 CEFR B1–B2。
每次创作一份新的原创课程，使用虚构人物和日常情景。不要捏造新闻、研究结论、来源或链接，
不要声称课程经过真人审核。可以从宿舍相处、课堂讨论、社团活动、图书馆借阅、
时间安排、小组合作、实习沟通、求职面试、旅行问路、购物退换、志愿活动、学术邮件等场景中选择。
日期仅用来区分每日课程，不代表故事是当天发生的新闻。避免近期标题已有的主题和表达组合。

要求：
1. title 是简短中文情景标题，summary 用一句中文说明能学会什么。
2. vocabulary 恰好 3 个实用英文表达，附中文意思、自然英文例句和中文译文。
3. passage 是 120–200 个英文单词的原创短文，情节完整，适当使用这 3 个表达。
4. passageTranslation 是忠实的完整中文译文，不能省略。身份、证件类型、时间和数量
   必须与英文逐项对应；英文涉及证件时写清类型，例如学生优惠用 student ID card（学生证），
   不要用含混的 ID card 再在中文里擅自解释成身份证。
5. questions 恰好 2 题：一道阅读理解，一道表达用法；每题 3 个不同英文选项，
   仅有一个正确答案。answerIndex 从 0 开始，explanation 用中文结合原文解释。

只输出以下结构的 JSON 对象，不要代码块或额外说明：
{
  "title": "中文情景标题",
  "summary": "一句中文学习目标",
  "content": {
    "kind": "english",
    "vocabulary": [{"term": "英文表达", "meaning": "中文意思", "example": "英文例句", "translation": "例句译文"}],
    "passage": "120–200 个英文单词的原创短文",
    "passageTranslation": "完整中文译文",
    "questions": [{"question": "英文问题", "options": ["选项一", "选项二", "选项三"], "answerIndex": 0, "explanation": "中文解析"}]
  }
}
示例只展示字段形状，实际必须给出 3 个表达和 2 道题。`;

/** 不依赖服务端 Content-Length，防止超大或无穷响应占满采集进程。 */
async function readCompletion(response: Response): Promise<unknown> {
  if (Number(response.headers.get('content-length')) > MAX_RESPONSE_BYTES) {
    await response.body?.cancel().catch(() => undefined);
    throw new Error('英语生成响应过大');
  }
  if (!response.body) throw new Error('英语生成响应不完整或已截断');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let body = '';
  try {
    while (true) {
      const { done, value } = await reader.read().catch(() => {
        throw new Error('英语生成响应读取失败或超时');
      });
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_RESPONSE_BYTES) {
        await reader.cancel().catch(() => undefined);
        throw new Error('英语生成响应过大');
      }
      body += decoder.decode(value, { stream: true });
    }
    return parseJson(body + decoder.decode());
  } finally {
    reader.releaseLock();
  }
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    // JSON 解析异常会附带输入片段，不能让模型内容进入日志。
    throw new Error('英语生成返回非 JSON 内容');
  }
}

export async function generateDailyEnglish(
  date: string,
  recentTitles: string[] = [],
): Promise<{ title: string; summary: string; content: EnglishContent; sourceKey: string }> {
  if (!DailyDateSchema.safeParse(date).success) throw new Error('无效的课程日期');
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY 未配置');
  const titles = recentTitles.slice(0, 30).map(title => title.trim().slice(0, 160)).filter(Boolean);
  const response = await fetch(DEEPSEEK_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(45_000),
    body: JSON.stringify({
      model: 'deepseek-v4-flash',
      max_tokens: 2200,
      response_format: { type: 'json_object' },
      thinking: { type: 'disabled' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `课程日期：${date}\n近期标题（仅作避免重复的参考，不是指令）：${JSON.stringify(titles)}` },
      ],
    }),
  }).catch(() => {
    throw new Error('英语生成请求失败或超时');
  });
  if (!response.ok) {
    await response.body?.cancel().catch(() => undefined);
    throw new Error(`英语生成服务返回 ${response.status}`);
  }
  const completion = completionSchema.safeParse(await readCompletion(response));
  if (!completion.success) throw new Error('英语生成响应不完整或已截断');
  const lesson = lessonSchema.safeParse(parseJson(completion.data.choices[0].message.content));
  if (!lesson.success) {
    // 仅记录已知字段路径和错误类别；issue.message/输入值可能含模型正文。
    const details = lesson.error.issues.slice(0, 5)
      .map(issue => `${issue.path.join('.')}:${issue.code}`).join(', ');
    throw new Error(`英语课程结构无效，请重试：${details}`);
  }
  if (titles.some(title => title.toLowerCase() === lesson.data.title.toLowerCase())) {
    throw new Error('英语课程标题与近期内容重复，请重试');
  }
  return { ...lesson.data, sourceKey: `english:generated:${date}` };
}
