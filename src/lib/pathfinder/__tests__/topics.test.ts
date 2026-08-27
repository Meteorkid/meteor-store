import { describe, expect, it } from 'vitest';
import { allTopicNames, inferTopics, MAX_TOPICS_PER_ITEM, topicsForItem } from '../ingestion/topics';

/**
 * 用例里的噪声标签全部取自生产库实测值（103 种标签 / 595 次挂载中的 54 种是噪声），
 * 不是编出来的——主题页当时就是被这些词占满的。
 */
describe('主题只从受控词表产生', () => {
  const realNoise = [
    'bot-triaged', 'triaged', 'ptd-bot-triaged', 'oncall: pt2', 'kind:feature',
    'kind:meta', 'area:providers', 'provider:amazon', 'Domain: enum', 'Domain: lib.d.ts',
    'dynamo-triage-jan2025', 'PT2-Bug-Bash', 'internal ramp-up task', 'AIP-82',
    'VS Code Tracked', 'Difficulty: medium', 'Effort: Moderate', 'notable-change',
    'apache/airflow', 'pytorch/pytorch', 'microsoft/TypeScript',
    'San Francisco, CA', 'Bellevue, Washington', 'good first issue', 'Help Wanted',
  ];

  it.each(realNoise)('噪声标签 %s 不会原样成为主题', (noise) => {
    expect(topicsForItem({ labels: [noise] })).not.toContain(noise);
  });

  it('机构名与「AI」不再是主题', () => {
    // 实测 AI(104) 等于全部 AI 动态、OpenAI(40) 是机构维度已有的信息，
    // 每条都有的标签点进去等于回到未筛选的列表
    for (const org of ['AI', 'OpenAI', 'Google DeepMind', 'GitHub', 'Databricks']) {
      expect(topicsForItem({ labels: [org] })).not.toContain(org);
    }
  });

  it('产出的主题一定在词表内', () => {
    const vocabulary = new Set(allTopicNames());
    const sample = topicsForItem({
      title: 'Improve distributed inference latency for LLM serving',
      summary: 'Adds a benchmark for multi-GPU deployment.',
      labels: realNoise,
    });
    expect(sample.length).toBeGreaterThan(0);
    for (const topic of sample) expect(vocabulary.has(topic)).toBe(true);
  });
});

describe('识别本身', () => {
  it('从标题、摘要、标签三处合起来识别', () => {
    expect(inferTopics('Retrieval augmented generation for docs')).toContain('RAG');
    expect(topicsForItem({ summary: 'A new reinforcement learning policy' })).toContain('强化学习');
    // 噪声标签里的有效信号仍然被利用：词表只取走认识的那部分
    expect(topicsForItem({ labels: ['oncall: distributed'] })).toContain('分布式');
  });

  it('词边界避免误命中', () => {
    // 不加词边界时 \brl\b 会命中 world、\bcv\b 会命中 recv
    expect(inferTopics('hello world')).not.toContain('强化学习');
    expect(inferTopics('recv buffer size')).not.toContain('计算机视觉');
    expect(inferTopics('urgent management change')).not.toContain('Agent');
  });

  it('具体方向优先占据名额，宽泛概念被挤掉', () => {
    // 词表顺序即优先级。若「大模型」「机器学习」排在前面，几乎每条 AI 内容
    // 都会被它们一网打尽，主题页就失去区分度了
    const topics = inferTopics('An LLM agent that uses RAG over a vector database');
    expect(topics).toEqual(['Agent', 'RAG', '数据库']);
    expect(topics).not.toContain('大模型');

    // 只有在没有具体方向可认时，宽泛概念才兜底
    expect(inferTopics('A new large language model release')).toContain('大模型');
  });

  it('主题数有上限', () => {
    const many = inferTopics('llm agent rag multimodal diffusion speech robotics rl fine-tuning inference');
    expect(many.length).toBeLessThanOrEqual(MAX_TOPICS_PER_ITEM);
  });

  it('空输入不产生主题', () => {
    expect(topicsForItem({})).toEqual([]);
    expect(topicsForItem({ title: '', summary: null })).toEqual([]);
  });
});

describe('幂等与中文正文', () => {
  it('认得出自己上一轮产出的主题', () => {
    // 标签回填会把当前标签一起喂回来。不认自己的输出，重跑一次就会把
    // 识别对的主题全丢掉——中文展示名尤其明显，\b 词边界对中文不成立
    const first = topicsForItem({ title: 'Distributed training on multi-GPU clusters' });
    expect(first).toContain('分布式');

    const second = topicsForItem({ title: 'Distributed training on multi-GPU clusters', labels: first });
    expect(second).toEqual(first);
  });

  it('中文正文也能识别', () => {
    // 条目摘要现在会被翻成中文，只按英文模式匹配会让翻译过的条目认不出主题
    expect(topicsForItem({ summary: '这次更新改进了推理部署时的显存占用' })).toContain('推理部署');
  });
});

describe('词尾变化不能漏', () => {
  it.each([
    ['Piloting the world\'s first double-blind AI evaluations', '评测'],
    ['Robotic manipulation benchmarks', '具身智能'],
    ['FileStore rendezvous leaks a file descriptor', '分布式'],
    ['Responding to the next frontier of critical cyber capabilities', '安全与对齐'],
    ['Automate Dependabot pull request triage with Copilot', '开发者工具'],
    ['DiffusionGemma: 4x faster text generation', '大模型'],
  ])('%s → %s', (text, topic) => {
    // \b 卡在复数 s 上是最容易漏的一类：evaluation 匹配不到 evaluations，
    // 上面每一条都来自实测中被漏掉的真实标题
    expect(inferTopics(text)).toContain(topic);
  });
});
