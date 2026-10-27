import { createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { inviteCodes, inviteRedemptions, licenseKeys, orders, softwareLicenseCodes, softwareLicenseDevices, softwareLicenseTrials } from '@/lib/db/schema';
import { PASS_PRODUCT_ID, findPassPlan } from '@/data/pass';
import { isSoftwareLicensingEnabled } from './config';
import { getSoftwareSigningKey, OFFLINE_LEASE_SECONDS, signSoftwareLease, TRIAL_SECONDS } from './lease';
import { calculateSoftwareCoverage, requireActiveCoverage, softwareProductName } from './policy';
import { SOFTWARE_PRODUCT_IDS, SoftwareLicenseError, type SoftwareLicenseCodeView, type SoftwareLicenseDeviceView, type SoftwareLicenseKind, type SoftwareLeaseResponse, type SoftwareProductId } from './types';

type QueryDb = Pick<typeof db, 'select' | 'insert' | 'update' | 'delete' | 'execute'>;
const canonicalEmail = (email: string) => email.trim().toLowerCase();
const digest = (value: string) => createHash('sha256').update(value).digest('hex');
const nowISO = () => new Date().toISOString();
const newCode = () => `MS-${randomBytes(16).toString('hex').toUpperCase().match(/.{1,4}/g)!.join('-')}`;

function requireEnabled() {
  if (!isSoftwareLicensingEnabled()) throw new SoftwareLicenseError('unavailable', '授权服务尚未开放，请稍后再试', 503);
}

async function lock(q: QueryDb, value: string) {
  await q.execute(sql`SELECT pg_advisory_xact_lock(hashtextextended(${value}, 0))`);
}

function coveredProducts(productId: string): SoftwareProductId[] {
  return productId === PASS_PRODUCT_ID ? [...SOFTWARE_PRODUCT_IDS]
    : SOFTWARE_PRODUCT_IDS.filter((id) => id === productId);
}

async function rowsForOwner(q: QueryDb, email: string, productId?: SoftwareProductId) {
  return q.select({
    code: softwareLicenseCodes,
    sourceStatus: licenseKeys.status,
    orderStatus: orders.status,
    redemptionId: inviteRedemptions.id,
  }).from(softwareLicenseCodes)
    .innerJoin(licenseKeys, eq(licenseKeys.id, softwareLicenseCodes.sourceLicenseId))
    .leftJoin(orders, eq(orders.id, licenseKeys.orderId))
    .leftJoin(inviteRedemptions, eq(inviteRedemptions.licenseKey, licenseKeys.key))
    .where(and(eq(softwareLicenseCodes.email, canonicalEmail(email)), productId ? eq(softwareLicenseCodes.productId, productId) : undefined));
}
type CodeRow = Awaited<ReturnType<typeof rowsForOwner>>[number];

function sourceIsActive(row: CodeRow): boolean {
  return row.sourceStatus === 'active' && (
    row.code.sourceType === 'gift' ||
    (row.code.sourceType === 'order' && row.orderStatus === 'paid') ||
    (row.code.sourceType === 'invite' && row.redemptionId !== null)
  );
}

function coverageForRows(rows: CodeRow[], productId: SoftwareProductId) {
  return calculateSoftwareCoverage(rows.filter((row) => row.code.productId === productId && sourceIsActive(row)).map(({ code }) => ({
    id: code.sourceLicenseId, kind: code.kind as SoftwareLicenseKind, grantedAt: code.grantedAt,
  })));
}

function codeViews(rows: CodeRow[], now = new Date()): SoftwareLicenseCodeView[] {
  return rows.map((row) => {
    const { code } = row;
    const productId = code.productId as SoftwareProductId;
    const coverage = coverageForRows(rows, productId);
    const expired = coverage?.expiresAt !== null && coverage?.expiresAt !== undefined && new Date(coverage.expiresAt) <= now;
    return {
      id: code.id, sourceLicenseId: code.sourceLicenseId, productId, productName: softwareProductName(productId),
      code: code.code, kind: code.kind as SoftwareLicenseKind, expiresAt: coverage?.expiresAt ?? null,
      status: !sourceIsActive(row) || !coverage ? 'revoked' : expired ? 'expired' : 'active', createdAt: code.createdAt,
    };
  });
}

async function issueChildren(q: QueryDb, parent: typeof licenseKeys.$inferSelect, sourceType: 'order' | 'invite' | 'gift', kind: SoftwareLicenseKind, grantedAt: string, productIds = coveredProducts(parent.productId)) {
  if (!Number.isFinite(new Date(grantedAt).getTime())) throw new SoftwareLicenseError('invalid_source', '授权起始时间无效', 409);
  for (const productId of productIds) {
    await q.insert(softwareLicenseCodes).values({
      id: randomUUID(), sourceLicenseId: parent.id, productId, email: canonicalEmail(parent.email),
      code: newCode(), kind, sourceType, grantedAt, createdAt: nowISO(),
    }).onConflictDoNothing({ target: [softwareLicenseCodes.sourceLicenseId, softwareLicenseCodes.productId] });
  }
}

/** 只创建子码，不改变旧订单/父授权的权益计算或交付状态。 */
async function issueOrderCodes(orderId: string): Promise<{ owner: string; sourceId: string } | null> {
  let owner: string | null = null;
  let sourceId: string | null = null;
  await db.transaction(async (tx) => {
    await lock(tx, `software-order:${orderId}`);
    const [order] = await tx.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order || order.status !== 'paid' || coveredProducts(order.productId).length === 0) return;
    // 旧单品一直按买断承接，不能把历史 billing_period=monthly 误解为限期。
    const kind = order.productId === PASS_PRODUCT_ID ? findPassPlan(order.billingPeriod)?.id : 'lifetime';
    if (!kind) throw new SoftwareLicenseError('invalid_source', '订单套餐无法识别，请联系支持', 409);
    const grantedAt = order.paidAt ?? (order.deliveryStatus === 'not_required' ? order.createdAt : null);
    if (!grantedAt) throw new SoftwareLicenseError('invalid_source', '订单付款时间缺失，请联系支持', 409);
    let [parent] = await tx.select().from(licenseKeys).where(eq(licenseKeys.orderId, orderId)).limit(1);
    if (!parent) {
      await tx.insert(licenseKeys).values({ id: randomUUID(), orderId, productId: order.productId, planName: order.planName, email: order.email,
        key: `MC-${randomBytes(12).toString('hex').toUpperCase()}`, status: 'active', createdAt: nowISO() }).onConflictDoNothing({ target: licenseKeys.orderId });
      [parent] = await tx.select().from(licenseKeys).where(eq(licenseKeys.orderId, orderId)).limit(1);
    }
    if (parent.status !== 'active') return;
    await issueChildren(tx, parent, 'order', kind, grantedAt);
    owner = parent.email; sourceId = parent.id;
  });
  return owner && sourceId ? { owner, sourceId } : null;
}

