import { describe, expect, it } from 'vitest';
import { localizedBlogTag } from '../blog-tag-labels';

describe('博客标签英文展示', () => {
  it('只换展示文本，不改中文标签与未收录标签', () => {
    expect(localizedBlogTag('大学生', 'en')).toBe('University students');
    expect(localizedBlogTag('大学生', 'zh')).toBe('大学生');
    expect(localizedBlogTag('Meteor Store', 'en')).toBe('Meteor Store');
    expect(localizedBlogTag('未收录标签', 'en')).toBe('未收录标签');
  });
});
