import { sql } from 'drizzle-orm';
import { pgTable, text, integer, bigint, boolean, primaryKey, index, uniqueIndex, check } from 'drizzle-orm/pg-core';

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),                        // crypto.randomUUID()
  productId: text('product_id').notNull(),             // 'omnicrawl'
  planName: text('plan_name').notNull(),               // 'Starter'
  email: text('email').notNull(),
  /** 下单时的登录用户 id。可为空（游客直接填邮箱下单）。有值时用于付费门控 / 授权查询。 */
  userId: text('user_id'),
  amountCny: integer('amount_cny').notNull(),          // 199（元）
  paymentMethod: text('payment_method').notNull(),     // 'alipay' | 'wechat'
  status: text('status').default('pending').notNull(), // pending | paid | failed | refunded
  alipayTradeNo: text('alipay_trade_no'),              // 支付宝交易号
  paidAt: text('paid_at'),                             // ISO 时间
  // 单品：monthly | annual；Meteor Pass 还会写入 lifetime（买断档）
  billingPeriod: text('billing_period').default('monthly').notNull(),
  deliveryStatus: text('delivery_status').default('pending').notNull(), // pending | processing | emailed | failed
  deliveryClaimedAt: text('delivery_claimed_at'),       // 原子交付认领时间；崩溃后允许超时重试
  accessToken: text('access_token').notNull(),  // 订单详情页访问凭证
  createdAt: text('created_at').notNull(),
});

export const licenseKeys = pgTable('license_keys', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().unique(),
  productId: text('product_id').notNull(),
  planName: text('plan_name').notNull(),
  email: text('email').notNull(),
  key: text('key').notNull().unique(),
  status: text('status').default('active').notNull(), // active | revoked
  createdAt: text('created_at').notNull(),
});

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  emailVerified: boolean('email_verified').default(false).notNull(),
  isStudent: boolean('is_student').default(false).notNull(),
  studentEmail: text('student_email').unique(),
  studentVerifiedAt: text('student_verified_at'),
  createdAt: text('created_at').notNull(),
  /**
   * Token 版本号，写入会话 JWT。改密等"踢掉其他会话"操作递增它，
   * getSession 比对 session 内的 tokenVersion 与数据库当前值，
   * 不一致即视为过期——所有旧设备上持有的 token 立即失效。
   */
  tokenVersion: integer('token_version').default(0).notNull(),
  /** 博客图片已预占或已上传的总字节数；由图片账本原子维护。 */
  blogImageBytes: bigint('blog_image_bytes', { mode: 'number' }).default(0).notNull(),
  /** TOTP 两步验证密文（AES-256-GCM，密钥优先由 TOTP_ENC_KEY 派生，见 lib/totp.ts）。 */
  totpSecretEnc: text('totp_secret_enc'),
  /** 两步验证是否已确认启用。未确认的 secret 只用于绑定流程，登录不挑战。 */
  totpEnabled: boolean('totp_enabled').default(false).notNull(),
  /** 恢复码 SHA-256 哈希数组（JSON 字符串）。明文只在生成时返回一次。 */
  totpRecoveryCodes: text('totp_recovery_codes'),
  /** 微信开放平台 openid（网站应用扫码登录绑定）。唯一：一个微信只能绑定一个账号。 */
  wechatOpenid: text('wechat_openid').unique(),
  /** 微信 unionid：同一开放平台账号下跨应用唯一，预留小程序/公众号打通。 */
  wechatUnionid: text('wechat_unionid').unique(),
}, (t) => [
  check('users_blog_image_bytes_non_negative', sql`${t.blogImageBytes} >= 0`),
]);

/**
 * 管理员操作审计日志。无外键——管理员注销后记录保留作留痕（全站约定）。
 * 只记元信息与简短摘要，不落敏感全文（密钥、密码、正文）。
 */
export const adminAuditLogs = pgTable('admin_audit_logs', {
  id: text('id').primaryKey(),
  adminId: text('admin_id').notNull(),
  adminEmail: text('admin_email').notNull(),   // 快照，便于后台直接阅读
  action: text('action').notNull(),            // 点分命名，如 post.approve / order.refund
  targetType: text('target_type'),             // post | comment | report | order | license | invite_code | announcement | feedback
  targetId: text('target_id'),
  detail: text('detail'),                      // JSON 摘要
  ip: text('ip'),
  createdAt: text('created_at').notNull(),
}, (t) => [
  index('admin_audit_logs_created_idx').on(t.createdAt),
  index('admin_audit_logs_admin_idx').on(t.adminId, t.createdAt),
]);

