import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import SourceLanguageNote from '../SourceLanguageNote';
describe('英文界面与正文语言', () => {
  it('有明确中文来源时标注，不宣称正文已翻译', () => {
    expect(renderToStaticMarkup(<SourceLanguageNote locale="en" sourceLanguage="zh" />)).toContain('This article is in Chinese');
  });
  it('混合来源说明原语言，纯英文及中文界面无需提示', () => {
    expect(renderToStaticMarkup(<SourceLanguageNote locale="en" />)).toContain('original language');
    expect(renderToStaticMarkup(<SourceLanguageNote locale="en" sourceLanguage="en" />)).toBe('');
    expect(renderToStaticMarkup(<SourceLanguageNote locale="zh" sourceLanguage="zh" />)).toBe('');
  });
});