async function issueInviteCodes(licenseKey: string): Promise<{ owner: string; sourceId: string } | null> {
  let owner: string | null = null;
  let sourceId: string | null = null;
  await db.transaction(async (tx) => {
    await lock(tx, `software-invite:${licenseKey}`);
    const [row] = await tx.select({ parent: licenseKeys, invite: inviteCodes, redeemedAt: inviteRedemptions.redeemedAt })
      .from(licenseKeys).innerJoin(inviteRedemptions, eq(inviteRedemptions.licenseKey, licenseKeys.key))
      .innerJoin(inviteCodes, eq(inviteCodes.id, inviteRedemptions.inviteCodeId)).where(eq(licenseKeys.key, licenseKey)).limit(1);
    if (!row || row.parent.status !== 'active' || coveredProducts(row.parent.productId).length === 0) return;
    const kind = row.parent.productId === PASS_PRODUCT_ID ? findPassPlan(row.invite.planId)?.id : 'lifetime';
    if (!kind) throw new SoftwareLicenseError('invalid_source', '赠送套餐无法识别，请联系支持', 409);
    await issueChildren(tx, row.parent, 'invite', kind, row.redeemedAt);
    owner = row.parent.email; sourceId = row.parent.id;
  });
  return owner && sourceId ? { owner, sourceId } : null;
}

