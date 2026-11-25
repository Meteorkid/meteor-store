import type { ListeningTest } from '@/lib/ielts-listening/types';

/**
 * 听力套题的分组信息。每个 Part 的内容在各自目录下（test-01/part-1.ts …），
 * 由 `src/data/ielts-listening/index.ts` 汇总。
 *
 * 全部是原创的雅思风格仿真材料，不是剑桥真题；页面与文档都按这个口径表述。
 */
export const listeningTests: ListeningTest[] = [
  {
    slug: 'test-01',
    title: { zh: '模拟测试 1', en: 'Practice Test 1' },
    description: {
      zh: '四段完整的原创仿真材料，按雅思听力 Part 1–4 的场景与难度递进：生活对话、独白介绍、学术讨论、学术讲座。',
      en: 'Four original practice parts that follow the IELTS Listening format and difficulty curve: an everyday conversation, a monologue, an academic discussion and an academic lecture.',
    },
    sortOrder: 1,
  },
  {
    slug: 'test-02',
    title: { zh: '模拟测试 2', en: 'Practice Test 2' },
    description: {
      zh: '场景与第一套完全不同的另一组四段材料，适合在做过第一套之后检验方法是否真的掌握。',
      en: 'A second set of four parts on entirely different topics, useful for checking that what you learned from the first set actually transfers.',
    },
    sortOrder: 2,
  },
];
