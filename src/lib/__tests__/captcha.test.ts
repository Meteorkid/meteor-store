import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  __resetCaptchaStateForTests,
  consumeCaptchaProof,
  createCaptchaChallenge,
  createCaptchaProof,
  verifyCaptchaChallenge,
} from '../captcha';

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

  it('错误位置不消费挑战，正确位置换取的 proof 只能消费一次', async () => {
    const challenge = await createCaptchaChallenge();
    const targetX = 60 + Math.floor(0.5 * 170);

    await expect(verifyCaptchaChallenge(challenge.token, targetX - 20)).resolves.toBe(false);
    await expect(verifyCaptchaChallenge(challenge.token, targetX)).resolves.toBe(true);
    await expect(verifyCaptchaChallenge(challenge.token, targetX)).resolves.toBe(false);

    const proof = await createCaptchaProof();
    await expect(consumeCaptchaProof(proof)).resolves.toBe(true);
    await expect(consumeCaptchaProof(proof)).resolves.toBe(false);
  });

  it('挑战 ID 不能冒充已通过验证的 proof', async () => {
    const challenge = await createCaptchaChallenge();

    await expect(consumeCaptchaProof(challenge.token)).resolves.toBe(false);
  });
});
