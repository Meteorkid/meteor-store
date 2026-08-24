import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { createAlipayOrder, createAlipayMobileOrder, isAlipayConfigured } from '@/lib/alipay';
import { createWechatOrder, isWechatConfigured } from '@/lib/wechat';
import { findProduct } from '@/lib/products';
import { PASS_NAME, PASS_PRODUCT_ID, findPassPlan } from '@/data/pass';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { getSession } from '@/lib/auth';
import { ANNUAL_DISCOUNT, SHOW_PRICING } from '@/lib/constants';
import { assertMatchingOrigin } from '@/lib/csrf';

/**
 * 生成唯一订单 ID，带碰撞重试
 */
async function generateOrderId(maxRetries = 3): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    const orderId = crypto.randomUUID();
    // 检查是否已存在
    const [existing] = await db.select({ id: orders.id })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);
    if (!existing) return orderId;
    console.warn(`Order ID collision: ${orderId}, retry ${i + 1}/${maxRetries}`);
  }
  throw new Error('Failed to generate unique order ID after retries');
}

// Zod 校验 schema
const PaymentSchema = z.object({
  productName: z.string().min(1).max(100).regex(/^[a-zA-Z0-9-]+$/, 'productName must be a slug'),
  planId: z.string().min(1).max(100).regex(/^[a-zA-Z0-9-]+$/).optional(),
  planName: z.string().min(1).max(100),
  paymentMethod: z.literal('alipay').or(z.literal('wechat')),
  email: z.string().email().max(254),
  isMobile: z.boolean().optional(),
  isAnnual: z.boolean().optional(),
});

