import { and, asc, desc, eq, ilike, inArray, isNotNull, ne, or, sql, type SQL } from 'drizzle-orm';
import { db } from './db';
import { inviteCodes, inviteRedemptions, licenseKeys, orders, users } from './db/schema';
import { PASS_PRODUCT_ID, type PassPlanId } from '@/data/pass';
import { accumulatePass, type Grant } from './entitlements';
import { getAdminEmails, isAdminEmail } from './admin';

/**
 * 后台的账号与会员视图。
 *
 * 会员状态**不重算一套规则**，而是复用 entitlements 的 `accumulatePass`：
 * 后台显示的到期时间必须和用户在 /apps、/account 看到的逐字一致，
 * 否则「后台说还有 3 天、用户说已经打不开了」这种问题永远查不清。
 * 授权码撤销的门控（已交付订单要求 license active、邀请码要求 active）也照抄，
 * 原因同上——退款后后台不该还把人显示成会员。
 */

export type AdminUserFilter =
  | 'all'
  | 'pass'
  | 'pass-expired'
  | 'admin'
  | 'unverified'
  | 'mfa'
  | 'wechat';

export const ADMIN_USER_PAGE_SIZE = 25;

/** 会员筛选一次最多纳入多少个「持有过 Pass」的候选账号，见 listAdminUsers 里的说明 */
const PASS_CANDIDATE_LIMIT = 5000;

export interface AdminUserPass {
  planId: PassPlanId | null;
  /** null 且 lifetime 为 false 表示算不出覆盖范围（脏 billing_period） */
  expiresAt: string | null;
  lifetime: boolean;
  active: boolean;
  grantedAt: string | null;
}

/**
 * 只放页面真正会渲染的字段。
 * 这个对象会跨 RSC 边界整份序列化进页面，多带一个字段就是多泄漏一份数据——
 * `studentEmail`、`avatarUrl` 属于 PII，没有展示需求就不要装进来。
 */
export interface AdminUserSummary {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  isStudent: boolean;
  totpEnabled: boolean;
  hasWechat: boolean;
  createdAt: string;
  /** 由 ADMIN_EMAILS 现算，不是数据库字段——加 is_admin 列等于多一个提权面 */
  isAdmin: boolean;
  pass: AdminUserPass | null;
  paidOrders: number;
  totalSpentCny: number;
  postCount: number;
  commentCount: number;
  redemptionCount: number;
  activeTokens: number;
}

