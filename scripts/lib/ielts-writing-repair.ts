import { z } from 'zod';
import { countWords, type IeltsTask } from '../../src/lib/ielts/types.ts';

const MAX_SEGMENT_LENGTH = 600;
const MIN_SEGMENTS = 6;
const MAX_SEGMENTS = 30;
const writingSegmentSchema = z.object({
  paragraph: z.number().int().min(1).max(8),
  low: z.string().trim().min(1).max(MAX_SEGMENT_LENGTH),
  high: z.string().trim().min(1).max(MAX_SEGMENT_LENGTH),
}).strict();

/** 接受尚未拆句的原始稿；最终 6–30 个片段约束由 inspect 检查。 */
export const IeltsWritingSchema = z.object({ segments: z.array(writingSegmentSchema).min(1).max(MAX_SEGMENTS) }).strict();
export type IeltsWriting = z.infer<typeof IeltsWritingSchema>;
export type IeltsWritingPatch = { index: number; low?: string; high?: string };

function unchanged(segment: IeltsWriting['segments'][number]): boolean {
  const normalize = (text: string) => (text.normalize('NFKC').toLowerCase().replace(/[’‘]/g, "'").match(/[a-z0-9]+(?:['-][a-z0-9]+)*/g) ?? []).join(' ');
  return normalize(segment.low) === normalize(segment.high);
}

/** 返回准确的全篇及逐片段词数；errors 可直接作为定点修复的反馈。 */
export function inspectIeltsWriting(writing: IeltsWriting, task: IeltsTask) {
  const parsed = IeltsWritingSchema.safeParse(writing);
  const errors = parsed.success ? [] : parsed.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`);
  const segments = writing.segments.map((segment, index) => {
    const segmentErrors: string[] = [];
    for (const side of ['low', 'high'] as const) {
      if (segment[side].length > MAX_SEGMENT_LENGTH) segmentErrors.push(`segments.${index}.${side}: 超过 ${MAX_SEGMENT_LENGTH} 字符`);
      if (/\b(?:TODO|TBD|INSERT\s+HERE|PLACEHOLDER|LOREM\s+IPSUM)\b|\[(?:your )?name\]/i.test(segment[side])) {
        segmentErrors.push(`segments.${index}.${side}: 含占位符`);
      }
    }
    if (unchanged(segment)) segmentErrors.push(`segments.${index}: low/high 完整片段相同，需要定点处理`);
    return { index, paragraph: segment.paragraph, wordCounts: { low: countWords(segment.low), high: countWords(segment.high) }, errors: segmentErrors };
  });
  const wordCounts = segments.reduce((counts, segment) => ({ low: counts.low + segment.wordCounts.low, high: counts.high + segment.wordCounts.high }), { low: 0, high: 0 });
  const ranges = task === 'task2' ? { low: [250, 300], high: [250, 320] } : { low: [150, 200], high: [150, 230] };
  for (const side of ['low', 'high'] as const) {
    const [min, max] = ranges[side];
    if (wordCounts[side] < min || wordCounts[side] > max) errors.push(`${side}: ${wordCounts[side]} 词，要求 ${min}–${max} 词`);
  }
  if (wordCounts.high < wordCounts.low - 20) errors.push(`high: 比 low 少 ${wordCounts.low - wordCounts.high} 词，超过完整性保护线 20 词（非评分依据）`);
  if (writing.segments.length < MIN_SEGMENTS) errors.push(`segments: ${writing.segments.length} 个片段，至少需要 ${MIN_SEGMENTS} 个`);
  let previousParagraph = 0;
  writing.segments.forEach((segment, index) => {
    if (segment.paragraph !== previousParagraph && segment.paragraph !== previousParagraph + 1) {
      errors.push(`segments.${index}.paragraph: 段号必须从 1 连续递增，同段片段必须相邻`);
    }
    previousParagraph = segment.paragraph;
  });
  return { wordCounts, segments, errors: [...errors, ...segments.flatMap(segment => segment.errors)] };
}

/** 两侧句数相等才按原顺序拆分；这只恢复结构，不声称已验证语义对应。 */
export function splitAlignedWritingSentences(writing: IeltsWriting): IeltsWriting {
  IeltsWritingSchema.parse(writing);
  const sentenceSegmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
  const split = (text: string) => [...sentenceSegmenter.segment(text)].map(item => item.segment.trim()).filter(Boolean);
  const segments: IeltsWriting['segments'] = [];
  writing.segments.forEach((segment, index) => {
    const low = split(segment.low);
    const high = split(segment.high);
    const remaining = writing.segments.length - index - 1;
    if (low.length > 1 && low.length === high.length && segments.length + low.length + remaining <= MAX_SEGMENTS
      && [...low, ...high].every(sentence => sentence.length <= MAX_SEGMENT_LENGTH)) {
      segments.push(...low.map((sentence, sentenceIndex) => ({ paragraph: segment.paragraph, low: sentence, high: high[sentenceIndex] })));
    } else segments.push({ ...segment });
  });
  return { segments };
}

/** 仅在同段相邻且已有改写时合并，保持全文文字顺序、最少片段数及字符上限。 */
export function mergeUnchangedWritingSegments(writing: IeltsWriting): IeltsWriting {
  IeltsWritingSchema.parse(writing);
  const segments = writing.segments.map(segment => ({ ...segment }));
  for (let index = 0; index < segments.length && segments.length > MIN_SEGMENTS; index++) {
    if (!unchanged(segments[index])) continue;
    const neighbor = [index - 1, index + 1].find(candidate => {
      if (!segments[candidate] || segments[candidate].paragraph !== segments[index].paragraph || unchanged(segments[candidate])) return false;
      return (['low', 'high'] as const).every(side => segments[candidate][side].length + 1 + segments[index][side].length <= MAX_SEGMENT_LENGTH);
    });
    if (neighbor === undefined) continue;
    const first = Math.min(index, neighbor);
    const second = first + 1;
    segments.splice(first, 2, {
      paragraph: segments[first].paragraph,
      low: `${segments[first].low} ${segments[second].low}`,
      high: `${segments[first].high} ${segments[second].high}`,
    });
    index = first - 1;
  }
  return { segments };
}

/** 原子应用指定句子的补丁；拒绝重复/越界索引和额外字段，其余句子逐字保留。 */
export function applyIeltsWritingPatches(writing: IeltsWriting, patches: IeltsWritingPatch[]): IeltsWriting {
  IeltsWritingSchema.parse(writing);
  const patchSchema = z.object({
    index: z.number().int().min(0).max(writing.segments.length - 1),
    low: writingSegmentSchema.shape.low.optional(),
    high: writingSegmentSchema.shape.high.optional(),
  }).strict().refine(patch => patch.low !== undefined || patch.high !== undefined, '补丁至少包含 low 或 high');
  const parsed = z.array(patchSchema).parse(patches);
  if (new Set(parsed.map(patch => patch.index)).size !== parsed.length) throw new Error('补丁索引不能重复');
  const segments = writing.segments.map(segment => ({ ...segment }));
  for (const patch of parsed) {
    if (patch.low !== undefined) segments[patch.index].low = patch.low;
    if (patch.high !== undefined) segments[patch.index].high = patch.high;
  }
  return { segments };
}
