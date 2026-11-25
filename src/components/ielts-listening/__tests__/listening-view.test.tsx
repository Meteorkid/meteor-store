import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getListeningLesson } from '@/lib/ielts-listening/catalog';
import ListeningTranscript from '../ListeningTranscript';
import ListeningQuestions from '../ListeningQuestions';

/**
 * 静态语义：原文的句锚点与可点词、答题区按 scope 收窄题目。
 * 交互（勾选多选、查词浮层）不在这里测，避免引入 jsdom；勾选映射在 listening-answers.test.ts。
 */

const lesson = getListeningLesson('test-01-part-1')!;

describe('ListeningTranscript', () => {
  it('每句都带 #sentence-N 锚点与单句重听入口', () => {
    const html = renderToStaticMarkup(<ListeningTranscript
      transcript={lesson.transcript} cast={lesson.cast} answers={lesson.answers}
      locale="zh" scope={null} graded={false} wrongNumbers={[]} activeIndex={null}
      onPlaySentence={() => {}} onLookup={() => {}} onDismissLookup={() => {}} />);
    expect(html).toContain('id="sentence-1"');
    expect(html).toContain(`id="sentence-${lesson.transcript.length}"`);
    expect(html.match(/aria-label="重听本句 \/ Replay · 第 \d+ 句"/g)?.length).toBe(lesson.transcript.length);
  });

  it('全文视图按说话人合并成段落，取消逐句按钮但保留句锚点', () => {
    const html = renderToStaticMarkup(<ListeningTranscript
      transcript={lesson.transcript} cast={lesson.cast} answers={lesson.answers}
      locale="zh" scope={null} graded={false} wrongNumbers={[]} activeIndex={2} view="full"
      onPlaySentence={() => {}} onLookup={() => {}} onDismissLookup={() => {}} />);
    const turns = lesson.transcript.filter((item, index) => index === 0 || lesson.transcript[index - 1].speaker !== item.speaker).length;
    expect(html.match(/data-speaker-label/g)?.length).toBe(turns);
    expect(html).not.toContain('aria-label="重听本句 \/ Replay');
    expect(html).toContain('id="sentence-1"');
    expect(html).toContain(`id="sentence-${lesson.transcript.length}"`);
    expect(html).toContain('id="sentence-3"');
    expect(html).toContain('bg-violet-400/15');
    expect(html).toContain('data-lookup-word="popular"');
  });

  it('每个英文词都是可查词的按钮，标点不带 data-lookup-word', () => {
    const html = renderToStaticMarkup(<ListeningTranscript
      transcript={lesson.transcript} cast={lesson.cast} answers={lesson.answers}
      locale="en" scope={null} graded={false} wrongNumbers={[]} activeIndex={null}
      onPlaySentence={() => {}} onLookup={() => {}} onDismissLookup={() => {}} />);
    expect(html).toContain('data-lookup-word="popular"');
    expect(html).not.toContain('data-lookup-word="."');
  });

  it('未提交时不显示对错标记，提交后只回标本次范围内的题号', () => {
    const before = renderToStaticMarkup(<ListeningTranscript
      transcript={lesson.transcript} cast={lesson.cast} answers={lesson.answers}
      locale="zh" scope={[8, 9, 10]} graded={false} wrongNumbers={[]} activeIndex={null}
      onPlaySentence={() => {}} onLookup={() => {}} onDismissLookup={() => {}} />);
    expect(before).not.toContain('bg-rose-400/20');
    const after = renderToStaticMarkup(<ListeningTranscript
      transcript={lesson.transcript} cast={lesson.cast} answers={lesson.answers}
      locale="zh" scope={[8, 9, 10]} graded wrongNumbers={[8]} activeIndex={null}
      onPlaySentence={() => {}} onLookup={() => {}} onDismissLookup={() => {}} />);
    expect(after).toContain('bg-rose-400/20');
    expect(after).not.toContain('第 1 题');
  });
});

describe('ListeningQuestions 的 scope 收窄', () => {
  it('整篇练习时 10 个题号都有输入框', () => {
    const html = renderToStaticMarkup(<ListeningQuestions lesson={lesson} answers={{}} onChange={() => {}}
      scope={null} graded={false} grade={null} locale="zh" />);
    for (const number of [1, 2, 3, 4, 8, 9, 10]) expect(html).toContain(`aria-label="第 ${number} 题"`);
    for (const number of [5, 6, 7]) expect(html).toContain(`name="listening-q-${number}"`);
  });

  it('错题重练只保留范围内的题块与输入框，范围外显示为静态占位', () => {
    const html = renderToStaticMarkup(<ListeningQuestions lesson={lesson} answers={{}} onChange={() => {}}
      scope={[8, 9, 10]} graded={false} grade={null} locale="zh" />);
    expect(html).toContain('aria-label="第 8 题"');
    expect(html).toContain('aria-label="第 10 题"');
    for (const hidden of [1, 2, 3, 4, 5, 6, 7]) expect(html).not.toContain(`aria-label="第 ${hidden} 题"`);
    expect(html).not.toContain('listening-q-5');
  });

  it('提交后错题显示正确答案，选择题不再接受更改（disabled 由上层控制）', () => {
    const grade = { score: 0, total: 10, results: lesson.answers.map(answer => ({ number: answer.number, correct: false, accepted: answer.accepted[0] })) };
    const html = renderToStaticMarkup(<ListeningQuestions lesson={lesson} answers={{ '1': 'wrong' }} onChange={() => {}}
      scope={null} graded grade={grade} locale="zh" />);
    expect(html).toContain('→ Krause');
  });
});