export interface AdminUserPage {
  users: AdminUserSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminUserDetail {
  user: AdminUserSummary;
  orders: {
    id: string;
    productId: string;
    planName: string;
    amountCny: number;
    status: string;
    deliveryStatus: string;
    billingPeriod: string;
    paidAt: string | null;
    createdAt: string;
  }[];
  licenses: {
    id: string;
    productId: string;
    planName: string;
    key: string;
    status: string;
    createdAt: string;
  }[];
  redemptions: {
    id: string;
    code: string;
    productId: string;
    planName: string;
    licenseKey: string;
    redeemedAt: string;
  }[];
}

/** ADMIN_EMAILS 的落地情况：配了邮箱不等于真能进后台 */
export interface AdminRosterEntry {
  email: string;
  userId: string | null;
  name: string | null;
  registered: boolean;
  emailVerified: boolean;
  totpEnabled: boolean;
  /** 账号存在且邮箱已验证时才真正拥有后台权限（isAdminSession 的两个条件） */
  effective: boolean;
}

/** ILIKE 的通配符要转义，否则搜 `a_b` 会把 `axb` 也搜出来 */
function escapeLike(input: string): string {
  return input.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/*
 * 相关子查询里引用外层表，必须**手写限定名**（`"users"."id"`），不能用 `${users.id}`。
 *
 * drizzle 在单表查询里会把 SELECT 列表内 `sql` 片段中的 Column 改写成裸列名：
 * `${users.id}` 生成的是 `"id"` 而不是 `"users"."id"`。而下面每张子查询表
 * （orders / posts / comments / invite_redemptions / personal_access_tokens）
 * 都有自己的 `id` 列，Postgres 按内层优先解析，于是
 * `p.author_id = "id"` 实际是 `p.author_id = p.id`——恒为 0；
 * `o.email = "email"` 实际是 `o.email = o.email`——恒真，把「这个人的订单数」
 * 变成「全站订单数」。**不报错，只是数字全错**。
 *
 * 注意同样的写法放在 WHERE 里是对的（见 hasPassGrantSql），drizzle 只改写
 * SELECT 列表——一对一错全看位置，所以下面 `admin-users-sql.test.ts`
 * 用 `.toSQL()` 把限定名钉住了，改这段之后必须让那条测试仍然绿。
 */
const OUTER_ID = sql.raw('"users"."id"');
const OUTER_EMAIL = sql.raw('"users"."email"');
const OUTER_TOKEN_VERSION = sql.raw('"users"."token_version"');
/*
 * 「活跃令牌」只看 slot 是不够的：槽位是**下次创建 PAT 时才惰性回收**的，
 * 所以刚被强制下线的账号，令牌全都失效了而 slot 仍非 null——
 * 管理员点完强制下线看到计数没动，会以为操作没生效。
 * expires_at 是 ISO 字符串列，比较前要转成 timestamptz，
 * 直接和 now()::text 比字符串是错的（格式不同）。
 */
const ACTIVE_TOKEN_FILTER = sql`t.revoked_at is null and t.expires_at::timestamptz > now() and t.token_version = ${OUTER_TOKEN_VERSION}`;

const listSelection = {
  id: users.id,
  email: users.email,
  name: users.name,
  emailVerified: users.emailVerified,
  isStudent: users.isStudent,
  totpEnabled: users.totpEnabled,
  hasWechat: sql<boolean>`${users.wechatOpenid} is not null`,
  createdAt: users.createdAt,
  // 相关子查询而不是 5 个 leftJoin + group by：join 聚合会互相放大行数，
  // 而每人的订单/文章/评论量都很小，子查询更好读也更好改。
  paidOrders: sql<number>`(select count(*)::int from orders o where o.status = 'paid' and (o.user_id = ${OUTER_ID} or o.email = ${OUTER_EMAIL}))`,
  totalSpentCny: sql<number>`(select coalesce(sum(o.amount_cny), 0)::int from orders o where o.status = 'paid' and (o.user_id = ${OUTER_ID} or o.email = ${OUTER_EMAIL}))`,
  postCount: sql<number>`(select count(*)::int from posts p where p.author_id = ${OUTER_ID})`,
  commentCount: sql<number>`(select count(*)::int from comments c where c.author_id = ${OUTER_ID})`,
  redemptionCount: sql<number>`(select count(*)::int from invite_redemptions r where r.user_id = ${OUTER_ID})`,
  activeTokens: sql<number>`(select count(*)::int from personal_access_tokens t where t.user_id = ${OUTER_ID} and ${ACTIVE_TOKEN_FILTER})`,
};

/**
 * 行类型直接从查询推出来，改 listSelection 不用同步维护第二份类型。
 * 导出是给 `admin-users-sql.test.ts` 用 `.toSQL()` 检查生成的 SQL，不要在别处调用。
 */
export const adminUserListQuery = () => db.select(listSelection).from(users);
type ListRow = Awaited<ReturnType<typeof adminUserListQuery>>[number];

/** 「持有过 Pass」的候选条件：订单买过，或邀请码兑换过 */
function hasPassGrantSql(): SQL {
  return sql`(
    exists (
      select 1 from orders o
      where o.status = 'paid' and o.product_id = ${PASS_PRODUCT_ID}
        and (o.user_id = ${users.id} or o.email = ${users.email})
    )
    or exists (
      select 1 from invite_redemptions r
      join invite_codes ic on ic.id = r.invite_code_id
      where r.user_id = ${users.id} and ic.product_id = ${PASS_PRODUCT_ID}
    )
  )`;
}

function searchCondition(query: string | undefined): SQL | undefined {
  const q = query?.trim();
  if (!q) return undefined;
  const pattern = `%${escapeLike(q)}%`;
  return or(ilike(users.email, pattern), ilike(users.name, pattern), eq(users.id, q));
}

/**
 * 批量算 Pass：一次把这批用户的 Pass 授权全捞回来，在内存里按人累加。
 * 别改成逐个用户调 `getUserEntitlementSummary`——Neon HTTP 下那是每人两次网络往返。
 */
async function computePassMap(
  targets: { id: string; email: string }[],
): Promise<Map<string, AdminUserPass>> {
  const result = new Map<string, AdminUserPass>();
  if (targets.length === 0) return result;

  const ids = targets.map((t) => t.id);
  const emails = targets.map((t) => t.email);

  const [orderRows, inviteRows] = await Promise.all([
    db
      .select({
        userId: orders.userId,
        email: orders.email,
        planName: orders.planName,
        planId: orders.planId,
        billingPeriod: orders.billingPeriod,
        paidAt: orders.paidAt,
        deliveryStatus: orders.deliveryStatus,
        licenseStatus: licenseKeys.status,
      })
      .from(orders)
      // license_keys.order_id 是 unique，leftJoin 保持 1:1，不会放大行数
      .leftJoin(licenseKeys, eq(licenseKeys.orderId, orders.id))
      .where(
        and(
          eq(orders.status, 'paid'),
          eq(orders.productId, PASS_PRODUCT_ID),
          or(inArray(orders.userId, ids), inArray(orders.email, emails)),
        ),
      ),
    db
      .select({
        userId: inviteRedemptions.userId,
        planId: inviteCodes.planId,
        planName: inviteCodes.planName,
        redeemedAt: inviteRedemptions.redeemedAt,
      })
      .from(inviteRedemptions)
      .innerJoin(inviteCodes, eq(inviteRedemptions.inviteCodeId, inviteCodes.id))
      .innerJoin(licenseKeys, eq(licenseKeys.key, inviteRedemptions.licenseKey))
      .where(
        and(
          inArray(inviteRedemptions.userId, ids),
          eq(inviteCodes.productId, PASS_PRODUCT_ID),
          eq(licenseKeys.status, 'active'),
        ),
      ),
  ]);

  const grantsByUser = new Map<string, Grant[]>();
  const push = (userId: string, grant: Grant) => {
    const list = grantsByUser.get(userId);
    if (list) list.push(grant);
    else grantsByUser.set(userId, [grant]);
  };

  const ordersByUserId = new Map<string, typeof orderRows>();
  const ordersByEmail = new Map<string, typeof orderRows>();
  for (const row of orderRows) {
    // 已发出授权码的订单，撤销授权码等于收回访问权；未交付的处于窗口期照常放行
    if (row.deliveryStatus === 'emailed' && row.licenseStatus !== 'active') continue;
    if (row.userId) {
      const list = ordersByUserId.get(row.userId);
      if (list) list.push(row); else ordersByUserId.set(row.userId, [row]);
    }
    const byEmail = ordersByEmail.get(row.email);
    if (byEmail) byEmail.push(row); else ordersByEmail.set(row.email, [row]);
  }

  for (const target of targets) {
    // userId 与 email 两条匹配可能命中同一行，用 Set 去重
    const matched = new Set([
      ...(ordersByUserId.get(target.id) ?? []),
      ...(ordersByEmail.get(target.email) ?? []),
    ]);
    for (const row of matched) {
      push(target.id, {
        productId: PASS_PRODUCT_ID,
        planName: row.planName,
        planId: row.planId,
        billingPeriod: row.billingPeriod,
        grantedAt: row.paidAt,
        // Pass 订单把档位存在 billing_period 里（monthly | annual | lifetime）
        passPlanKey: row.billingPeriod,
      });
    }
  }

  for (const row of inviteRows) {
    push(row.userId, {
      productId: PASS_PRODUCT_ID,
      planName: row.planName,
      planId: row.planId,
      billingPeriod: row.planId,
      grantedAt: row.redeemedAt,
      passPlanKey: row.planId,
    });
  }

  const now = Date.now();
  for (const [userId, grants] of grantsByUser) {
    const pass = accumulatePass(grants);
    if (!pass) continue;
    result.set(userId, {
      planId: pass.planId,
      expiresAt: pass.expiresAt,
      lifetime: pass.lifetime,
      active: pass.lifetime || (pass.expiresAt !== null && new Date(pass.expiresAt).getTime() > now),
      grantedAt: pass.grantedAt,
    });
  }

  return result;
}

function toSummary(row: ListRow, pass: AdminUserPass | null): AdminUserSummary {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    emailVerified: row.emailVerified,
    isStudent: row.isStudent,
    totpEnabled: row.totpEnabled,
    hasWechat: Boolean(row.hasWechat),
    createdAt: row.createdAt,
    isAdmin: isAdminEmail(row.email),
    pass,
    paidOrders: Number(row.paidOrders ?? 0),
    totalSpentCny: Number(row.totalSpentCny ?? 0),
    postCount: Number(row.postCount ?? 0),
    commentCount: Number(row.commentCount ?? 0),
    redemptionCount: Number(row.redemptionCount ?? 0),
    activeTokens: Number(row.activeTokens ?? 0),
  };
}

/**
 * 账号列表。
 *
 * 会员筛选（pass / pass-expired）走另一条路：Pass 是否有效要靠内存里的档位叠加才算得准，
 * SQL 里算不出。所以先用 EXISTS 把「持有过 Pass 的人」捞成候选集（就是付费用户，量本来就小），
 * 在内存里算准之后再分页。这样翻页数和总数都是真的——
 * 若反过来先分页再在内存里筛，每页会少几条而总数还按 SQL 的算，页码直接对不上。
 */
export async function listAdminUsers(options: {
  query?: string;
  filter?: AdminUserFilter;
  page?: number;
  pageSize?: number;
} = {}): Promise<AdminUserPage> {
  const filter = options.filter ?? 'all';
  const pageSize = Math.min(Math.max(options.pageSize ?? ADMIN_USER_PAGE_SIZE, 1), 100);
  const page = Math.max(options.page ?? 1, 1);
  const search = searchCondition(options.query);

  if (filter === 'pass' || filter === 'pass-expired') {
    /*
     * 候选集必须有硬上限：它随后整批进 `inArray`，而 Postgres 的参数上限是 65535，
     * 每人占 2 个参数位（id + email）。付费用户数远到不了这个量级，
     * 但「远到不了」不是理由——真到了会是一次静默失败，不如现在就截断并告警。
     */
    const candidates = await db
      .select({ id: users.id, email: users.email, createdAt: users.createdAt })
      .from(users)
      .where(and(hasPassGrantSql(), search))
      .orderBy(desc(users.createdAt))
      .limit(PASS_CANDIDATE_LIMIT + 1);

    if (candidates.length > PASS_CANDIDATE_LIMIT) {
      console.warn(
        `[admin-users] 持有过 Pass 的账号超过 ${PASS_CANDIDATE_LIMIT} 个，` +
        '会员筛选只覆盖最近注册的这批，需要改成分批计算',
      );
      candidates.length = PASS_CANDIDATE_LIMIT;
    }

    const passMap = await computePassMap(candidates);
    const wantActive = filter === 'pass';
    const matched = candidates.filter((c) => {
      const pass = passMap.get(c.id);
      return pass ? pass.active === wantActive : false;
    });

    const pageIds = matched.slice((page - 1) * pageSize, page * pageSize).map((c) => c.id);
    if (pageIds.length === 0) {
      return { users: [], total: matched.length, page, pageSize };
    }
    const rows = await adminUserListQuery().where(inArray(users.id, pageIds));
    // inArray 不保证顺序，按候选集的时间序还原
    const byId = new Map(rows.map((r) => [r.id, r]));
    return {
      users: pageIds
        .map((id) => byId.get(id))
        .filter((r): r is ListRow => Boolean(r))
        .map((r) => toSummary(r, passMap.get(r.id) ?? null)),
      total: matched.length,
      page,
      pageSize,
    };
  }

  const adminEmails = getAdminEmails();
  let extra: SQL | undefined;
  if (filter === 'admin') {
    // 未配置 ADMIN_EMAILS 时谁都不是管理员，别退化成「全表」
    if (adminEmails.length === 0) return { users: [], total: 0, page, pageSize };
    extra = inArray(sql`lower(${users.email})`, adminEmails);
  } else if (filter === 'unverified') {
    extra = eq(users.emailVerified, false);
  } else if (filter === 'mfa') {
    extra = eq(users.totpEnabled, true);
  } else if (filter === 'wechat') {
    extra = isNotNull(users.wechatOpenid);
  }

  const where = and(search, extra);
  const [rows, totalRows] = await Promise.all([
    adminUserListQuery()
      .where(where)
      .orderBy(desc(users.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ total: sql<number>`count(*)::int` }).from(users).where(where),
  ]);

  const passMap = await computePassMap(rows.map((r) => ({ id: r.id, email: r.email })));
  return {
    users: rows.map((r) => toSummary(r, passMap.get(r.id) ?? null)),
    total: Number(totalRows[0]?.total ?? 0),
    page,
    pageSize,
  };
}

/** 单个账号的完整档案：订单、授权码、邀请码兑换。 */
export async function getAdminUserDetail(userId: string): Promise<AdminUserDetail | null> {
  const rows = await adminUserListQuery().where(eq(users.id, userId)).limit(1);
  const row = rows[0];
  if (!row) return null;

  const [passMap, orderRows, licenseRows, redemptionRows] = await Promise.all([
    computePassMap([{ id: row.id, email: row.email }]),
    db
      .select({
        id: orders.id,
        productId: orders.productId,
        planName: orders.planName,
        amountCny: orders.amountCny,
        status: orders.status,
        deliveryStatus: orders.deliveryStatus,
        billingPeriod: orders.billingPeriod,
        paidAt: orders.paidAt,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(or(eq(orders.userId, row.id), eq(orders.email, row.email)))
      .orderBy(desc(orders.createdAt))
      .limit(100),
    db
      .select({
        id: licenseKeys.id,
        productId: licenseKeys.productId,
        planName: licenseKeys.planName,
        key: licenseKeys.key,
        status: licenseKeys.status,
        createdAt: licenseKeys.createdAt,
      })
      .from(licenseKeys)
      .where(eq(licenseKeys.email, row.email))
      .orderBy(desc(licenseKeys.createdAt))
      .limit(100),
    db
      .select({
        id: inviteRedemptions.id,
        code: inviteCodes.code,
        productId: inviteCodes.productId,
        planName: inviteCodes.planName,
        licenseKey: inviteRedemptions.licenseKey,
        redeemedAt: inviteRedemptions.redeemedAt,
      })
      .from(inviteRedemptions)
      .innerJoin(inviteCodes, eq(inviteRedemptions.inviteCodeId, inviteCodes.id))
      .where(eq(inviteRedemptions.userId, row.id))
      .orderBy(desc(inviteRedemptions.redeemedAt))
      .limit(100),
  ]);

  return {
    user: toSummary(row, passMap.get(row.id) ?? null),
    orders: orderRows,
    licenses: licenseRows,
    redemptions: redemptionRows,
  };
}

/**
 * ADMIN_EMAILS 的落地情况。
 *
 * 配了邮箱不等于真能进后台：`isAdminSession` 还要求账号存在且邮箱已验证。
 * 把这份对照表摆出来，是为了让「明明配了却进不去」这种事一眼可见，
 * 而不是等人来报障。
 */
export async function getAdminRoster(): Promise<AdminRosterEntry[]> {
  const emails = getAdminEmails();
  if (emails.length === 0) return [];

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      emailVerified: users.emailVerified,
      totpEnabled: users.totpEnabled,
    })
    .from(users)
    .where(inArray(sql`lower(${users.email})`, emails))
    .orderBy(asc(users.email));

  const byEmail = new Map(rows.map((r) => [r.email.trim().toLowerCase(), r]));
  return emails.map((email) => {
    const row = byEmail.get(email);
    return {
      email,
      userId: row?.id ?? null,
      name: row?.name ?? null,
      registered: Boolean(row),
      emailVerified: row?.emailVerified ?? false,
      totpEnabled: row?.totpEnabled ?? false,
      effective: Boolean(row?.emailVerified),
    };
  });
}

/**
 * 强制下线：递增 token_version。
 *
 * 这是全站唯一的批量撤销手段——会话 JWT、个人访问令牌、「记住此设备」令牌
 * 都拿签发时的版本号跟数据库比对，递增一次三者同时失效。
 */
export async function revokeUserSessions(userId: string): Promise<number | null> {
  const rows = await db
    .update(users)
    .set({ tokenVersion: sql`${users.tokenVersion} + 1` })
    .where(eq(users.id, userId))
    .returning({ tokenVersion: users.tokenVersion });
  return rows[0]?.tokenVersion ?? null;
}

/**
 * 解除两步验证，**并同时递增 token_version**。
 *
 * 站内没有自助解锁路径：验证器和恢复码同时丢失时，此前只能直接改库。
 * 半绑定状态（有 secret 但没启用）也一并清掉，否则用户重新绑定会撞上旧 secret。
 *
 * 为什么连带作废会话：「记住此设备」令牌绑的是 `userId + tokenVersion`，
 * 它的作用恰恰是**跳过第二因子**。而管理员执行这个动作的典型场景就是
 * 「用户把手机弄丢了」——那台手机上很可能正躺着一张 30 天免检票。
 * 只清 TOTP 不动版本号，等于把门锁换了却留着后门钥匙。
 * 代价是对方所有设备都要重新登录，这在丢设备的场景下是想要的结果。
 */
export async function resetUserMfa(userId: string): Promise<boolean> {
  const rows = await db
    .update(users)
    .set({
      totpEnabled: false,
      totpSecretEnc: null,
      totpRecoveryCodes: null,
      tokenVersion: sql`${users.tokenVersion} + 1`,
    })
    .where(
      and(
        eq(users.id, userId),
        or(eq(users.totpEnabled, true), isNotNull(users.totpSecretEnc)),
      ),
    )
    .returning({ id: users.id });
  return rows.length > 0;
}

/** 手动改写邮箱验证状态；条件更新，状态没变化时返回 false（前端据此提示"未变化"）。 */
export async function setUserEmailVerified(
  userId: string,
  verified: boolean,
): Promise<boolean> {
  const rows = await db
    .update(users)
    .set({ emailVerified: verified })
    .where(and(eq(users.id, userId), ne(users.emailVerified, verified)))
    .returning({ id: users.id });
  return rows.length > 0;
}

/** 取一个账号的邮箱，用于操作前的自我/管理员保护判定。 */
export async function getUserEmailById(userId: string): Promise<string | null> {
  const rows = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return rows[0]?.email ?? null;
}