async function hydrateOwnerSources(email: string) {
  const paidOrders = await db.select({ id: orders.id }).from(orders).where(and(
    sql`lower(${orders.email}) = ${canonicalEmail(email)}`, eq(orders.status, 'paid'),
    inArray(orders.productId, [...SOFTWARE_PRODUCT_IDS, PASS_PRODUCT_ID]),
  ));
  for (const order of paidOrders) {
    try { await issueOrderCodes(order.id); }
    catch (error) {
      if (!(error instanceof SoftwareLicenseError) || error.code !== 'invalid_source') throw error;
      // 无法证明期限的历史来源不授予权益，但不能阻断其它有效购买。
      console.warn('Skipped invalid historical software order', { orderId: order.id });
    }
  }
  const invites = await db.select({ key: licenseKeys.key }).from(licenseKeys)
    .innerJoin(inviteRedemptions, eq(inviteRedemptions.licenseKey, licenseKeys.key))
    .where(and(sql`lower(${licenseKeys.email}) = ${canonicalEmail(email)}`, eq(licenseKeys.status, 'active')));
  for (const invite of invites) {
    try { await issueInviteCodes(invite.key); }
    catch (error) {
      if (!(error instanceof SoftwareLicenseError) || error.code !== 'invalid_source') throw error;
      console.warn('Skipped invalid historical software invitation');
    }
  }
}

export async function ensureSoftwareCodesForOrder(orderId: string): Promise<SoftwareLicenseCodeView[]> {
  if (!isSoftwareLicensingEnabled()) return [];
  const source = await issueOrderCodes(orderId);
  if (!source) return [];
  await hydrateOwnerSources(source.owner);
  return codeViews(await rowsForOwner(db, source.owner)).filter((row) => row.sourceLicenseId === source.sourceId);
}

export async function ensureSoftwareCodesForInvite(licenseKey: string): Promise<SoftwareLicenseCodeView[]> {
  if (!isSoftwareLicensingEnabled()) return [];
  const source = await issueInviteCodes(licenseKey);
  if (!source) return [];
  await hydrateOwnerSources(source.owner);
  return codeViews(await rowsForOwner(db, source.owner)).filter((row) => row.sourceLicenseId === source.sourceId);
}

export async function getSoftwareCodesByOrderId(orderId: string): Promise<SoftwareLicenseCodeView[]> {
  return ensureSoftwareCodesForOrder(orderId);
}

/** 已验证的用户取回历史购买时补齐子码，旧权益不会因发布新客户端消失。 */
export async function listSoftwareLicensesByEmail(email: string): Promise<SoftwareLicenseCodeView[]> {
  if (!isSoftwareLicensingEnabled()) return [];
  await hydrateOwnerSources(email);
  return codeViews(await rowsForOwner(db, email));
}

