import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { createAlipayOrder, createAlipayMobileOrder } from '@/lib/alipay';
import { findProduct } from '@/lib/products';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { ANNUAL_DISCOUNT, SHOW_PRICING } from '@/lib/constants';

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
      const orderId = crypto.randomUUID();
      const now = new Date().toISOString();
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
        accessToken: crypto.randomUUID(),
        createdAt: now,
      });
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

    // 先创建支付宝订单，成功后再写库（避免孤儿 pending 订单）
    const subject = `${product.name} - ${planName}`;
    const body_text = `购买 ${product.name} 的 ${planName} 方案`;

    let payUrl: string;
    try {
      payUrl = isMobile
        ? await createAlipayMobileOrder({ orderId, amount: priceCNY, subject, body: body_text })
        : await createAlipayOrder({ orderId, amount: priceCNY, subject, body: body_text });
    } catch (err) {
      console.error('Alipay SDK error:', err);
      return NextResponse.json(
        { error: '支付渠道创建失败，请稍后重试' },
        { status: 502 }
      );
    }

    // 支付宝订单创建成功，写入数据库
    await db.insert(orders).values({
      id: orderId,
      productId: productName,
      planName,
      email,
      amountCny: priceCNY,
      paymentMethod: 'alipay',
      status: 'pending',
      billingPeriod,
      accessToken: crypto.randomUUID(),
      createdAt: now,
    });

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

// 查询支付状态（仅返回脱敏信息）
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

    if (!orderId) {
      return NextResponse.json(
        { error: '缺少订单号' },
        { status: 400 }
      );
    }

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);

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
