import type { IeltsPairSeed } from '@/lib/ielts/types';
import { batchA } from './batch-a';
import { batchB } from './batch-b';
import { batchC } from './batch-c';

/**
 * 随代码上线的精选对照。
 *
 * 每一组都经过 `src/lib/ielts/__tests__/curated-content.test.ts` 的体检
 * （协议、段落对齐、词数区间、说明完整度）。要加新对照，先让那个测试通过。
 *
 * 后台生成的对照不在这里，它们在数据库里，运行时按 slug 合并（见 lib/ielts/catalog.ts）。
 */
export const curatedIeltsPairs: IeltsPairSeed[] = [...batchA, ...batchB, ...batchC];