export async function grantSoftwareLicenses(input: {
  email: string; productIds: SoftwareProductId[]; kind: SoftwareLicenseKind;
  createdBy: string; memo?: string; requestId: string;
}): Promise<SoftwareLicenseCodeView[]> {
  requireEnabled();
  const email = canonicalEmail(input.email);
  await hydrateOwnerSources(email);
  const orderId = `GIFT-${input.requestId}`;
  let sourceId = '';
  await db.transaction(async (tx) => {
    await lock(tx, `software-gift:${input.requestId}`);
    let [parent] = await tx.select().from(licenseKeys).where(eq(licenseKeys.orderId, orderId)).limit(1);
    if (parent) {
      const children = await tx.select().from(softwareLicenseCodes).where(eq(softwareLicenseCodes.sourceLicenseId, parent.id));
      const actual = children.map((row) => row.productId).sort().join(',');
      if (canonicalEmail(parent.email) !== email || children.some((row) => row.kind !== input.kind) || actual !== [...new Set(input.productIds)].sort().join(',')) {
        throw new SoftwareLicenseError('idempotency_conflict', '该请求已用于另一笔赠送，请刷新后重试', 409);
      }
      sourceId = parent.id; return;
    }
    const timestamp = nowISO();
    [parent] = await tx.insert(licenseKeys).values({ id: randomUUID(), orderId, productId: input.productIds.length === 1 ? input.productIds[0] : PASS_PRODUCT_ID,
      planName: input.kind, email, key: `MC-${randomBytes(12).toString('hex').toUpperCase()}`, status: 'active', createdAt: timestamp }).returning();
    await issueChildren(tx, parent, 'gift', input.kind, timestamp, [...new Set(input.productIds)]);
    sourceId = parent.id;
  });
  return codeViews(await rowsForOwner(db, email)).filter((row) => row.sourceLicenseId === sourceId);
}

type DeviceInput = { productId: SoftwareProductId; deviceId: string; deviceName: string };
type TokenInput = { productId: SoftwareProductId; deviceId: string; deviceToken: string };

async function saveDevice(q: QueryDb, input: DeviceInput, email: string | null, timestamp: string) {
  const deviceToken = randomBytes(32).toString('base64url');
  const values = { deviceName: input.deviceName, email, tokenHash: digest(deviceToken), status: 'active', activatedAt: timestamp, lastSeenAt: timestamp, revokedAt: null };
  await q.insert(softwareLicenseDevices).values({ id: randomUUID(), productId: input.productId, deviceId: input.deviceId, ...values })
    .onConflictDoUpdate({ target: [softwareLicenseDevices.productId, softwareLicenseDevices.deviceId], set: values });
  return deviceToken;
}

function leaseFor(input: { productId: SoftwareProductId; deviceId: string }, licenseId: string, kind: SoftwareLicenseKind | 'trial', expiresAt: string | null, now: Date, key: ReturnType<typeof getSoftwareSigningKey>): string {
  const issuedAt = Math.floor(now.getTime() / 1000);
  const entitlementExpiresAt = expiresAt === null ? null : Math.floor(new Date(expiresAt).getTime() / 1000);
  return signSoftwareLease({ version: 1, productId: input.productId, deviceId: input.deviceId, licenseId, kind, issuedAt,
    expiresAt: Math.min(issuedAt + OFFLINE_LEASE_SECONDS, entitlementExpiresAt ?? Infinity), entitlementExpiresAt }, key);
}

export async function startSoftwareTrial(input: DeviceInput): Promise<SoftwareLeaseResponse> {
  requireEnabled(); const key = getSoftwareSigningKey();
  return db.transaction(async (tx) => {
    await lock(tx, `software-device:${input.productId}:${input.deviceId}`);
    const now = new Date();
    const [device] = await tx.select().from(softwareLicenseDevices).where(and(eq(softwareLicenseDevices.productId, input.productId), eq(softwareLicenseDevices.deviceId, input.deviceId))).limit(1);
    if (device?.status === 'active' && device.email !== null) throw new SoftwareLicenseError('already_activated', '该设备已激活，请刷新授权或重新输入激活码', 409);
    await tx.insert(softwareLicenseTrials).values({ id: randomUUID(), productId: input.productId, deviceId: input.deviceId, startedAt: now.toISOString() })
      .onConflictDoNothing({ target: [softwareLicenseTrials.productId, softwareLicenseTrials.deviceId] });
    const [trial] = await tx.select().from(softwareLicenseTrials).where(and(eq(softwareLicenseTrials.productId, input.productId), eq(softwareLicenseTrials.deviceId, input.deviceId))).limit(1);
    const expiresAt = new Date(new Date(trial.startedAt).getTime() + TRIAL_SECONDS * 1000).toISOString();
    requireActiveCoverage({ kind: 'monthly', expiresAt }, now);
    const deviceToken = await saveDevice(tx, input, null, now.toISOString());
    return { lease: leaseFor(input, trial.id, 'trial', expiresAt, now, key), deviceToken };
  });
}

