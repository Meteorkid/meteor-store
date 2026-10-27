import { createPublicKey, generateKeyPairSync, verify } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getSoftwarePublicKeyBase64, getSoftwareSigningKey, signSoftwareLease } from '../lease';
import type { SoftwareLeasePayload } from '../types';

afterEach(() => vi.unstubAllEnvs());

describe('MSL1 签名协议', () => {
  it('Ed25519 验证精确消息，字段与签名篡改均失败', () => {
    const { privateKey, publicKey } = generateKeyPairSync('ed25519');
    vi.stubEnv('SOFTWARE_LICENSE_PRIVATE_KEY', privateKey.export({ format: 'pem', type: 'pkcs8' }).toString());
    const payload: SoftwareLeasePayload = { version: 1, productId: 'xnook', deviceId: 'a'.repeat(64), licenseId: 'test', kind: 'monthly', issuedAt: 2_000_000_000, expiresAt: 2_000_604_800, entitlementExpiresAt: 2_002_592_000 };
    const token = signSoftwareLease(payload);
    const [prefix, body, signature] = token.split('.');
    expect(prefix).toBe('MSL1');
    expect(JSON.parse(Buffer.from(body, 'base64url').toString())).toEqual(payload);
    expect(verify(null, Buffer.from(`${prefix}.${body}`), publicKey, Buffer.from(signature, 'base64url'))).toBe(true);
    expect(verify(null, Buffer.from(`${prefix}.${body}A`), publicKey, Buffer.from(signature, 'base64url'))).toBe(false);
    expect(getSoftwarePublicKeyBase64()).toBe(createPublicKey(privateKey).export({ format: 'der', type: 'spki' }).subarray(-32).toString('base64'));
  });
  it('未配置或非 Ed25519 密钥必须 fail closed', () => {
    vi.stubEnv('SOFTWARE_LICENSE_PRIVATE_KEY', '');
    expect(() => getSoftwareSigningKey()).toThrow('尚未配置');
    vi.stubEnv('SOFTWARE_LICENSE_PRIVATE_KEY', 'not a key');
    expect(() => getSoftwareSigningKey()).toThrow('配置异常');
  });
});
