import { beforeEach, describe, expect, it } from 'vitest';
import {
  createWechatBindToken,
  createWechatState,
  consumeWechatState,
  readWechatBindToken,
} from '../wechat-bind';

describe('wechat-bind 无状态凭证', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-wechat-bind';
  });

  it('state 签发后可以原样消费，并携带 locale', async () => {
    for (const locale of ['zh', 'en'] as const) {
      const state = await createWechatState(locale);
      expect(await consumeWechatState(state)).toBe(locale);
    }
  });

  it('篡改或损坏的 state 消费失败', async () => {
    const state = await createWechatState('zh');
    const tampered = `${state.slice(0, -4)}AAAA`;
    expect(await consumeWechatState(tampered)).toBeNull();
    expect(await consumeWechatState('not-a-jwt')).toBeNull();
  });

  it('不同密钥签发的 state 无法消费', async () => {
    const state = await createWechatState('zh');
    process.env.JWT_SECRET = 'another-secret';
    expect(await consumeWechatState(state)).toBeNull();
  });

  it('绑定凭证 roundtrip：openid 即 sub，篡改后拒绝', async () => {
    const identity = { openid: 'openid-abc', unionid: 'unionid-xyz', nickname: '流星' };
    const token = await createWechatBindToken(identity);
    const read = await readWechatBindToken(token);
    expect(read).toEqual(identity);

    // 篡改 openid：签名失效
    const tampered = token.slice(0, token.length - 5) + '00000';
    expect(await readWechatBindToken(tampered)).toBeNull();
  });

  it('可选字段缺省时为 undefined，空串不返回', async () => {
    const token = await createWechatBindToken({ openid: 'o1' });
    const read = await readWechatBindToken(token);
    expect(read).toEqual({ openid: 'o1' });
  });
});
