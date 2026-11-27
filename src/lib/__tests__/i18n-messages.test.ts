import { describe, expect, it } from 'vitest';
import zh from '../../../messages/zh.json';
import en from '../../../messages/en.json';
import { HOMEPAGE_MESSAGE_NAMESPACES, selectClientMessages } from '../i18n-messages';

describe('首页客户端文案裁剪', () => {
  it.each([zh, en])('白名单里的命名空间都存在', messages => {
    for (const namespace of HOMEPAGE_MESSAGE_NAMESPACES) {
      expect(messages).toHaveProperty(namespace);
    }
  });

  it('首页只保留白名单，其他页面保持完整消息', () => {
    const messages = { HomePage: { title: 'x' }, PathfinderHub: { title: 'y' }, common: {} };
    expect(selectClientMessages(messages, '/zh')).toEqual({ HomePage: { title: 'x' }, common: {} });
    expect(selectClientMessages(messages, '/zh/blog')).toBe(messages);
    expect(selectClientMessages(messages, null)).toBe(messages);
  });
});
