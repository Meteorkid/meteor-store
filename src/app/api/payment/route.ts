import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { createAlipayOrder, createAlipayMobileOrder } from '@/lib/alipay';
import { findProduct } from '@/lib/products';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { ANNUAL_DISCOUNT, SHOW_PRICING } from '@/lib/constants';

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
  planName: z.string().min(1).max(100),
  paymentMethod: z.literal('alipay'),
  email: z.string().email().max(254),
  isMobile: z.boolean().optional(),
  isAnnual: z.boolean().optional(),
});

// 创建支付订单
export async function POST(request: NextRequest) {
  // ICP 备案期间暂停销售
  if (!SHOW_PRICING) {
    return NextResponse.json({ error: '销售暂停中，敬请期待' }, { status: 503 });
  }

  // 速率限制：每 IP 每分钟最多 10 次
  const ip = getClientIp(request);
  const { limited } = rateLimit(`payment:${ip}`, 10, 60_000);
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

    const { productName, planName, email, isMobile, isAnnual } = parsed.data;

    // 从产品目录查找（单次查找，避免冗余）
    const product = findProduct(productName);
    if (!product) {
      return NextResponse.json(
        { error: '产品不存在' },
        { status: 400 }
      );
    }

    const tier = product.pricing.find(
      (t) => t.name.toLowerCase() === planName.toLowerCase()
    );
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
    const basePrice = tier.price;
    const priceCNY = validAnnual
      ? Math.floor(basePrice * ANNUAL_DISCOUNT * 12)
      : basePrice;
    const billingPeriod = validAnnual ? 'annual' : 'monthly';

    // 免费产品直接创建订单并返回成功
    if (priceCNY === 0) {
      const orderId = await generateOrderId();
      const now = new Date().toISOString();
      const accessToken = crypto.randomUUID();
      await db.insert(orders).values({
        id: orderId,
        productId: productName,
        planName,
        email,
        amountCny: 0,
        paymentMethod: 'free',
        status: 'paid',
        paidAt: now,
        billingPeriod: validAnnual ? 'annual' : 'monthly',
        accessToken,
        createdAt: now,
      });

      // 免费产品也需要生成 license key 和发送确认邮件
      try {
        const { createLicenseKey } = await import('@/lib/license');
        const { sendOrderConfirmation } = await import('@/lib/email');
        const licenseKey = await createLicenseKey({
          orderId,
          productId: productName,
          planName,
          email,
        });
        await sendOrderConfirmation({
          email,
          orderId,
          productId: productName,
          planName,
          amount: 0,
          licenseKey,
          accessToken,
        });
        await db.update(orders)
          .set({ deliveryStatus: 'emailed' })
          .where(eq(orders.id, orderId));
      } catch (err) {
        console.error('Free order delivery failed:', err);
        await db.update(orders)
          .set({ deliveryStatus: 'failed' })
          .where(eq(orders.id, orderId));
      }

      return NextResponse.json({
        success: true,
        orderId,
        amount: 0,
        message: '免费产品获取成功',
      });
    }

    // 先生成订单号，用于支付宝回调关联
    const orderId = crypto.randomUUID();
    const now = new Date().toISOString();
    const accessToken = crypto.randomUUID();

    // 先写数据库（pending 状态），再调支付宝，避免用户付款后无订单记录
    await db.insert(orders).values({
      id: orderId,
      productId: productName,
      planName,
      email,
      amountCny: priceCNY,
      paymentMethod: 'alipay',
      status: 'pending',
      billingPeriod,
      accessToken,
      createdAt: now,
    });

    // 再创建支付宝订单
    const subject = `${product.name} - ${planName}`;
    const body_text = `购买 ${product.name} 的 ${planName} 方案`;

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
  const { limited } = rateLimit(`payment-get:${ip}`, 20, 60_000);
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
    const uuidPattern = /^[0-9a-f-]{36}$/i;
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
