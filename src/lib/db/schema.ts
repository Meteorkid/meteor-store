import { pgTable, text, integer, boolean, primaryKey, index } from 'drizzle-orm/pg-core';

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),                        // crypto.randomUUID()
  productId: text('product_id').notNull(),             // 'omnicrawl'
  planName: text('plan_name').notNull(),               // 'Starter'
  email: text('email').notNull(),
  amountCny: integer('amount_cny').notNull(),          // 199（元）
  paymentMethod: text('payment_method').notNull(),     // 'alipay' | 'wechat'
  status: text('status').default('pending').notNull(), // pending | paid | failed | refunded
  alipayTradeNo: text('alipay_trade_no'),              // 支付宝交易号
  paidAt: text('paid_at'),                             // ISO 时间
  billingPeriod: text('billing_period').default('monthly').notNull(), // monthly | annual
  deliveryStatus: text('delivery_status').default('pending').notNull(), // pending | emailed | failed
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
  emailVerified: boolean('email_verified').default(false).notNull(),
  isStudent: boolean('is_student').default(false).notNull(),
  createdAt: text('created_at').notNull(),
});

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

export const feedbacks = pgTable('feedbacks', {
  id: text('id').primaryKey(),                        // FB{timestamp}{random}
  email: text('email'),                               // 可选
  type: text('type').notNull(),                       // bug | feature | question | other
  content: text('content').notNull(),
  createdAt: text('created_at').notNull(),
});

export const inviteCodes = pgTable('invite_codes', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  productId: text('product_id').notNull(),
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
]);
