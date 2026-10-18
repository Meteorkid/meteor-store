import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SignJWT } from 'jose';
import {
  createWechatBindToken,
  createWechatState,
  consumeWechatState,
  readWechatBindToken,
} from '../wechat-bind';

const transaction = 'A'.repeat(43);
const anotherTransaction = 'B'.repeat(43);

describe('微信凭证必须绑定发起浏览器的事务', () => {
  beforeEach(() => { process.env.JWT_SECRET = 'test-secret-wechat-bind'; });
  afterEach(() => { vi.useRealTimers(); });

  it('state 携带 locale 与白名单回跳地址，只有原浏览器可以消费', async () => {
    for (const locale of ['zh', 'en'] as const) {
      const state = await createWechatState(locale, '/apps/ex-memory', transaction);
      expect(await consumeWechatState(state, transaction)).toEqual({ locale, next: '/apps/ex-memory' });
      expect(await consumeWechatState(state)).toBeNull();
      expect(await consumeWechatState(state, anotherTransaction)).toBeNull();
    }
  });

  it('同一秒签发相同参数仍有独立随机凭证，URL 不携带 cookie 原值', async () => {
    const first = await createWechatState('zh', '/', transaction);
    const second = await createWechatState('zh', '/', transaction);
    expect(first).not.toBe(second);
    expect(Buffer.from(first.split('.')[1], 'base64url').toString()).not.toContain(transaction);
    const bind1 = await createWechatBindToken({ openid: 'o1' }, transaction);
    const bind2 = await createWechatBindToken({ openid: 'o1' }, transaction);
    expect(bind1).not.toBe(bind2);
    expect(Buffer.from(bind1.split('.')[1], 'base64url').toString()).not.toContain(transaction);
  });

  it('非法回跳地址归一化为首页', async () => {
    const state = await createWechatState('zh', 'https://evil.example', transaction);
    expect(await consumeWechatState(state, transaction)).toEqual({ locale: 'zh', next: '/' });
  });

  it('篡改、损坏、过期和不同密钥的 state 均拒绝', async () => {
    const state = await createWechatState('zh', '/', transaction);
    expect(await consumeWechatState(`${state.slice(0, -4)}AAAA`, transaction)).toBeNull();
    expect(await consumeWechatState('not-a-jwt', transaction)).toBeNull();
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 11 * 60_000);
    expect(await consumeWechatState(state, transaction)).toBeNull();
    vi.useRealTimers();
    process.env.JWT_SECRET = 'another-secret';
    expect(await consumeWechatState(state, transaction)).toBeNull();
  });

  it('转发有效绑定 URL 也不能在另一浏览器绑定，原浏览器仍可重试', async () => {
    const identity = { openid: 'openid-abc', unionid: 'unionid-xyz', nickname: '流星' };
    const token = await createWechatBindToken(identity, transaction);
    expect(await readWechatBindToken(token)).toBeNull();
    expect(await readWechatBindToken(token, anotherTransaction)).toBeNull();
    expect(await readWechatBindToken(token, transaction)).toEqual(identity);
    expect(await readWechatBindToken(token.slice(0, -5) + '00000', transaction)).toBeNull();
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 16 * 60_000);
    expect(await readWechatBindToken(token, transaction)).toBeNull();
  });

  it('旧签名凭证没有事务声明时也拒绝，不开兼容旁路', async () => {
    for (const purpose of ['wechat-oauth-state', 'wechat-bind']) {
      const token = await new SignJWT({ typ: purpose, locale: 'zh', next: '/', openid: 'o1' })
        .setProtectedHeader({ alg: 'HS256' }).setAudience(purpose).setSubject('o1')
        .setExpirationTime('10m').sign(new TextEncoder().encode(`${process.env.JWT_SECRET}:${purpose}`));
      const read = purpose === 'wechat-bind' ? readWechatBindToken : consumeWechatState;
      expect(await read(token, transaction)).toBeNull();
    }
  });

  it('可选身份字段保持缺省', async () => {
    const token = await createWechatBindToken({ openid: 'o1' }, transaction);
    expect(await readWechatBindToken(token, transaction)).toEqual({ openid: 'o1' });
  });
});