/**
 * 博客图片对象账本。
 *
 * allocating 不计入用户计数；reserved / ready 均计入。数据库与 R2 无法共享事务，
 * 因此保留中间态供上传补偿和对账脚本安全修复。
 */
export const blogImages = pgTable('blog_images', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  objectKey: text('object_key').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  status: text('status').notNull(), // allocating | reserved | ready
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  uploadedAt: text('uploaded_at'),
}, (t) => [
  check('blog_images_size_range', sql`${t.sizeBytes} between 1 and 5000000`),
  check('blog_images_status_valid', sql`${t.status} in ('allocating', 'reserved', 'ready')`),
  uniqueIndex('blog_images_object_key_idx').on(t.objectKey),
  index('blog_images_user_idx').on(t.userId),
  index('blog_images_status_updated_idx').on(t.status, t.updatedAt),
]);

/**
 * 博客个人访问令牌（PAT）。
 *
 * 完整令牌只在创建时返回一次，数据库仅保存 SHA-256。管理员身份不写入令牌，
 * 每次使用时都根据已验证用户邮箱与 ADMIN_EMAILS 动态计算。
 */
export const personalAccessTokens = pgTable('personal_access_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  tokenHash: text('token_hash').notNull(),
  tokenPrefix: text('token_prefix').notNull(),
  scopes: text('scopes').array().notNull(),
  /** 创建令牌时的 users.token_version；改密或重置密码后旧令牌立即失效。 */
  tokenVersion: integer('token_version').notNull(),
  /** 1–10 的活跃槽位；撤销、过期或版本失效后释放为 null。 */
  slot: integer('slot'),
  expiresAt: text('expires_at').notNull(),
  lastUsedAt: text('last_used_at'),
  revokedAt: text('revoked_at'),
  createdAt: text('created_at').notNull(),
}, (t) => [
  check('personal_access_tokens_slot_range', sql`${t.slot} is null or ${t.slot} between 1 and 10`),
  uniqueIndex('personal_access_tokens_hash_idx').on(t.tokenHash),
  uniqueIndex('personal_access_tokens_user_slot_idx').on(t.userId, t.slot),
  index('personal_access_tokens_user_created_idx').on(t.userId, t.createdAt),
]);

/**
 * 读者提交的话题提议（半开放模式）。
 * 只做收件箱：提议不公开展示，由店主审核后自己撰写并发布成文章，
 * 因此站点不产生公开 UGC。
 */
export const topicProposals = pgTable('topic_proposals', {
  id: text('id').primaryKey(),
  sectionId: text('section_id').notNull(),             // 对应 blog-sections 里的分区 id
  title: text('title').notNull(),
  pitch: text('pitch').notNull(),                      // 为什么值得写
  submitterEmail: text('submitter_email'),             // 可选，被采用时告知
  status: text('status').default('pending').notNull(), // pending | accepted | rejected
  createdAt: text('created_at').notNull(),
});

/**
 * 用户投稿的文章。
 *
 * 站主自己的文章仍走 content/blog/*.md（有版本历史、可 diff、可离线写）；
 * 用户投稿必须进数据库——不可能让用户往仓库里提交文件。两条来源在读取层合并。
 *
 * 状态机：draft →（提交）→ pending →（审核）→ published / rejected
 * 采用先审后发：pending 不公开可见，published 才进博客列表与 RSS。
 */
