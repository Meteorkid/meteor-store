import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { createAlipayOrder, createAlipayMobileOrder } from '@/lib/alipay';
import { findProduct } from '@/lib/products';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';

// 年付折扣率，与 PricingSection 保持一致
const ANNUAL_DISCOUNT = 0.8;

// 创建支付订单
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName, planName, paymentMethod, email, isMobile, isAnnual } = body;

    // 验证参数
    if (!productName || !planName || !paymentMethod || !email) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

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

    // 计算实际价格：年付时应用折扣
    const basePrice = tier.price;
    const priceCNY = isAnnual ? Math.floor(basePrice * ANNUAL_DISCOUNT) : basePrice;
    const now = new Date().toISOString();

    // 免费产品直接创建订单并返回成功
    if (priceCNY === 0) {
      const orderId = generateOrderId();
      await db.insert(orders).values({
        id: orderId,
        productId: productName,
        planName,
        email,
        amountCny: 0,
        paymentMethod: 'free',
        status: 'paid',
        paidAt: now,
        createdAt: now,
      });
      return NextResponse.json({
        success: true,
        orderId,
        amount: 0,
        message: '免费产品获取成功',
      });
    }

    // 生成订单号
    const orderId = generateOrderId();

    // 写入数据库
    await db.insert(orders).values({
      id: orderId,
      productId: productName,
      planName,
      email,
      amountCny: priceCNY,
      paymentMethod,
      createdAt: now,
    });

    // 创建支付宝订单
    const subject = `${product.name} - ${planName}`;
    const body_text = `购买 ${product.name} 的 ${planName} 方案`;

    const payUrl = isMobile
      ? await createAlipayMobileOrder({ orderId, amount: priceCNY, subject, body: body_text })
      : await createAlipayOrder({ orderId, amount: priceCNY, subject, body: body_text });

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

// 查询支付状态
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json(
      { error: '缺少订单号' },
      { status: 400 }
    );
  }

  const order = await db.select().from(orders).where(eq(orders.id, orderId)).get();

  if (!order) {
    return NextResponse.json(
      { error: '订单不存在' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    orderId: order.id,
    status: order.status,
    productId: order.productId,
    planName: order.planName,
    amount: order.amountCny,
    paidAt: order.paidAt,
  });
}

function generateOrderId(): string {
  return `MS${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}
