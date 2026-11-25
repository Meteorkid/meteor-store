import type { ListeningLesson } from '@/lib/ielts-listening/types';
import { test01Part1 } from './test-01/part-1';
import { test01Part2 } from './test-01/part-2';
import { test01Part3 } from './test-01/part-3';
import { test01Part4 } from './test-01/part-4';
import { test02Part1 } from './test-02/part-1';
import { test02Part2 } from './test-02/part-2';
import { test02Part3 } from './test-02/part-3';
import { test02Part4 } from './test-02/part-4';

export { listeningTests } from './tests';

/**
 * 随代码上线的听力课时。
 *
 * 每一篇都经过 `src/data/__tests__/ielts-listening.test.ts` 的体检
 * （协议、原文是否适合朗读、标准答案能否判满分、题型与解析质量）。
 * 要加新题：按 test-NN/part-N.ts 的目录放好文件，在这里追加一行，让那个测试通过。
 *
 * 考试材料是原创仿真题，不是剑桥真题。
 */
export const listeningLessons: ListeningLesson[] = [
  test01Part1,
  test01Part2,
  test01Part3,
  test01Part4,
  test02Part1,
  test02Part2,
  test02Part3,
  test02Part4,
];
