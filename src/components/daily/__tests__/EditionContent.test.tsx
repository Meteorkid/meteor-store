import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import EditionContent from '../EditionContent';
import { dailyText } from '../text';

describe('日刊内容展示', () => {
  it('英语练习未提交时不展示答案或解析', () => {
    const html = renderToStaticMarkup(<EditionContent locale="zh" copy={dailyText.zh} content={{
      kind: 'english', vocabulary: [{ term: 'review', meaning: '复查', example: 'Review the change.', translation: '复查改动。' }],
      passage: 'A short passage.', passageTranslation: '一段短文。',
      questions: [{ question: 'Choose the matching word.', options: ['review', 'release'], answerIndex: 0, explanation: '这段解析仅在提交后展示。' }],
    }} />);

    expect(html).toContain('type="radio"');
    expect(html).toContain('核对答案');
    expect(html).toContain('disabled=""');
    expect(html).not.toContain('这段解析仅在提交后展示。');
    expect(html).not.toContain('正确答案:');
  });

  it('论文展示预印本、版本与原始来源，不虚构代码链接', () => {
    const html = renderToStaticMarkup(<EditionContent locale="en" copy={dailyText.en} content={{
      kind: 'papers', items: [{ id: 'paper-1', title: 'A study', summary: 'Reading note.', originalAbstract: 'Original abstract.', announcementType: 'replace', url: 'https://arxiv.org/abs/2601.00001', sourceName: 'arXiv', sourceType: 'official', preprint: true, version: 'v2', authors: ['A. Researcher'] }],
    }} />);

    expect(html).toContain('Verify publication and peer-review status');
    expect(html).toContain('v2');
    expect(html).toContain('Official source');
    expect(html).toContain('Reading note.');
    expect(html).toContain('Original abstract.');
    expect(html).toContain('Show original abstract');
    expect(html).toContain('Revised');
    expect(html).toContain('href="https://arxiv.org/abs/2601.00001"');
    expect(html).not.toContain('View code');
  });

  it('没有已确认时间的发布会明确标为待定', () => {
    const html = renderToStaticMarkup(<EditionContent locale="zh" copy={dailyText.zh} content={{
      kind: 'events', items: [{ id: 'event-1', title: '活动预告', summary: '敬请关注官方更新。', url: 'https://example.com/event', sourceName: 'Organizer', sourceType: 'official', phase: 'upcoming' }],
    }} />);
    expect(html).toContain('时间待官方确认');
    expect(html).not.toContain('Invalid Date');
  });
});
