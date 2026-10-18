import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  __resetCaptchaStateForTests,
  consumeCaptchaProof,
  createCaptchaChallenge,
  createCaptchaProof,
  verifyCaptchaChallenge,
} from '../captcha';
import * as redisModule from '../redis';

describe('注册 CAPTCHA', () => {
  beforeEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.UPSTASH_REDIS_KV_REST_API_URL;
    delete process.env.UPSTASH_REDIS_KV_REST_API_TOKEN;
    process.env.JWT_SECRET = 'test-secret-with-enough-entropy';
    __resetCaptchaStateForTests();
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('挑战响应只包含栅格图片和不透明 ID，不泄露目标 X 坐标或背景种子', async () => {
    const challenge = await createCaptchaChallenge();

    expect(challenge).toMatchObject({
      token: expect.any(String),
      targetY: 55,
      backgroundImage: expect.stringMatching(/^data:image\/png;base64,/),
      pieceImage: expect.stringMatching(/^data:image\/png;base64,/),
    });
    expect(challenge).not.toHaveProperty('targetX');
    expect(challenge).not.toHaveProperty('bgSeed');
    expect(challenge.token).not.toContain('.');
  });

  it('错误位置也消费挑战，新的正确挑战和 proof 都只能使用一次', async () => {
    const challenge = await createCaptchaChallenge();
    const targetX = 60 + Math.floor(0.5 * 170);

    await expect(verifyCaptchaChallenge(challenge.token, targetX - 20)).resolves.toBe(false);
    await expect(verifyCaptchaChallenge(challenge.token, targetX)).resolves.toBe(false);
    const fresh = await createCaptchaChallenge();
    await expect(verifyCaptchaChallenge(fresh.token, targetX)).resolves.toBe(true);
    await expect(verifyCaptchaChallenge(fresh.token, targetX)).resolves.toBe(false);
    await expect(verifyCaptchaChallenge(challenge.token, targetX)).resolves.toBe(false);

    const proof = await createCaptchaProof();
    await expect(consumeCaptchaProof(proof)).resolves.toBe(true);
    await expect(consumeCaptchaProof(proof)).resolves.toBe(false);
  });

  it('Redis 同样原子消费每次尝试，错误后不能枚举答案', async () => {
    const values = new Map<string, string>();
    const get = vi.fn(async (key: string) => values.get(key) ?? null);
    const getdel = vi.fn(async (key: string) => {
      const value = values.get(key) ?? null;
      values.delete(key);
      return value;
    });
    vi.spyOn(redisModule, 'getRedis').mockReturnValue({
      set: vi.fn(async (key: string, value: string) => { values.set(key, value); return 'OK'; }),
      get, getdel,
    } as unknown as NonNullable<ReturnType<typeof redisModule.getRedis>>);
    const challenge = await createCaptchaChallenge();
    const attempts = await Promise.all(Array.from({ length: 16 }, (_, i) =>
      verifyCaptchaChallenge(challenge.token, 65 + 11 * i)));
    expect(attempts.every(result => !result)).toBe(true);
    expect(get).not.toHaveBeenCalled();
    const fresh = await createCaptchaChallenge();
    expect(await Promise.all([verifyCaptchaChallenge(fresh.token, 145), verifyCaptchaChallenge(fresh.token, 145)]))
      .toEqual([true, false]);
  });

  it('挑战 ID 不能冒充已通过验证的 proof', async () => {
    const challenge = await createCaptchaChallenge();

    await expect(consumeCaptchaProof(challenge.token)).resolves.toBe(false);
  });
});
