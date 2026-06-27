import { NextRequest, NextResponse } from 'next/server';
import { createAlipayOrder, createAlipayMobileOrder } from '@/lib/alipay';

// 人民币价格映射
const PRICE_CNY_MAP: Record<string, number> = {
  // OmniCrawl
  'omnicrawl-starter': 199,
  'omnicrawl-pro': 549,
  'omnicrawl-enterprise': 1399,
  // Ex-Memory
  'ex-memory-basic': 59,
  'ex-memory-premium': 129,
  'ex-memory-ultimate': 269,
  // Skeleton Anatomy
  'skeleton-student': 129,
  'skeleton-professional': 349,
  'skeleton-institution': 1399,
  // UI Design System
  'uidesign-solo': 59,
  'uidesign-team': 199,
  'uidesign-enterprise': 689,
  // Statux
  'statux-pro': 59,
  // XIsland
  'xisland-pro': 79,
  // Tollow
  'tollow-pro': 99,
  // XNook
  'xnook-pro': 59,
  // Chakra Visualizer
  'chakra-premium': 35,
};

// 产品名称映射
const PRODUCT_NAME_MAP: Record<string, string> = {
  'omnicrawl': 'OmniCrawl 万能爬虫框架',
  'ex-memory': 'Ex-Memory 前任记忆智能体',
  'skeleton-anatomy': 'Skeleton Anatomy 3D 骨骼解剖平台',
  'ui-design-system': 'UI Design System AI Agent 设计系统',
  'statux': 'Statux CLI 状态栏工具',
  'xisland': 'XIsland macOS Dynamic Island',
  'tollow': 'Tollow 智能追踪工具',
  'xnook': 'XNook macOS 工具中心',
  'chakra-visualizer': 'Chakra Visualizer 手势忍术特效',
};

// 生成产品 ID
function generateProductId(productName: string, planName: string): string {
  const mapping: Record<string, Record<string, string>> = {
    'omnicrawl': {
      'starter': 'omnicrawl-starter',
      'pro': 'omnicrawl-pro',
      'enterprise': 'omnicrawl-enterprise',
    },
    'ex-memory': {
      'basic': 'ex-memory-basic',
      'premium': 'ex-memory-premium',
      'ultimate': 'ex-memory-ultimate',
    },
    'skeleton-anatomy': {
      'student': 'skeleton-student',
      'professional': 'skeleton-professional',
      'institution': 'skeleton-institution',
    },
    'ui-design-system': {
      'solo': 'uidesign-solo',
      'team': 'uidesign-team',
      'enterprise': 'uidesign-enterprise',
    },
    'statux': {
      'pro': 'statux-pro',
    },
    'xisland': {
      'pro': 'xisland-pro',
    },
    'tollow': {
      'pro': 'tollow-pro',
    },
    'xnook': {
      'pro': 'xnook-pro',
    },
    'chakra-visualizer': {
      'premium': 'chakra-premium',
    },
  };

  return mapping[productName]?.[planName.toLowerCase()] || '';
}

// 创建支付订单
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName, planName, paymentMethod, email, isMobile } = body;

    // 验证参数
    if (!productName || !planName || !paymentMethod || !email) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 生成产品 ID
    const productId = generateProductId(productName, planName);
    if (!productId) {
      return NextResponse.json(
        { error: '产品不存在' },
        { status: 400 }
      );
    }

    // 获取人民币价格
    const priceCNY = PRICE_CNY_MAP[productId];
    if (!priceCNY) {
      return NextResponse.json(
        { error: '价格未配置' },
        { status: 400 }
      );
    }

    // 生成订单号
    const orderId = `MS${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // 获取产品名称
    const productFullName = PRODUCT_NAME_MAP[productName] || productName;

    // 创建支付宝订单
    const payUrl = isMobile
      ? await createAlipayMobileOrder({
          orderId,
          amount: priceCNY,
          subject: `${productFullName} - ${planName}`,
          body: `购买 ${productFullName} 的 ${planName} 方案`,
        })
      : await createAlipayOrder({
          orderId,
          amount: priceCNY,
          subject: `${productFullName} - ${planName}`,
          body: `购买 ${productFullName} 的 ${planName} 方案`,
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

  // TODO: 查询实际支付状态
  return NextResponse.json({
    orderId,
    status: 'pending',
    message: '支付状态查询功能开发中',
  });
}
