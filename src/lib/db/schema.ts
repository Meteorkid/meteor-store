import { pgTable, text, integer, boolean } from 'drizzle-orm/pg-core';

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),                        // MS{timestamp}{random}
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

export const feedbacks = pgTable('feedbacks', {
  id: text('id').primaryKey(),                        // FB{timestamp}{random}
  email: text('email'),                               // 可选
  type: text('type').notNull(),                       // bug | feature | question | other
  content: text('content').notNull(),
  createdAt: text('created_at').notNull(),
});
