import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import EditionContent from '../EditionContent';
import { dailyText } from '../text';

describe('日刊内容展示', () => {
  it('实习展示公司、地点、资格要求与核验时间，不宣称读者已符合条件', () => {
    const html = renderToStaticMarkup(<EditionContent locale="zh" copy={dailyText.zh} content={{
      kind: 'internships', items: [{ id: 'job-1', title: 'Software Intern', summary: '学生岗位。',
        url: 'https://example.com/job', sourceName: 'Employer', sourceType: 'official',
        organization: 'Example Company', location: 'San Francisco · 现场办公',
        eligibility: '需要当地工作许可，具体年级要求以官网为准。', verifiedAt: '2026-10-15T03:00:00Z' }],
    }} />);
    expect(html).toContain('Example Company');
    expect(html).toContain('San Francisco');
    expect(html).toContain('需要当地工作许可');
    expect(html).toContain('核验时间');
    expect(html).not.toContain('你符合');
  });

  it('竞赛起始时间明确写开赛时间，不能误称报名截止', () => {
    const html = renderToStaticMarkup(<EditionContent locale="zh" copy={dailyText.zh} content={{
      kind: 'competitions', items: [{ id: 'contest-1', title: 'Programming Round', summary: '官方编程赛事。',
        url: 'https://codeforces.com/contests/1234', sourceName: 'Codeforces', sourceType: 'official',
        startAt: '2026-10-17T12:00:00Z', timeZone: 'UTC' }],
    }} />);
    expect(html).toContain('开赛时间');
    expect(html).toContain('2026');
    expect(html).not.toContain('报名截止');
  });

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


describe('实习与应届岗位类型', () => {
  it.each([
    ['Software Engineer, New Grad', '应届岗位'], ['Software Intern', '实习岗位'], ['International Operations', '类型未标明'],
  ])('旧刊标题 %s 只按明确词语识别类型', (title, expected) => {
    const html = renderToStaticMarkup(<EditionContent locale="zh" copy={dailyText.zh} content={{
      kind: 'internships', items: [{ id: 'old', title, summary: '历史岗位摘要', url: 'https://example.com/job',
        sourceName: 'Employer', sourceType: 'official', location: 'London' }],
    }} />);
    expect(html).toContain(expected);
    expect(html).toContain('办公方式未标明');
    expect(html).toContain('London');
  });

  it('明确事实字段优先于翻译标题，中英分别呈现类型和办公方式', () => {
    for (const locale of ['zh', 'en'] as const) {
      const html = renderToStaticMarkup(<EditionContent locale={locale} copy={dailyText[locale]} content={{
        kind: 'internships', items: [{ id: 'new', title: '软件实习', summary: 'Original title identifies a new graduate role.',
          roleType: 'graduate', remoteStatus: 'remote', url: 'https://example.com/job', sourceName: 'Employer', sourceType: 'official', location: 'UK' }],
      }} />);
      expect(html).toContain(locale === 'zh' ? '应届岗位' : 'Graduate role');
      expect(html).toContain(locale === 'zh' ? '远程' : 'Remote');
      expect(html).toContain('UK');
    }
  });
});
