import { describe, it, expect } from 'vitest';
import { TopicProposalSchema, sanitizeInput } from '../route';

const valid = {
  sectionId: 'debate',
  title: '远程办公到底让人更自由还是更累',
  pitch: '我身边两拨人的说法完全相反，想看有人把两边都讲清楚。',
};

describe('TopicProposalSchema', () => {
  it('接受合法提议', () => {
    expect(TopicProposalSchema.safeParse(valid).success).toBe(true);
  });

  it('只接受开放提议的分区', () => {
    expect(TopicProposalSchema.safeParse({ ...valid, sectionId: 'emotion' }).success).toBe(true);
    expect(TopicProposalSchema.safeParse({ ...valid, sectionId: 'literature' }).success).toBe(true);
    // 技术类分区不收提议
    expect(TopicProposalSchema.safeParse({ ...valid, sectionId: 'tech' }).success).toBe(false);
    expect(TopicProposalSchema.safeParse({ ...valid, sectionId: 'nope' }).success).toBe(false);
  });

  it('拒绝过短的标题与理由', () => {
    expect(TopicProposalSchema.safeParse({ ...valid, title: '短' }).success).toBe(false);
    expect(TopicProposalSchema.safeParse({ ...valid, pitch: '想看' }).success).toBe(false);
  });

  it('拒绝超长内容', () => {
    expect(TopicProposalSchema.safeParse({ ...valid, title: 'a'.repeat(81) }).success).toBe(false);
    expect(TopicProposalSchema.safeParse({ ...valid, pitch: 'a'.repeat(1001) }).success).toBe(false);
  });

  it('邮箱可选，但格式必须正确', () => {
    expect(TopicProposalSchema.safeParse({ ...valid, email: 'a@b.com' }).success).toBe(true);
    expect(TopicProposalSchema.safeParse({ ...valid, email: '不是邮箱' }).success).toBe(false);
  });

  it('校验前先 trim，纯空白不算内容', () => {
    expect(TopicProposalSchema.safeParse({ ...valid, title: '        ' }).success).toBe(false);
  });
});

describe('sanitizeInput', () => {
  it('剥离字面 HTML 标签', () => {
    expect(sanitizeInput('<b>标题</b>')).toBe('标题');
  });

  it('不把实体编码还原成真标签', () => {
    const input = '&lt;script&gt;alert(1)&lt;/script&gt;';
    expect(sanitizeInput(input)).toBe(input);
  });

  it('整条都是标签时清空，供路由拦截', () => {
    expect(sanitizeInput('<div></div>')).toBe('');
  });
});
