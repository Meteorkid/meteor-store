import { sql } from 'drizzle-orm';
import { pgTable, text, integer, bigint, boolean, numeric, primaryKey, index, uniqueIndex, check } from 'drizzle-orm/pg-core';

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),                        // crypto.randomUUID()
  productId: text('product_id').notNull(),             // 'omnicrawl'
  planName: text('plan_name').notNull(),               // 'Starter'
  /** 产品目录里的稳定套餐 id；历史订单可为空，读取端按 planName 兼容。 */
  planId: text('plan_id'),
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
}, (t) => [
  // 授权判定的热查询：status='paid' AND (user_id=? OR email=?)。
  // 两条 OR 分支各走一个索引（BitmapOr），status 作尾列让命中行直接可用。
  // 这条在 /apps/[id]、/apps、/account、/orders 每次渲染都跑。
  index('orders_user_status_idx').on(t.userId, t.status),
  index('orders_email_status_idx').on(t.email, t.status),
]);

export const licenseKeys = pgTable('license_keys', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().unique(),
  productId: text('product_id').notNull(),
  planName: text('plan_name').notNull(),
  email: text('email').notNull(),
  key: text('key').notNull().unique(),
  status: text('status').default('active').notNull(), // active | revoked
  createdAt: text('created_at').notNull(),
}, (t) => [
  // /account 页按邮箱列出历史授权码并按时间倒序；尾列覆盖排序，免去 sort 步骤。
  // order_id 与 key 已有 unique 约束，隐式索引够用，不再另建。
  index('license_keys_email_created_idx').on(t.email, t.createdAt),
]);

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

/** Tollow 每本书只保留一个最新阅读位置；updatedAt 用于本地与远端冲突合并。 */
export const tollowBookProgress = pgTable('tollow_book_progress', {
  userId: text('user_id').notNull(),
  bookId: text('book_id').notNull(),
  sectionId: text('section_id').notNull(),
  segmentIndex: integer('segment_index').notNull(),
  offset: integer('offset').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (t) => [
  primaryKey({ columns: [t.userId, t.bookId] }),
  check('tollow_book_progress_position_non_negative', sql`${t.segmentIndex} >= 0 and ${t.offset} >= 0`),
]);

/** Tollow 练习历史；客户端记录 ID 与用户组合成幂等键。 */
export const tollowPracticeSessions = pgTable('tollow_practice_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  clientRecordId: text('client_record_id').notNull(),
  bookId: text('book_id'),
  bookTitle: text('book_title').notNull(),
  startedAt: text('started_at').notNull(),
  endedAt: text('ended_at').notNull(),
  durationMs: integer('duration_ms').notNull(),
  wordsTyped: integer('words_typed').notNull(),
  wpm: numeric('wpm', { precision: 8, scale: 2, mode: 'number' }).notNull(),
  accuracy: numeric('accuracy', { precision: 5, scale: 2, mode: 'number' }).notNull(),
  errorCount: integer('error_count').notNull(),
  createdAt: text('created_at').notNull(),
}, (t) => [
  uniqueIndex('tollow_sessions_user_client_uniq').on(t.userId, t.clientRecordId),
  index('tollow_sessions_user_started_idx').on(t.userId, t.startedAt),
  check('tollow_sessions_metrics_non_negative', sql`${t.durationMs} >= 0 and ${t.wordsTyped} >= 0 and ${t.wpm} >= 0 and ${t.errorCount} >= 0`),
  check('tollow_sessions_accuracy_range', sql`${t.accuracy} between 0 and 100`),
]);