export const posts = pgTable('posts', {
  id: text('id').primaryKey(),                        // 同时用作 URL：/blog/p/{id}
  authorId: text('author_id').notNull(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),                 // Markdown 原文，渲染时才转 HTML
  sectionId: text('section_id').notNull(),            // 对应 blog-sections 的分区 id
  status: text('status').default('draft').notNull(),  // draft | pending | published | rejected
  reviewNote: text('review_note'),                    // 驳回理由，作者可见
  reviewerId: text('reviewer_id'),                    // 审核留痕
  reviewedAt: text('reviewed_at'),
  eventDate: text('event_date'),                      // 内容描述事件的时间，YYYY-MM-DD，可空
  locale: text('locale').default('zh').notNull(),   // zh | en，投稿语言版本
  publishedAt: text('published_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (t) => [
  // 审核队列：按状态筛，按提交时间排
  index('posts_status_created_idx').on(t.status, t.createdAt),
  // 「我的投稿」
  index('posts_author_idx').on(t.authorId),
  // 博客列表：只取已发布的，按发布时间倒序
  index('posts_published_idx').on(t.publishedAt),
]);

/**
 * 文章与标签的关联。
 *
 * 用关联表而不是在 posts 上存 JSON 数组：标签数会涨到成百上千，
 * 统计热度需要一次 GROUP BY，存 JSON 就得把全部文章拉出来在内存里算。
 */
export const postTags = pgTable('post_tags', {
  postId: text('post_id').notNull(),
  tag: text('tag').notNull(),       // 归一化后的键（小写去空格），用于匹配与聚合
  label: text('label').notNull(),   // 展示用的原始写法
}, (t) => [
  primaryKey({ columns: [t.postId, t.tag] }),
  // 标签页与热度统计都从 tag 侧查
  index('post_tags_tag_idx').on(t.tag),
]);

/**
 * 文章与分区的关联（多对多）。
 *
 * 一篇文章可以同时属于多个分区（跨区出现）。posts.section_id 保留为主分区，
 * 用于 RSS / JSON-LD / sitemap / 面包屑这些必须选唯一分区的场景；这张表存
 * 全部所属分区。复用 postTags 的关联表模式：分区数固定且很少，用关联表
 * 便于按分区索引、统计每个分区多少篇。
 */
export const postSections = pgTable('post_sections', {
  postId: text('post_id').notNull(),
  sectionId: text('section_id').notNull(),   // 对应 blog-sections 的分区 id
}, (t) => [
  primaryKey({ columns: [t.postId, t.sectionId] }),
  // 分区页 / 分区计数都从 section 侧查
  index('post_sections_section_idx').on(t.sectionId),
]);

export const feedbacks = pgTable('feedbacks', {
  id: text('id').primaryKey(),                        // FB{timestamp}{random}
  email: text('email'),                               // 可选
  type: text('type').notNull(),                       // bug | feature | question | other
  content: text('content').notNull(),
  status: text('status').default('pending').notNull(), // pending | resolved | dismissed
  resolverId: text('resolver_id'),
  resolvedAt: text('resolved_at'),
  createdAt: text('created_at').notNull(),
});

/**
 * 站主公告。前台铃铛（NotificationBell）读取，后台 /admin/announcements 管理。
 * 双语字段可空，前端按当前语言取，缺失时回退到另一语言。
 */
export const announcements = pgTable('announcements', {
  id: text('id').primaryKey(),                        // crypto.randomUUID()
  titleZh: text('title_zh'),
  titleEn: text('title_en'),
  bodyZh: text('body_zh'),
  bodyEn: text('body_en'),
  published: boolean('published').default(false).notNull(),
  publishedAt: text('published_at'),                  // ISO 时间；发布时写入
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (t) => [
  // 公开接口：只取已发布，按发布时间倒序
  index('announcements_published_idx').on(t.published, t.publishedAt),
]);

export const inviteCodes = pgTable('invite_codes', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  productId: text('product_id').notNull(),
  planId: text('plan_id').notNull(),
  planName: text('plan_name').notNull(),
  maxUses: integer('max_uses').default(1).notNull(),
  usedCount: integer('used_count').default(0).notNull(),
  memo: text('memo'),
  expiresAt: text('expires_at'),
  createdBy: text('created_by').notNull(),
  status: text('status').default('active').notNull(), // active | exhausted | revoked
  createdAt: text('created_at').notNull(),
});

export const inviteRedemptions = pgTable('invite_redemptions', {
  id: text('id').primaryKey(),
  inviteCodeId: text('invite_code_id').notNull(),
  userId: text('user_id').notNull(),
  licenseKey: text('license_key').notNull(),
  redeemedAt: text('redeemed_at').notNull(),
}, (t) => [
  index('invite_redemptions_code_idx').on(t.inviteCodeId),
  index('invite_redemptions_user_idx').on(t.userId),
  // 同一用户对同一邀请码只能兑换一次：DB 层的并发保证，
  // 覆盖应用层 select-then-insert 之间的竞态窗口
  uniqueIndex('invite_redemptions_code_user_uniq').on(t.inviteCodeId, t.userId),
]);

export const comments = pgTable('comments', {
  id: text('id').primaryKey(),
  targetId: text('target_id').notNull(),
  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull(),
  authorAvatar: text('author_avatar'),
  content: text('content').notNull(),
  parentId: text('parent_id'),
  status: text('status').default('approved').notNull(), // approved | pending | rejected
  reviewedAt: text('reviewed_at'),
  createdAt: text('created_at').notNull(),
}, (t) => [
  index('comments_target_idx').on(t.targetId, t.createdAt),
  index('comments_author_idx').on(t.authorId),
  // 管理员列表按 status 过滤 + createdAt 排序，复合索引一次覆盖两者
  index('comments_status_created_idx').on(t.status, t.createdAt),
]);

/**
 * 页面浏览量。用 IP 哈希 + 目标 ID 做简单去重，避免同一用户反复刷量。
 * 唯一约束 (target_id, ip_hash) 防止重复记录，365 天后可清理。
 */
export const pageViews = pgTable('page_views', {
  id: text('id').primaryKey(),
  targetId: text('target_id').notNull(),
  ipHash: text('ip_hash').notNull(),
  createdAt: text('created_at').notNull(),
}, (t) => [
  uniqueIndex('page_views_target_ip_uniq').on(t.targetId, t.ipHash),
  index('page_views_target_idx').on(t.targetId),
]);

/**
 * 点赞。每个用户对每个目标只能点赞一次，再点取消。
 */
export const likes = pgTable('likes', {
  targetId: text('target_id').notNull(),
  userId: text('user_id').notNull(),
  createdAt: text('created_at').notNull(),
}, (t) => [
  primaryKey({ columns: [t.targetId, t.userId] }),
  index('likes_target_idx').on(t.targetId),
]);

/**
 * 文章收藏。每个用户对每篇文章只能收藏一次，再点取消。
 * targetId 复用 views/likes 的约定：文件文章用 slug，数据库投稿用 post.id。
 * 用户索引用于「我的收藏」列表查询。
 */
export const postFavorites = pgTable('post_favorites', {
  targetId: text('target_id').notNull(),
  userId: text('user_id').notNull(),
  createdAt: text('created_at').notNull(),
}, (t) => [
  primaryKey({ columns: [t.targetId, t.userId] }),
  index('post_favorites_target_idx').on(t.targetId),
  index('post_favorites_user_idx').on(t.userId),
]);

/**
 * UGC 举报记录。覆盖评论与读者投稿两种内容。
 *
 * 不加外键（与全站其它表保持一致：comments / likes / favorites 都没有外键到 posts / users）。
 * 注销用户或下架文章后举报记录保留作为留痕,管理员页只读不删。
 *
 * 状态机：pending →（管理员处理）→ resolved（采纳,通常会再删/驳被举报内容）/ dismissed（驳回）
 */
/**
 * Pass 到期提醒记录。按 (email, expiresAt) 去重：同一用户对同一个到期日
 * 只发一次提醒，续费后到期日顺延才会有新的提醒。这张表让到期提醒是幂等的，
 * 定时任务无论跑多频繁都不会重复骚扰用户。
 */
export const passReminders = pgTable('pass_reminders', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  /** 到期日（ISO）；用户续费后到期日变化，才允许对新到期日再发一次 */
  expiresAt: text('expires_at').notNull(),
  sentAt: text('sent_at').notNull(),
}, (t) => [
  uniqueIndex('pass_reminders_email_expiry_idx').on(t.email, t.expiresAt),
  index('pass_reminders_email_idx').on(t.email),
]);

export const reports = pgTable('reports', {
  id: text('id').primaryKey(),
  /** 'comment' = 评论；'post' = 读者投稿（数据库文章） */
  targetType: text('target_type').notNull(), // comment | post
  /** 评论 ID 或 posts.id */
  targetId: text('target_id').notNull(),
  reporterId: text('reporter_id').notNull(),
  /** 预设原因：spam / abuse / nsfw / illegal / other */
  reason: text('reason').notNull(),
  /** 详细描述（可选，最长 500 字） */
  detail: text('detail'),
  status: text('status').default('pending').notNull(), // pending | resolved | dismissed
  resolverId: text('resolver_id'),
  resolvedAt: text('resolved_at'),
  createdAt: text('created_at').notNull(),
}, (t) => [
  // 管理员列表按 status 过滤 + createdAt 排序，复合索引一次覆盖两者
  index('reports_status_created_idx').on(t.status, t.createdAt),
  index('reports_target_idx').on(t.targetType, t.targetId),
  index('reports_reporter_idx').on(t.reporterId),
]);
