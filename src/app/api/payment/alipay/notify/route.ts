import { NextRequest, NextResponse } from 'next/server';
import { verifyAlipayNotify } from '@/lib/alipay';

// 支付宝异步通知回调
export async function POST(request: NextRequest) {
  try {
    // 解析表单数据
    const formData = await request.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    console.log('Alipay notify:', params);

    // 验证签名
    const isValid = verifyAlipayNotify(params);
    if (!isValid) {
      console.error('Invalid alipay notify signature');
      return new NextResponse('fail', { status: 400 });
    }

    // 检查支付状态
    const { trade_status, out_trade_no, total_amount } = params;

    // 只处理成功的交易
    if (trade_status === 'TRADE_SUCCESS' || trade_status === 'TRADE_FINISHED') {
      // TODO: 更新订单状态
      console.log(`Payment success: ${out_trade_no}, amount: ${total_amount}`);

      // 这里可以：
      // 1. 更新数据库订单状态
      // 2. 发送确认邮件
      // 3. 激活用户权限
      // 4. 记录交易日志
    }

    // 返回 success 告诉支付宝已收到通知
    return new NextResponse('success', { status: 200 });
  } catch (error) {
    console.error('Alipay notify error:', error);
    return new NextResponse('fail', { status: 500 });
  }
}

// 支付宝同步回调（用户支付完成后跳转）
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const out_trade_no = searchParams.get('out_trade_no');
  const trade_no = searchParams.get('trade_no');
  const result = searchParams.get('result');

  // 跳转到成功页面
  const successUrl = new URL('/success', request.url);
  successUrl.searchParams.set('orderId', out_trade_no || '');
  successUrl.searchParams.set('tradeNo', trade_no || '');

  return NextResponse.redirect(successUrl);
}
