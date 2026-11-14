import { describe, expect, it } from 'vitest';
import { applyIeltsWritingPatches, inspectIeltsWriting, mergeUnchangedWritingSegments, splitAlignedWritingSentences, type IeltsWriting } from '../lib/ielts-writing-repair';

// 来自 0034-writing-5-1 的公开教学正文：词数合格，但模型把整段存成了四个片段。
const schoolParagraphs: IeltsWriting = { segments: [
  {
    paragraph: 1,
    low: 'I agree in a limited way that secondary schools should start lessons later in the morning, but only if the whole school day is planned carefully. Teenagers often feel very tired at 8 a.m., and a later first lesson may help them to concentrate better in the classroom. However, finishing later in the afternoon can create new problems for families and for students who travel home by bus or train.',
    high: 'I agree only to a limited extent that secondary schools should begin lessons later in the morning, and only if the entire school day is planned carefully. Teenagers often feel extremely tired at 8 a.m., so a later first lesson may help them concentrate better in class. Nevertheless, finishing later in the afternoon can create fresh difficulties for families and for students who travel home by bus or train.',
  },
  {
    paragraph: 2,
    low: 'The main reason for my support is that many teenagers do not get enough sleep, and this makes morning lessons less useful. For example, a student who goes to bed at midnight and wakes at 6:30 may sit in the first class half asleep and miss important explanations. If the same student starts at 9:30, he or she may be more awake and able to take part in discussions. This does not prove that later starts always raise grades, but it gives tired students a fairer chance to learn.',
    high: 'My main reason for supporting a later start is that many teenagers do not get enough sleep, which makes morning lessons less productive. For instance, a student who goes to bed at midnight and wakes at 6:30 may sit through the first class half asleep and miss key explanations. If the same student starts at 9:30, he or she is likely to be more alert and better able to join discussions. This does not prove that later starts always raise grades, but it gives tired students a fairer chance to learn.',
  },
  {
    paragraph: 3,
    low: 'On the other hand, a later finish brings real costs that schools must not ignore. Many parents start work early and depend on school hours to cover childcare, so a 4:30 finish may force them to pay for extra supervision or change their jobs. In addition, students who use public transport may travel home in the dark during winter, which worries parents about safety. A school could reduce these problems by keeping some morning clubs and by arranging supervised study until 5 p.m.',
    high: 'On the other hand, a later finish brings real costs that schools must not ignore. Many parents start work early and rely on school hours to cover childcare, so a 4:30 finish may force them to pay for extra supervision or alter their working arrangements. Moreover, students who use public transport may travel home in the dark during winter, which makes parents anxious about safety. A school could ease these problems by keeping some morning clubs and by arranging supervised study until 5 p.m.',
  },
  {
    paragraph: 4,
    low: 'In conclusion, I agree with a later morning start to a limited degree, because better sleep may improve attention but later finishing times can harm family routines and student safety. Schools should test a later timetable with clear support for transport and childcare before making it permanent.',
    high: 'In conclusion, I agree with a later morning start to a limited degree: better sleep may improve attention, yet later finishing times can disrupt family routines and student safety. Schools should therefore trial a later timetable, with clear support for transport and childcare, before making it permanent.',
  },
] };