/** Tollow 私人文本收藏；原文和来源使用快照，书籍变更后仍可查看。 */
export const tollowTextFavorites = pgTable('tollow_text_favorites', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  clientRecordId: text('client_record_id').notNull(),
  bookId: text('book_id'),
  bookTitle: text('book_title').notNull(),
  sectionId: text('section_id'),
  sectionTitle: text('section_title'),
  segmentIndex: integer('segment_index'),
  startOffset: integer('start_offset').notNull(),
  endOffset: integer('end_offset').notNull(),
  quote: text('quote').notNull(),
  note: text('note'),
  tags: text('tags').array().default(sql`ARRAY[]::text[]`).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (t) => [
  uniqueIndex('tollow_favorites_user_client_uniq').on(t.userId, t.clientRecordId),
  index('tollow_favorites_user_updated_idx').on(t.userId, t.updatedAt),
  index('tollow_favorites_user_book_idx').on(t.userId, t.bookId),
  check('tollow_favorites_offsets_valid', sql`${t.startOffset} >= 0 and ${t.endOffset} >= ${t.startOffset}`),
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

/**
 * Pathfinder 可信目录的来源配置。
 *
 * 来源只允许由仓库配置或管理员创建；公开请求不能传入任意 URL。
 * 不加外键，保持项目现有的弱耦合数据约定。
 */
export const pathfinderSources = pgTable('pathfinder_sources', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  adapter: text('adapter').notNull(), // manual | github | rss | atom | greenhouse
  siteUrl: text('site_url').notNull(),
  sourceType: text('source_type').notNull(), // manual | api | rss | atom | html
  trustLevel: text('trust_level').notNull(), // official | verified
  enabled: boolean('enabled').default(false).notNull(),
  autoPublish: boolean('auto_publish').default(false).notNull(),
  syncIntervalMinutes: integer('sync_interval_minutes').default(1440).notNull(),
  etag: text('etag'),
  lastModified: text('last_modified'),
  cursor: text('cursor'),
  lastSuccessAt: text('last_success_at'),
  lastError: text('last_error'),
  consecutiveFailures: integer('consecutive_failures').default(0).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (t) => [
  uniqueIndex('pathfinder_sources_site_url_uniq').on(t.siteUrl),
  index('pathfinder_sources_enabled_idx').on(t.enabled, t.updatedAt),
  check('pathfinder_sources_adapter_valid', sql`${t.adapter} in ('manual', 'github', 'rss', 'atom', 'greenhouse')`),
  check('pathfinder_sources_type_valid', sql`${t.sourceType} in ('manual', 'api', 'rss', 'atom', 'html')`),
  check('pathfinder_sources_trust_valid', sql`${t.trustLevel} in ('official', 'verified')`),
  check('pathfinder_sources_sync_interval_positive', sql`${t.syncIntervalMinutes} > 0`),
  check('pathfinder_sources_failures_non_negative', sql`${t.consecutiveFailures} >= 0`),
]);

/**
 * Pathfinder 规范化目录条目。正文仍留在原站，只保存事实字段、原创短摘要与来源链接。
 * 状态机：pending → published / rejected，已发布条目可转 archived / stale / expired。
 */
export const pathfinderItems = pgTable('pathfinder_items', {
  id: text('id').primaryKey(),
  sourceId: text('source_id').notNull(),
  externalId: text('external_id').notNull(),
  canonicalUrl: text('canonical_url').notNull(),
  urlHash: text('url_hash').notNull(),
  itemType: text('item_type').notNull(), // open-source | competition | internship | ai-update
  titleZh: text('title_zh').notNull(),
  titleEn: text('title_en').notNull(),
  summaryZh: text('summary_zh').notNull(),
  summaryEn: text('summary_en').notNull(),
  /** 旧 organization 列保留为中文/默认值；英文名独立保存，避免英文页回退成中文。 */
  organization: text('organization').notNull(),
  organizationEn: text('organization_en').notNull(),
  direction: text('direction').notNull(), // ai | frontend | backend | data
  /** JSON 字符串；direction 仍是主方向和旧读取端兼容字段。 */
  directions: text('directions').default('[]').notNull(),
  difficulty: text('difficulty').notNull(), // beginner | intermediate | advanced | all
  estimatedMinutes: integer('estimated_minutes'),
  costCny: integer('cost_cny'),
  costAmount: numeric('cost_amount', { precision: 14, scale: 2, mode: 'number' }),
  costCurrency: text('cost_currency'),
  costLabelZh: text('cost_label_zh'),
  costLabelEn: text('cost_label_en'),
  device: text('device').notNull(), // phone | computer | either
  network: text('network').notNull(), // low | normal | high
  region: text('region'),
  regionZh: text('region_zh'),
  regionEn: text('region_en'),
  remoteStatus: text('remote_status').notNull(), // remote | onsite | hybrid | unspecified
  eligibilityZh: text('eligibility_zh').notNull(),
  eligibilityEn: text('eligibility_en').notNull(),
  deadlineText: text('deadline_text'),
  deadlineTextZh: text('deadline_text_zh'),
  deadlineTextEn: text('deadline_text_en'),
  /** 官方只给日期时保存 YYYY-MM-DD，不根据部署时区伪造截止时刻。 */
  deadlineDate: text('deadline_date'),
  deadlineAt: text('deadline_at'),
  publishedAt: text('published_at'),
  discoveredAt: text('discovered_at').notNull(),
  verifiedAt: text('verified_at').notNull(),
  status: text('status').default('pending').notNull(),
  learningEligible: boolean('learning_eligible').default(false).notNull(),
  /** 自动推断的资格条件必须经人工核验，路径生成器据此采取保守策略。 */
  requiresManualEligibilityCheck: boolean('requires_manual_eligibility_check').default(false).notNull(),
  reviewerId: text('reviewer_id'),
  reviewedAt: text('reviewed_at'),
  contentHash: text('content_hash').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (t) => [
  uniqueIndex('pathfinder_items_source_external_uniq').on(t.sourceId, t.externalId),
  uniqueIndex('pathfinder_items_url_hash_uniq').on(t.urlHash),
  index('pathfinder_items_source_idx').on(t.sourceId),
  index('pathfinder_items_status_type_idx').on(t.status, t.itemType),
  index('pathfinder_items_status_direction_idx').on(t.status, t.direction),
  index('pathfinder_items_status_deadline_idx').on(t.status, t.deadlineAt),
  index('pathfinder_items_status_learning_idx').on(t.status, t.learningEligible),
  check('pathfinder_items_type_valid', sql`${t.itemType} in ('open-source', 'competition', 'internship', 'ai-update')`),
  check('pathfinder_items_direction_valid', sql`${t.direction} in ('ai', 'frontend', 'backend', 'data')`),
  check('pathfinder_items_difficulty_valid', sql`${t.difficulty} in ('beginner', 'intermediate', 'advanced', 'all')`),
  check('pathfinder_items_device_valid', sql`${t.device} in ('phone', 'computer', 'either')`),
  check('pathfinder_items_network_valid', sql`${t.network} in ('low', 'normal', 'high')`),
  check('pathfinder_items_remote_valid', sql`${t.remoteStatus} in ('remote', 'onsite', 'hybrid', 'unspecified')`),
  check('pathfinder_items_status_valid', sql`${t.status} in ('pending', 'published', 'rejected', 'archived', 'stale', 'expired')`),
  check('pathfinder_items_minutes_positive', sql`${t.estimatedMinutes} is null or ${t.estimatedMinutes} > 0`),
  check('pathfinder_items_cost_non_negative', sql`${t.costCny} is null or ${t.costCny} >= 0`),
  check('pathfinder_items_cost_amount_non_negative', sql`${t.costAmount} is null or ${t.costAmount} >= 0`),
  check('pathfinder_items_cost_currency_valid', sql`${t.costCurrency} is null or ${t.costCurrency} ~ '^[A-Z]{3}$'`),
  check('pathfinder_items_deadline_date_valid', sql`${t.deadlineDate} is null or ${t.deadlineDate} ~ '^\\d{4}-\\d{2}-\\d{2}$'`),
]);

/**
 * Pathfinder 收藏。
 *
 * 与博客收藏（post_favorites）同构：复合主键天然防重复收藏，全站不加外键，
 * 条目下架后收藏记录保留、列表里自然筛不到。`remindDeadline` 让用户对单条
 * 关掉截止提醒而不必取消收藏——收藏是「我以后要看」，提醒是「到点叫我」，
 * 把两件事绑死会逼人用取消收藏来关掉通知。
 */
export const pathfinderSaves = pgTable('pathfinder_saves', {
  itemId: text('item_id').notNull(),
  userId: text('user_id').notNull(),
  createdAt: text('created_at').notNull(),
  remindDeadline: boolean('remind_deadline').default(true).notNull(),
}, (t) => [
  primaryKey({ columns: [t.itemId, t.userId] }),
  index('pathfinder_saves_user_idx').on(t.userId),
  index('pathfinder_saves_item_idx').on(t.itemId),
]);

/**
 * Pathfinder 关注：机构或主题。
 *
 * `kind` 只有 organization / topic 两种，`value` 存归一化（小写、去空格）后的值，
 * 展示用的原始写法由条目自己带。归一化放在写入前而不是查询时，
 * 否则「OpenAI」和「openai」会变成两条关注。
 */
export const pathfinderFollows = pgTable('pathfinder_follows', {
  userId: text('user_id').notNull(),
  kind: text('kind').notNull(), // organization | topic
  value: text('value').notNull(),
  createdAt: text('created_at').notNull(),
}, (t) => [
  primaryKey({ columns: [t.userId, t.kind, t.value] }),
  index('pathfinder_follows_kind_value_idx').on(t.kind, t.value),
  check('pathfinder_follows_kind_valid', sql`${t.kind} in ('organization', 'topic')`),
]);

/**
 * 截止提醒的发送记录，用于幂等。
 *
 * 与 pass_reminders 同样的思路：按 (user_id, item_id, deadline) 唯一去重，
 * 同一个截止时间只提醒一次；官方改期后 deadline 变化，才允许对新日期再发一次。
 */
export const pathfinderDeadlineReminders = pgTable('pathfinder_deadline_reminders', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  itemId: text('item_id').notNull(),
  /** 提醒时条目的截止时间（ISO 或 YYYY-MM-DD），改期后可再提醒一次 */
  deadline: text('deadline').notNull(),
  sentAt: text('sent_at').notNull(),
}, (t) => [
  uniqueIndex('pathfinder_deadline_reminders_unique_idx').on(t.userId, t.itemId, t.deadline),
  index('pathfinder_deadline_reminders_user_idx').on(t.userId),
]);

/**
 * AI 动态的编辑型解读。
 *
 * 由 Claude 生成初稿，**必须经人工确认才会公开**（status 从 draft 变成 approved）。
 * 这是整张表最重要的约束：Pathfinder 唯一的差异化资产是「可追溯、不夸大」，
 * 自动发布模型产出等于把它交出去。渲染层只读 approved。
 *
 * 每条只对应一个条目（itemId 主键）：解读是对这条内容的说明，不是可以有多版的评论。
 * 重新生成会覆盖草稿，但**不会覆盖已确认的解读**——那是人看过并署名的东西。
 */
export const pathfinderItemNotes = pgTable('pathfinder_item_notes', {
  itemId: text('item_id').primaryKey(),
  /** draft = 模型初稿，未公开；approved = 人工确认，可公开 */
  status: text('status').notNull().default('draft'),
  /** 发生了什么 */
  whatHappened: text('what_happened').notNull(),
  /** 为什么值得大学生关注 */
  whyItMatters: text('why_it_matters').notNull(),
  /** 影响哪些技能，JSON 字符串数组 */
  skills: text('skills').notNull().default('[]'),
  /** 建议做什么 */
  suggestedAction: text('suggested_action').notNull(),
  /** 生成用的模型 id，便于日后判断哪批解读该重做 */
  model: text('model').notNull(),
  /** 提示词版本；改了提示词而不改这个值，就无法分辨解读出自哪一版 */
  promptVersion: text('prompt_version').notNull(),
  generatedAt: text('generated_at').notNull(),
  /** 人工是否改过正文——全站展示时据此区分「已确认」与「已编辑」 */
  editedByHuman: boolean('edited_by_human').notNull().default(false),
  reviewerId: text('reviewer_id'),
  reviewedAt: text('reviewed_at'),
}, (t) => [
  index('pathfinder_item_notes_status_idx').on(t.status),
  check('pathfinder_item_notes_status_valid', sql`${t.status} in ('draft', 'approved')`),
]);

/** Pathfinder 条目标签；拆表后可直接按维度与标签索引筛选。 */
export const pathfinderItemTags = pgTable('pathfinder_item_tags', {
  itemId: text('item_id').notNull(),
  dimension: text('dimension').notNull(), // topic | skill | career | format
  tag: text('tag').notNull(),
}, (t) => [
  primaryKey({ columns: [t.itemId, t.dimension, t.tag] }),
  index('pathfinder_item_tags_dimension_tag_idx').on(t.dimension, t.tag, t.itemId),
  check('pathfinder_item_tags_dimension_valid', sql`${t.dimension} in ('topic', 'skill', 'career', 'format')`),
]);
