import { execFileSync } from 'node:child_process';
import { createHash, generateKeyPairSync, randomUUID, verify } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Pool } from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import * as service from '../service';
import type { SoftwareLeasePayload } from '../types';

// 明确启用才启动隔离数据库，绝不使用已有 DATABASE_URL 或生产连接。
describe.skipIf(process.env.SOFTWARE_LICENSE_INTEGRATION !== '1')('软件授权真实 PostgreSQL', () => {
  let root: string;
  let pool: Pool;
  let started = false;
  const keys = generateKeyPairSync('ed25519');
  const device = (name: string) => ({ productId: 'xnook' as const, deviceId: createHash('sha256').update(name).digest('hex'), deviceName: name });
  const decode = (lease: string): SoftwareLeasePayload => JSON.parse(Buffer.from(lease.split('.')[1], 'base64url').toString());

  beforeAll(async () => {
    root = mkdtempSync(join(tmpdir(), 'meteor-software-license-'));
    const data = join(root, 'data');
    const sockets = join(root, 'sockets');
    mkdirSync(sockets);
    execFileSync('initdb', ['-D', data, '-A', 'trust', '-U', 'software_test', '--no-locale'], { stdio: 'pipe' });
    execFileSync('pg_ctl', ['-D', data, '-l', join(root, 'postgres.log'), '-o', `-F -h '' -k ${sockets}`, '-w', 'start'], { stdio: 'pipe' });
    started = true;
    const url = `postgresql://software_test@localhost/postgres?host=${encodeURIComponent(sockets)}`;
    pool = new Pool({ connectionString: url });
    vi.stubEnv('DATABASE_URL', url);
    vi.stubEnv('SOFTWARE_LICENSE_ENABLED', 'true');
    vi.stubEnv('SOFTWARE_LICENSE_PRIVATE_KEY', keys.privateKey.export({ format: 'pem', type: 'pkcs8' }).toString());
    await pool.query(`CREATE TABLE license_keys (id text PRIMARY KEY, order_id text NOT NULL UNIQUE, product_id text NOT NULL, plan_name text NOT NULL, email text NOT NULL, key text NOT NULL UNIQUE, status text NOT NULL DEFAULT 'active', created_at text NOT NULL);
      CREATE TABLE orders (id text PRIMARY KEY,product_id text NOT NULL,plan_name text NOT NULL,plan_id text,email text NOT NULL,user_id text,amount_cny integer NOT NULL,payment_method text NOT NULL,status text NOT NULL,alipay_trade_no text,paid_at text,billing_period text NOT NULL,delivery_status text NOT NULL,delivery_claimed_at text,access_token text NOT NULL,created_at text NOT NULL);
      CREATE TABLE invite_codes (id text PRIMARY KEY,code text,product_id text,plan_id text,plan_name text,max_uses integer,used_count integer,memo text,expires_at text,created_by text,status text,created_at text);
      CREATE TABLE invite_redemptions (id text PRIMARY KEY,invite_code_id text,user_id text,license_key text,redeemed_at text);`);
    await pool.query(readFileSync(join(process.cwd(), 'drizzle/0051_software_licenses.sql'), 'utf8'));
  }, 30_000);

  beforeEach(async () => {
    await pool.query('TRUNCATE software_license_devices, software_license_trials, software_license_codes, invite_redemptions, invite_codes, license_keys, orders CASCADE');
  });
  afterAll(async () => {
    await pool?.end();
    if (started) execFileSync('pg_ctl', ['-D', join(root, 'data'), '-m', 'immediate', '-w', 'stop'], { stdio: 'pipe' });
    if (root) rmSync(root, { recursive: true, force: true });
    vi.unstubAllEnvs();
  });

  const gift = (email = 'buyer@example.com', kind: 'monthly' | 'annual' | 'lifetime' = 'lifetime', requestId = randomUUID()) => service.grantSoftwareLicenses({ email, productIds: ['xnook', 'xisland'], kind, requestId, createdBy: 'admin@example.com' });
  async function order(productId: string, period: string, paidAt = new Date().toISOString(), email = 'buyer@example.com') {
    const id = randomUUID();
    await pool.query(`INSERT INTO orders(id,product_id,plan_name,email,amount_cny,payment_method,status,paid_at,billing_period,delivery_status,access_token,created_at) VALUES ($1,$2,$3,$4,9,'alipay','paid',$5,$3,'pending','test',$5)`, [id, productId, period, email, paidAt]);
    return id;
  }

  it('Pass 每软件一张码，重复并发交付不多发或重复累计', async () => {
    const id = await order('meteor-pass', 'monthly', '2027-01-31T00:00:00.000Z');
    const results = await Promise.all([service.ensureSoftwareCodesForOrder(id), service.ensureSoftwareCodesForOrder(id)]);
    expect(results[0].map((row) => row.code).sort()).toEqual(results[1].map((row) => row.code).sort());
    expect(results[0]).toHaveLength(2);
    expect(results[0].every((row) => row.expiresAt === '2027-02-28T00:00:00.000Z')).toBe(true);
    expect(Number((await pool.query('SELECT count(*) FROM license_keys')).rows[0].count)).toBe(1);
  });

  it('续费补齐历史来源、保留余期，永久单品不被历史 monthly 字段缩短', async () => {
    await order('meteor-pass', 'monthly', '2027-01-01T00:00:00.000Z');
    const renewal = await order('meteor-pass', 'annual', '2027-01-15T00:00:00.000Z');
    const codes = await service.ensureSoftwareCodesForOrder(renewal);
    expect(codes.every((row) => row.expiresAt === '2028-02-01T00:00:00.000Z')).toBe(true);
    const legacy = await order('xnook', 'monthly', '2020-01-01T00:00:00.000Z');
    expect((await service.ensureSoftwareCodesForOrder(legacy))[0]).toMatchObject({ kind: 'lifetime', expiresAt: null, status: 'active' });
  });

  it('无法证明期限的历史来源不授予权益，也不阻断有效买断', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const invalid = await order('meteor-pass', 'unknown-plan');
      await expect(service.ensureSoftwareCodesForOrder(invalid)).rejects.toMatchObject({ code: 'invalid_source' });
      const valid = await order('xnook', 'lifetime');
      const codes = await service.ensureSoftwareCodesForOrder(valid);
      expect(codes).toHaveLength(1);
      expect(codes[0]).toMatchObject({ kind: 'lifetime', expiresAt: null, status: 'active' });
      await expect(service.activateSoftwareLicense({ ...device('legacy-dirty'), code: codes[0].code })).resolves.toHaveProperty('lease');
      expect((await pool.query('SELECT count(*) FROM software_license_codes')).rows[0].count).toBe('1');
    } finally { warning.mockRestore(); }
  });

  it('4 台设备并发最多 3 台成功，续费新码仍共享同一组名额', async () => {
    const codes = await gift();
    const code = codes.find((row) => row.productId === 'xnook')!.code;
    const inputs = ['a', 'b', 'c', 'd'].map((name) => ({ ...device(name), code }));
    const attempts = await Promise.allSettled(inputs.map(service.activateSoftwareLicense));
    expect(attempts.filter((result) => result.status === 'fulfilled')).toHaveLength(3);
    expect(attempts.filter((result) => result.status === 'rejected')).toHaveLength(1);
    const more = await gift('buyer@example.com', 'monthly');
    await expect(service.activateSoftwareLicense({ ...device('new'), code: more.find((row) => row.productId === 'xnook')!.code })).rejects.toMatchObject({ code: 'device_limit' });
    const devices = await service.listSoftwareDevicesByEmail('buyer@example.com');
    expect(devices).toHaveLength(3);
    expect(JSON.stringify(devices)).not.toMatch(/tokenHash|deviceToken|deviceId/);
  });

  it('解绑旧凭证立即不能刷新，新设备可以占用释放名额', async () => {
    const code = (await gift()).find((row) => row.productId === 'xnook')!.code;
    const first = await service.activateSoftwareLicense({ ...device('old'), code });
    await service.activateSoftwareLicense({ ...device('b'), code });
    await service.activateSoftwareLicense({ ...device('c'), code });
    const [binding] = (await service.listSoftwareDevicesByEmail('buyer@example.com')).filter((row) => row.deviceName === 'old');
    expect(await service.revokeSoftwareDevice('attacker@example.com', binding.id)).toBe(false);
    expect(await service.revokeSoftwareDevice('buyer@example.com', binding.id)).toBe(true);
    await expect(service.refreshSoftwareLicense({ ...device('old'), deviceToken: first.deviceToken })).rejects.toMatchObject({ code: 'device_revoked' });
    await expect(service.activateSoftwareLicense({ ...device('new'), code })).resolves.toHaveProperty('lease');
  });

  it('试用保留原始起点，13 天多仍可用，14 天后锁定', async () => {
    const input = device('trial');
    const initial = await service.startSoftwareTrial(input);
    const first = decode(initial.lease);
    expect(first.expiresAt - first.issuedAt).toBe(7 * 86400);
    expect(first.entitlementExpiresAt! - first.issuedAt).toBe(14 * 86400);
    await pool.query('UPDATE software_license_trials SET started_at=$1', [new Date(Date.now() - (13 * 86400 + 3600) * 1000).toISOString()]);
    const later = decode((await service.startSoftwareTrial(input)).lease);
    expect(later.entitlementExpiresAt! - later.issuedAt).toBeLessThan(86400);
    expect(later.expiresAt).toBe(later.entitlementExpiresAt);
    await pool.query('UPDATE software_license_trials SET started_at=$1', [new Date(Date.now() - 14 * 86400 * 1000 - 1000).toISOString()]);
    await expect(service.startSoftwareTrial(input)).rejects.toMatchObject({ code: 'expired', status: 403 });
  });

  it('退款或撤销父授权会阻止刷新，不能用其他软件的码激活', async () => {
    const id = await order('meteor-pass', 'lifetime');
    const codes = await service.ensureSoftwareCodesForOrder(id);
    const code = codes.find((row) => row.productId === 'xnook')!.code;
    await expect(service.activateSoftwareLicense({ ...device('wrong'), productId: 'xisland', code })).rejects.toMatchObject({ code: 'invalid_code' });
    const active = await service.activateSoftwareLicense({ ...device('paid'), code });
    await pool.query("UPDATE orders SET status='refunded' WHERE id=$1", [id]);
    await expect(service.refreshSoftwareLicense({ ...device('paid'), deviceToken: active.deviceToken })).rejects.toMatchObject({ code: 'revoked' });
    await pool.query("UPDATE orders SET status='paid' WHERE id=$1", [id]);
    await pool.query("UPDATE license_keys SET status='revoked' WHERE order_id=$1", [id]);
    await expect(service.refreshSoftwareLicense({ ...device('paid'), deviceToken: active.deviceToken })).rejects.toMatchObject({ code: 'revoked' });
  });

  it('管理员赠送请求幂等，签名有效且租约不含激活码或设备密钥', async () => {
    const requestId = randomUUID();
    const [first, repeat] = await Promise.all([gift('gift@example.com', 'annual', requestId), gift('gift@example.com', 'annual', requestId)]);
    expect(first.map((row) => row.code).sort()).toEqual(repeat.map((row) => row.code).sort());
    await expect(gift('other@example.com', 'annual', requestId)).rejects.toMatchObject({ code: 'idempotency_conflict' });
    const active = await service.activateSoftwareLicense({ ...device('gift'), code: first.find((row) => row.productId === 'xnook')!.code });
    const [prefix, encoded, signature] = active.lease.split('.');
    expect(verify(null, Buffer.from(`${prefix}.${encoded}`), keys.publicKey, Buffer.from(signature, 'base64url'))).toBe(true);
    expect(Object.keys(decode(active.lease)).sort()).toEqual(['version','productId','deviceId','licenseId','kind','issuedAt','expiresAt','entitlementExpiresAt'].sort());
    const stored = (await pool.query('SELECT token_hash FROM software_license_devices')).rows[0].token_hash;
    expect(stored).not.toBe(active.deviceToken);
  });

  it('注销清除设备关联但不删除试用起点', async () => {
    const input = device('deleting');
    await service.startSoftwareTrial(input);
    const code = (await gift()).find((row) => row.productId === 'xnook')!.code;
    await service.activateSoftwareLicense({ ...input, code });
    await service.deleteSoftwareDeviceData('buyer@example.com');
    expect((await pool.query('SELECT count(*) FROM software_license_devices')).rows[0].count).toBe('0');
    expect((await pool.query('SELECT count(*) FROM software_license_trials')).rows[0].count).toBe('1');
  });

  it('关闭销售开关回滚后仍导出和清理已存在的设备资料', async () => {
    const code = (await gift()).find((row) => row.productId === 'xnook')!.code;
    await service.activateSoftwareLicense({ ...device('privacy'), code });
    vi.stubEnv('SOFTWARE_LICENSE_ENABLED', 'false');
    try {
      expect(await service.listSoftwareDevicesByEmail('buyer@example.com')).toEqual([]);
      const exported = await service.exportSoftwareLicenseData('buyer@example.com');
      expect(exported.licenses).toHaveLength(2);
      expect(exported.devices).toHaveLength(1);
      expect(JSON.stringify(exported.devices)).not.toMatch(/tokenHash|deviceToken|deviceId/);
      await service.deleteSoftwareDeviceData('buyer@example.com');
      expect((await pool.query('SELECT count(*) FROM software_license_devices')).rows[0].count).toBe('0');
    } finally { vi.stubEnv('SOFTWARE_LICENSE_ENABLED', 'true'); }
  });
});