// 来自 0047-writing-7-1：只有索引 10 原样保留，整篇词数已经合格。
const libraryWriting: IeltsWriting = { segments: [
  { paragraph: 1, low: 'The table show hypothetical figures for four library branches in one fictional town in 2025. It compare books, yearly visits and study seats.', high: 'The table presents hypothetical figures for four library branches in a fictional town in 2025, comparing book stock, annual visits and study seats.' },
  { paragraph: 1, low: 'Visits count entries, not different people, so the visit numbers need care.', high: 'Visits are counted as entries rather than unique people, so the visit figures should be read with this in mind.' },
  { paragraph: 2, low: 'South has the most books, at 60 thousand, and also the most visits, at 180 thousand.', high: 'South holds the largest book stock, at 60 thousand, and also records the highest number of visits, at 180 thousand.' },
  { paragraph: 2, low: 'But South has only 60 study seats, which is the smallest figure in this column.', high: 'However, South provides only 60 study seats, the lowest figure in that column.' },
  { paragraph: 2, low: 'West is opposite in some ways: it has the most seats, 120, but the fewest visits, just 90 thousand.', high: 'West shows a contrasting pattern: it offers the most seats, 120, yet attracts the fewest visits, at just 90 thousand.' },
  { paragraph: 3, low: 'East has the smallest book collection, only 25 thousand, but visits reach 150 thousand, the second highest.', high: 'East has the smallest collection, at only 25 thousand, but its visits reach 150 thousand, the second highest total.' },
  { paragraph: 3, low: 'This works out at about six annual visits for each book, though the table cannot show crowding or service quality.', high: 'This equates to roughly six annual visits per book, although the table cannot indicate crowding or service quality.' },
  { paragraph: 3, low: 'North sits in the middle for books, with 40 thousand, and for visits, with 120 thousand.', high: 'North occupies a middle position for books, with 40 thousand, and for visits, with 120 thousand.' },
  { paragraph: 3, low: "Its 80 seats are more than South's but fewer than East's and West's.", high: 'Its 80 seats exceed South\'s total but fall below those of East and West.' },
  { paragraph: 4, low: 'Overall, South lead in both books and visits, while West is the least visited branch.', high: 'Overall, South leads in both books and visits, whereas West is the least visited branch.' },
  { paragraph: 4, low: 'Seat numbers do not follow the same order as visits, so the three measures should be compared separately.', high: 'Seat numbers do not follow the same order as visits, so the three measures should be compared separately.' },
  { paragraph: 4, low: 'East is notable for high visits despite its small stock, and West for many seats despite low visits.', high: 'East stands out for high visits despite its small stock, and West for many seats despite low visits.' },
] };

const essay = (writing: IeltsWriting, side: 'low' | 'high') => writing.segments.map(segment => segment[side]).join(' ');