// 创建支付订单
export async function POST(request: NextRequest) {
  // CSRF 纵深防御：写接口必须来自本站 Origin
  const forbidden = assertMatchingOrigin(request);
  if (forbidden) return forbidden;

  // ICP 备案期间暂停销售
  if (!SHOW_PRICING) {
    return NextResponse.json({ error: '销售暂停中，敬请期待' }, { status: 503 });
  }

  // 速率限制：每 IP 每分钟最多 10 次（资金敏感接口，Redis 异常时 fail-closed）
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`payment:${ip}`, 10, 60_000, { failClosed: true });
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  try {
    const body = await request.json();

    // Zod 校验
    const parsed = PaymentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { productName, planId, planName, email, isMobile, isAnnual, paymentMethod } = parsed.data;

    // 售卖对象有两种：单个产品，或全站会员 Meteor Pass。
    // Pass 的三档本身就是计费周期（月付/年付/买断），价格是直接定的，
    // 因此**不套用** ANNUAL_DISCOUNT——客户端传来的 isAnnual 在这条分支里忽略。
    let priceCNY: number;
    let billingPeriod: string;
    let resolvedPlanId: string;
    let resolvedPlanName: string;
    let subjectName: string;

    if (productName === PASS_PRODUCT_ID) {
      const plan = findPassPlan(planId ?? planName);
      if (!plan) {
        return NextResponse.json({ error: '方案不存在' }, { status: 400 });
      }
      priceCNY = plan.price;
      billingPeriod = plan.id;
      resolvedPlanId = plan.id;
      resolvedPlanName = plan.name.zh;
      subjectName = PASS_NAME.zh;
    } else {
      // 从产品目录查找（单次查找，避免冗余）
      const product = findProduct(productName);
      if (!product) {
        return NextResponse.json(
          { error: '产品不存在' },
          { status: 400 }
        );
      }

      // 即将上架的产品暂不出售，任何档位都不能下单
      if (product.status === 'coming_soon') {
        return NextResponse.json(
          { error: '该产品即将上架，暂未开放' },
          { status: 400 }
        );
      }

      const tier = product.pricing.find((candidate) => (
        planId
          ? candidate.id === planId
          : candidate.name.zh.toLowerCase() === planName.toLowerCase()
      ));
      if (!tier) {
        return NextResponse.json(
          { error: '方案不存在' },
          { status: 400 }
        );
      }

      // 年付折扣仅适用于月付方案，买断和年付方案不适用
      const isMonthly = tier.period === '月';
      const validAnnual = isAnnual && isMonthly;

      // 计算实际价格：年付月付方案时应用折扣 × 12 个月
      priceCNY = validAnnual
        ? Math.floor(tier.price * ANNUAL_DISCOUNT * 12)
        : tier.price;
      billingPeriod = validAnnual
        ? 'annual'
        : tier.period === '买断'
          ? 'lifetime'
          : tier.period === '年'
            ? 'annual'
            : 'monthly';
      resolvedPlanId = tier.id;
      resolvedPlanName = tier.name.zh;
      subjectName = product.name.zh;
    }

    // 免费方案由产品页直接进入公开下载，不创建订单和授权码。
    // 这样既避免不可达的“免费订单成功但前端报错”分支，也不提供批量发码入口。
    if (priceCNY === 0) {
      return NextResponse.json({ error: '免费方案无需创建订单' }, { status: 400 });
    }

    // 创建支付、验签和商户核对缺一不可。必须在写入订单前拦截半配置状态，
    // 避免用户能付款但异步回调永远无法完成交付。
    if (paymentMethod === 'wechat') {
      if (!isWechatConfigured()) {
        return NextResponse.json({ error: '支付服务暂不可用' }, { status: 503 });
      }
    } else if (!isAlipayConfigured()) {
      return NextResponse.json({ error: '支付服务暂不可用' }, { status: 503 });
    }

    // 先生成订单号（带碰撞检查），用于回调关联
    const orderId = await generateOrderId();
    const now = new Date().toISOString();
    const accessToken = crypto.randomUUID();

    // 记录下单用户（登录则回填 userId，游客保持为空）。用于「我的产品」与付费门控。
    // 注意：若下单邮箱与登录邮箱不一致，仍以登录用户为准，避免他人在别人的订单上受益。
    const session = await getSession();

    // 先写数据库（pending 状态），再调支付渠道，避免用户付款后无订单记录
    await db.insert(orders).values({
      id: orderId,
      productId: productName,
      planName: resolvedPlanName,
      planId: resolvedPlanId,
      email,
      userId: session?.userId ?? null,
      amountCny: priceCNY,
      paymentMethod,
      status: 'pending',
      billingPeriod,
      accessToken,
      createdAt: now,
    });

    const subject = `${subjectName} - ${resolvedPlanName}`;
    const body_text = `购买 ${subjectName} 的 ${resolvedPlanName} 方案`;

    // 微信：桌面 Native 返回 codeUrl（前端渲染二维码），手机 H5 返回 h5Url（前端跳转拉起微信）
    if (paymentMethod === 'wechat') {
      try {
        const result = await createWechatOrder({
          orderId,
          amountCny: priceCNY,
          description: subject,
          clientIp: ip,
          channel: isMobile ? 'h5' : 'native',
        });
        return NextResponse.json({
          success: true,
          orderId,
          accessToken,
          paymentMethod,
          channel: isMobile ? 'h5' : 'native',
          ...result,
          amount: priceCNY,
          message: '订单创建成功',
        });
      } catch (err) {
        console.error('Wechat order create error:', err);
        await db.update(orders)
          .set({ status: 'failed' })
          .where(eq(orders.id, orderId));
        return NextResponse.json(
          { error: '支付渠道创建失败，请稍后重试' },
          { status: 502 }
        );
      }
    }

    // 支付宝：桌面 page.pay，手机 wap.pay，均返回可跳转的 payUrl
    let payUrl: string;
    try {
      payUrl = isMobile
        ? await createAlipayMobileOrder({ orderId, amount: priceCNY, subject, body: body_text })
        : await createAlipayOrder({ orderId, amount: priceCNY, subject, body: body_text });
    } catch (err) {
      console.error('Alipay SDK error:', err);
      // 支付宝创建失败，标记订单为 failed，避免孤儿 pending 订单
      await db.update(orders)
        .set({ status: 'failed' })
        .where(eq(orders.id, orderId));
      return NextResponse.json(
        { error: '支付渠道创建失败，请稍后重试' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId,
      accessToken,
      paymentMethod,
      payUrl,
      amount: priceCNY,
      message: '订单创建成功',
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: '支付创建失败' },
      { status: 500 }
    );
  }
}

// 查询支付状态（需要 accessToken 鉴权）
export async function GET(request: NextRequest) {
  // 速率限制：每 IP 每分钟最多 20 次
  const ip = getClientIp(request);
  const { limited } = await rateLimit(`payment-get:${ip}`, 20, 60_000);
  if (limited) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const token = searchParams.get('token');

    if (!orderId || !token) {
      return NextResponse.json(
        { error: '缺少订单号或访问令牌' },
        { status: 400 }
      );
    }

    // 校验 UUID 格式
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(orderId) || !uuidPattern.test(token)) {
      return NextResponse.json(
        { error: '参数格式无效' },
        { status: 400 }
      );
    }

    // 需同时匹配 orderId 和 accessToken，防止枚举
    const [order] = await db.select().from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.accessToken, token)))
      .limit(1);

    if (!order) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      );
    }

    // 仅返回最小状态信息，避免泄露订单详情
    return NextResponse.json({
      orderId: order.id,
      status: order.status,
    });
  } catch (error) {
    console.error('Payment query error:', error);
    return NextResponse.json(
      { error: '查询失败' },
      { status: 500 }
    );
  }
}
