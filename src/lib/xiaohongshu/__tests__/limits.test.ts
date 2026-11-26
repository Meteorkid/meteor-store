import { describe, expect, it } from 'vitest';

import {
  countChars,
  normalizeXhsTags,
  truncateChars,
  validateXhsNote,
  XHS_BODY_LIMIT,
  XHS_TITLE_LIMIT,
} from '../limits';

describe('小红书笔记校验', () => {
  it('按 Unicode 字符计数，不把 emoji 撑成两个字', () => {
    expect(countChars('你好🙂')).toBe(3);
    expect(truncateChars('一二三四五', 3)).toBe('一二三');
  });

  it('标题和正文超过上限是阻断错误', () => {
    const issues = validateXhsNote({
      title: '一'.repeat(XHS_TITLE_LIMIT + 1),
      body: '二'.repeat(XHS_BODY_LIMIT + 1),
      tags: [],
      images: [],
      status: 'draft',
    });
    expect(issues.filter((item) => item.level === 'error').map((item) => item.field)).toEqual(['title', 'body']);
  });

  it('待发状态要求标题、正文和至少一张图', () => {
    const issues = validateXhsNote({ title: '', body: '', tags: [], images: [], status: 'ready' });
    expect(issues.filter((item) => item.level === 'error')).toHaveLength(3);
  });

  it('提醒项不会阻断草稿保存', () => {
    const issues = validateXhsNote({
      title: '最好用的 AI 工具',
      body: '加微信领取资料，正文很短。',
      tags: [],
      images: [],
      status: 'draft',
    });
    expect(issues.some((item) => item.level === 'error')).toBe(false);
    expect(issues.some((item) => item.message.includes('绝对化'))).toBe(true);
    expect(issues.some((item) => item.message.includes('导流'))).toBe(true);
  });

  it('标签去重、去 #、去空并限制数量', () => {
    const tags = normalizeXhsTags(['#AI工具', 'AI工具', '  ', '独立开发', '#独立开发']);
    expect(tags).toEqual(['AI工具', '独立开发']);
  });
});
