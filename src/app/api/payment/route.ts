import { NextRequest, NextResponse } from 'next/server';

// 支付配置
const PAYMENT_CONFIG = {
  // 支付宝配置
  alipay: {
    appId: process.env.ALIPAY_APP_ID || '',
    privateKey: process.env.ALIPAY_PRIVATE_KEY || '',
    alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY || '',
    gateway: process.env.ALIPAY_GATEWAY || 'https://openapi.alipay.com/gateway.do',
  },
  // 微信支付配置
  wechat: {
    appId: process.env.WECHAT_APP_ID || '',
    mchId: process.env.WECHAT_MCH_ID || '',
    apiKey: process.env.WECHAT_API_KEY || '',
    apiV3Key: process.env.WECHAT_API_V3_KEY || '',
  },
};

// 创建支付订单
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName, planName, price, period, paymentMethod, email } = body;

    // 验证参数
    if (!productName || !planName || !price || !paymentMethod || !email) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 计算人民币价格（按 1:7 汇率）
    const priceCNY = Math.round(price * 7);

    // 生成订单号
    const orderId = `MS${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // 根据支付方式创建订单
    if (paymentMethod === 'alipay') {
      // 支付宝支付
      // TODO: 接入支付宝当面付/手机网站支付
      return NextResponse.json({
        success: true,
        orderId,
        paymentMethod: 'alipay',
        paymentUrl: `alipay://platformapi/startapp?appId=20000067&url=${encodeURIComponent(`https://openapi.alipay.com/gateway.do?out_trade_no=${orderId}`)}`,
        message: '支付宝支付功能开发中',
      });
    } else if (paymentMethod === 'wechat') {
      // 微信支付
      // TODO: 接入微信支付 JSAPI/H5
      return NextResponse.json({
        success: true,
        orderId,
        paymentMethod: 'wechat',
        paymentUrl: `weixin://`,
        message: '微信支付功能开发中',
      });
    } else {
      return NextResponse.json(
        { error: '不支持的支付方式' },
        { status: 400 }
      );
    }
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
