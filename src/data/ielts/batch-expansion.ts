import type { IeltsPairSeed } from '@/lib/ielts/types';
import corpus from './generated-corpus.json';

/** 94 组原创教学对照；内容与引用由完整语料验收测试校验。 */
export const batchExpansion = corpus as IeltsPairSeed[];