export async function activateSoftwareLicense(input: DeviceInput & { code: string }): Promise<SoftwareLeaseResponse> {
  requireEnabled(); const key = getSoftwareSigningKey();
  const [source] = await db.select({ email: softwareLicenseCodes.email }).from(softwareLicenseCodes)
    .where(and(eq(softwareLicenseCodes.code, input.code.trim().toUpperCase()), eq(softwareLicenseCodes.productId, input.productId))).limit(1);
  if (!source) throw new SoftwareLicenseError('invalid_code', '激活码无效或不适用于此软件', 403);
  await hydrateOwnerSources(source.email);
  return db.transaction(async (tx) => {
    await lock(tx, `software-device:${input.productId}:${input.deviceId}`);
    const [code] = await tx.select().from(softwareLicenseCodes).where(and(eq(softwareLicenseCodes.code, input.code.trim().toUpperCase()), eq(softwareLicenseCodes.productId, input.productId))).limit(1);
    if (!code) throw new SoftwareLicenseError('invalid_code', '激活码无效或不适用于此软件', 403);
    await lock(tx, `software-owner:${code.email}:${input.productId}`);
    const rows = await rowsForOwner(tx, code.email, input.productId);
    const selected = rows.find((row) => row.code.id === code.id);
    if (!selected || !sourceIsActive(selected)) throw new SoftwareLicenseError('revoked', '激活码已撤销，请联系支持', 403);
    const now = new Date();
    const coverage = requireActiveCoverage(coverageForRows(rows, input.productId), now);
    const devices = await tx.select({ deviceId: softwareLicenseDevices.deviceId }).from(softwareLicenseDevices).where(and(
      eq(softwareLicenseDevices.email, code.email), eq(softwareLicenseDevices.productId, input.productId), eq(softwareLicenseDevices.status, 'active'),
    ));
    if (!devices.some((device) => device.deviceId === input.deviceId) && devices.length >= 3) {
      throw new SoftwareLicenseError('device_limit', '已达到 3 台设备上限，请到网站解绑旧设备', 409);
    }
    const deviceToken = await saveDevice(tx, input, code.email, now.toISOString());
    return { lease: leaseFor(input, digest(`${code.email}:${input.productId}`), coverage.kind, coverage.expiresAt, now, key), deviceToken };
  });
}

async function authenticateDevice(q: QueryDb, input: TokenInput) {
  const [device] = await q.select().from(softwareLicenseDevices).where(and(eq(softwareLicenseDevices.productId, input.productId), eq(softwareLicenseDevices.deviceId, input.deviceId))).limit(1);
  const incoming = digest(input.deviceToken);
  if (!device || device.status !== 'active' || device.tokenHash.length !== incoming.length || !timingSafeEqual(Buffer.from(device.tokenHash), Buffer.from(incoming))) {
    throw new SoftwareLicenseError('device_revoked', '设备授权已失效，请重新激活', 403);
  }
  return device;
}

export async function refreshSoftwareLicense(input: TokenInput): Promise<SoftwareLeaseResponse> {
  requireEnabled(); const key = getSoftwareSigningKey();
  const previous = await authenticateDevice(db, input);
  if (previous.email !== null) await hydrateOwnerSources(previous.email);
  return db.transaction(async (tx) => {
    await lock(tx, `software-device:${input.productId}:${input.deviceId}`);
    const device = await authenticateDevice(tx, input);
    const now = new Date();
    let lease: string;
    if (device.email !== null) {
      const coverage = requireActiveCoverage(coverageForRows(await rowsForOwner(tx, device.email, input.productId), input.productId), now);
      lease = leaseFor(input, digest(`${device.email}:${input.productId}`), coverage.kind, coverage.expiresAt, now, key);
    } else {
      const [trial] = await tx.select().from(softwareLicenseTrials).where(and(eq(softwareLicenseTrials.productId, input.productId), eq(softwareLicenseTrials.deviceId, input.deviceId))).limit(1);
      if (!trial) throw new SoftwareLicenseError('invalid_trial', '试用记录不可用', 403);
      const expiresAt = new Date(new Date(trial.startedAt).getTime() + TRIAL_SECONDS * 1000).toISOString();
      requireActiveCoverage({ kind: 'monthly', expiresAt }, now);
      lease = leaseFor(input, trial.id, 'trial', expiresAt, now, key);
    }
    await tx.update(softwareLicenseDevices).set({ lastSeenAt: now.toISOString() }).where(eq(softwareLicenseDevices.id, device.id));
    return { lease, deviceToken: input.deviceToken };
  });
}

