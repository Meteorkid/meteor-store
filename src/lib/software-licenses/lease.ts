import { createPrivateKey, createPublicKey, sign, type KeyObject } from 'node:crypto';
import { SoftwareLicenseError, type SoftwareLeasePayload } from './types';

export const OFFLINE_LEASE_SECONDS = 7 * 24 * 60 * 60;
export const TRIAL_SECONDS = 14 * 24 * 60 * 60;

export function getSoftwareSigningKey(): KeyObject {
  const pem = process.env.SOFTWARE_LICENSE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!pem) throw new SoftwareLicenseError('unavailable', '授权服务尚未配置，请稍后再试', 503);
  try {
    const key = createPrivateKey(pem);
    if (key.asymmetricKeyType !== 'ed25519') throw new Error('invalid key type');
    return key;
  } catch {
    throw new SoftwareLicenseError('unavailable', '授权服务配置异常，请联系支持', 503);
  }
}

export function getSoftwarePublicKeyBase64(): string {
  // Ed25519 SPKI 的最后 32 字节是 RFC 8410 原始公钥，供 CryptoKit 使用。
  return createPublicKey(getSoftwareSigningKey()).export({ format: 'der', type: 'spki' }).subarray(-32).toString('base64');
}

export function signSoftwareLease(payload: SoftwareLeasePayload, key = getSoftwareSigningKey()): string {
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const message = `MSL1.${encoded}`;
  return `${message}.${sign(null, Buffer.from(message, 'ascii'), key).toString('base64url')}`;
}
