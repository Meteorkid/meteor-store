import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import IeltsExpressionBlocks from '../IeltsExpressionBlocks';
import type { IeltsLocatedExpressionEdit } from '@/lib/ielts/expression-edits';

const edit: IeltsLocatedExpressionEdit = {
  before: 'is good', after: 'brings clear benefits', focus: 'lexis', segmentIndex: 4, editIndex: 0,
  explanation: { zh: '具体指出好处。', en: 'Specify the benefit.' },
};

describe('表达块呈现', () => {
  it('区分主要升级与支持块，提供准确原句定位和双侧标签', () => {
    const html = renderToStaticMarkup(<IeltsExpressionBlocks edits={[edit, { ...edit, segmentIndex: 5 }]}
      paragraph={2} locale="zh" focus="lexis" onLocate={() => {}} />);
    expect(html.match(/data-priority="primary"/g)).toHaveLength(1);
    expect(html.match(/data-priority="supporting"/g)).toHaveLength(1);
    expect(html).toContain('href="#ielts-sentence-4"');
    expect(html).toContain('句对 5');
    expect(html).toContain('原表达');
    expect(html).toContain('升级表达');
    expect(html).toContain('data-focus-match="true"');
    expect(html).not.toContain('data-lookup-word');
  });

  it('英文界面使用英文说明，旧内容不渲染空区域', () => {
    const html = renderToStaticMarkup(<IeltsExpressionBlocks edits={[edit]} paragraph={2} locale="en" focus="all" onLocate={() => {}} />);
    expect(html).toContain('Specify the benefit.');
    expect(html).toContain('See in context');
    expect(html).not.toContain('具体指出好处');
    expect(renderToStaticMarkup(<IeltsExpressionBlocks edits={[]} paragraph={2} locale="zh" focus="all" onLocate={() => {}} />)).toBe('');
  });
});