export async function deactivateSoftwareLicense(input: TokenInput): Promise<void> {
  requireEnabled();
  await db.transaction(async (tx) => {
    await lock(tx, `software-device:${input.productId}:${input.deviceId}`);
    const device = await authenticateDevice(tx, input);
    await tx.update(softwareLicenseDevices).set({ status: 'revoked', revokedAt: nowISO() }).where(eq(softwareLicenseDevices.id, device.id));
  });
}

async function readSoftwareDevices(email: string): Promise<SoftwareLicenseDeviceView[]> {
  const rows = await db.select().from(softwareLicenseDevices).where(eq(softwareLicenseDevices.email, canonicalEmail(email)));
  return rows.map((row) => ({ id: row.id, productId: row.productId as SoftwareProductId, productName: softwareProductName(row.productId as SoftwareProductId),
    deviceName: row.deviceName, status: row.status as 'active' | 'revoked', activatedAt: row.activatedAt, lastSeenAt: row.lastSeenAt, revokedAt: row.revokedAt }));
}

export async function listSoftwareDevicesByEmail(email: string): Promise<SoftwareLicenseDeviceView[]> {
  return isSoftwareLicensingEnabled() ? readSoftwareDevices(email) : [];
}

export async function revokeSoftwareDevice(email: string, id: string): Promise<boolean> {
  requireEnabled();
  return db.transaction(async (tx) => {
    const [device] = await tx.select().from(softwareLicenseDevices).where(and(eq(softwareLicenseDevices.id, id), eq(softwareLicenseDevices.email, canonicalEmail(email)))).limit(1);
    if (!device) return false;
    await lock(tx, `software-device:${device.productId}:${device.deviceId}`);
    const result = await tx.update(softwareLicenseDevices).set({ status: 'revoked', revokedAt: nowISO() }).where(and(
      eq(softwareLicenseDevices.id, id), eq(softwareLicenseDevices.email, canonicalEmail(email)), eq(softwareLicenseDevices.status, 'active'),
    ));
    return (result.rowCount ?? 0) > 0;
  });
}

export async function exportSoftwareLicenseData(email: string) {
  if (!(await softwareStorageExists())) return { licenses: [], devices: [] };
  const [rows, devices] = await Promise.all([rowsForOwner(db, email), readSoftwareDevices(email)]);
  return { licenses: codeViews(rows), devices };
}

export async function deleteSoftwareDeviceData(email: string): Promise<void> {
  if (!(await softwareStorageExists())) return;
  // 财务授权记录沿用订单保留政策；删除设备名和邮箱关联，试用表仅保留不可逆设备摘要。
  await db.delete(softwareLicenseDevices).where(eq(softwareLicenseDevices.email, canonicalEmail(email)));
}

async function softwareStorageExists(): Promise<boolean> {
  if (isSoftwareLicensingEnabled()) return true;
  // 销售回滚开关不能取消数据导出/注销义务；首次部署未迁移则无需查不存在的新表。
  const result = await db.execute(sql`SELECT to_regclass('public.software_license_devices') IS NOT NULL
    AND to_regclass('public.software_license_codes') IS NOT NULL AS present`);
  return result.rows[0]?.present === true;
}