describe('IELTS 正文定点修复', () => {
  it('输出真实失败稿的全篇、逐片段计数和精确错误索引', () => {
    const report = inspectIeltsWriting(libraryWriting, 'task1-academic');
    expect(report.wordCounts).toEqual({ low: 191, high: 203 });
    expect(report.segments[10]).toMatchObject({ index: 10, paragraph: 4, wordCounts: { low: 18, high: 18 } });
    expect(report.errors).toEqual(['segments.10: low/high 完整片段相同，需要定点处理']);
    const paragraphs = inspectIeltsWriting(schoolParagraphs, 'task2');
    expect(paragraphs.wordCounts).toEqual({ low: 286, high: 288 });
    expect(paragraphs.errors).toEqual(['segments: 4 个片段，至少需要 6 个']);
  });

  it('两侧句数一致的四段真实稿可拆成逐句对照，完整正文逐字保留', () => {
    const split = splitAlignedWritingSentences(schoolParagraphs);
    expect(split.segments).toHaveLength(13);
    for (const side of ['low', 'high'] as const) expect(essay(split, side)).toBe(essay(schoolParagraphs, side));
    expect(split.segments.map(segment => segment.paragraph)).toEqual([1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4]);
    expect(inspectIeltsWriting(split, 'task2').wordCounts).toEqual({ low: 286, high: 288 });
  });

  it('真实稿首片段低版两句高版一句时保持原样，不猜句子对应', () => {
    expect(splitAlignedWritingSentences(libraryWriting)).toEqual(libraryWriting);
  });

  it('同段原样片段可以合并到邻近已改写片段，保留全文和顺序', () => {
    const merged = mergeUnchangedWritingSegments(libraryWriting);
    expect(merged.segments).toHaveLength(11);
    expect(merged.segments[9].low).toBe(`${libraryWriting.segments[9].low} ${libraryWriting.segments[10].low}`);
    for (const side of ['low', 'high'] as const) expect(essay(merged, side)).toBe(essay(libraryWriting, side));
    expect(inspectIeltsWriting(merged, 'task1-academic').errors).toEqual([]);
  });

  it('拆句后暴露的原样句也可向同段前后相邻句合并', () => {
    const merged = mergeUnchangedWritingSegments(splitAlignedWritingSentences(schoolParagraphs));
    expect(merged.segments).toHaveLength(11);
    expect(inspectIeltsWriting(merged, 'task2').errors).toEqual([]);
    for (const side of ['low', 'high'] as const) expect(essay(merged, side)).toBe(essay(schoolParagraphs, side));
  });

  it('不跨段、不合并到另一个原样片段、不把片段数减少到六以下', () => {
    const isolated = structuredClone(libraryWriting);
    isolated.segments[9].paragraph = 3;
    isolated.segments[11].paragraph = 5;
    expect(mergeUnchangedWritingSegments(isolated)).toEqual(isolated);
    const identical = structuredClone(libraryWriting);
    identical.segments.forEach(segment => { segment.high = segment.low; });
    expect(mergeUnchangedWritingSegments(identical)).toEqual(identical);
    const six = { segments: libraryWriting.segments.slice(6) };
    expect(mergeUnchangedWritingSegments(six)).toEqual(six);
  });

  it('拆分不超过三十片段，合并不超过六百字符', () => {
    const thirty = { segments: Array.from({ length: 30 }, () => ({ ...schoolParagraphs.segments[0] })) };
    expect(splitAlignedWritingSentences(thirty)).toEqual(thirty);
    const long = structuredClone(libraryWriting);
    for (const index of [9, 11]) {
      long.segments[index].low = long.segments[index].low.padEnd(550, ' ');
      long.segments[index].high = long.segments[index].high.padEnd(550, ' ');
    }
    expect(mergeUnchangedWritingSegments(long)).toEqual(long);
  });

  it('补丁仅改变指定索引指定版本，并可消除原样片段错误', () => {
    const replacement = 'The ranking of seat provision differs from that of visits, so each measure needs to be considered separately.';
    const patched = applyIeltsWritingPatches(libraryWriting, [{ index: 10, low: undefined, high: replacement }]);
    expect(patched.segments[10]).toEqual({ ...libraryWriting.segments[10], high: replacement });
    patched.segments.forEach((segment, index) => { if (index !== 10) expect(segment).toEqual(libraryWriting.segments[index]); });
    expect(inspectIeltsWriting(patched, 'task1-academic').errors).toEqual([]);
  });

  it('补丁原子拒绝越界、重复索引、空文本、过长文本和额外字段', () => {
    const before = structuredClone(libraryWriting);
    expect(() => applyIeltsWritingPatches(libraryWriting, [{ index: 12, low: 'Changed.' }])).toThrow();
    expect(() => applyIeltsWritingPatches(libraryWriting, [{ index: 1, low: 'Changed.' }, { index: 1, high: 'Changed again.' }])).toThrow('补丁索引不能重复');
    expect(() => applyIeltsWritingPatches(libraryWriting, [{ index: 1, low: '' }])).toThrow();
    expect(() => applyIeltsWritingPatches(libraryWriting, [{ index: 1, high: 'a'.repeat(601) }])).toThrow();
    expect(() => applyIeltsWritingPatches(libraryWriting, [{ index: 1 }])).toThrow();
    expect(() => applyIeltsWritingPatches(libraryWriting, [{ index: 1, low: 'Changed.', paragraph: 2 } as never])).toThrow();
    expect(libraryWriting).toEqual(before);
  });

  it('仍报告词数、段落顺序和占位符问题，不以结构修复宣称内容通过', () => {
    const short = structuredClone(libraryWriting);
    short.segments[0].paragraph = 3;
    short.segments[0].low = '[Name] TODO';
    const report = inspectIeltsWriting(short, 'task2');
    expect(report.errors).toEqual(expect.arrayContaining([
      expect.stringContaining('low:'), expect.stringContaining('high:'),
      expect.stringContaining('segments.0.paragraph:'), expect.stringContaining('segments.0.low: 含占位符'),
    ]));
  });

  it('所有检查和结构修复均不修改调用方的原始失败证据', () => {
    const schoolBefore = structuredClone(schoolParagraphs);
    const libraryBefore = structuredClone(libraryWriting);
    splitAlignedWritingSentences(schoolParagraphs);
    mergeUnchangedWritingSegments(libraryWriting);
    inspectIeltsWriting(libraryWriting, 'task1-academic');
    expect(schoolParagraphs).toEqual(schoolBefore);
    expect(libraryWriting).toEqual(libraryBefore);
  });
});
