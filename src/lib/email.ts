import { findProduct } from './products';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let resendClient: any = null;

function getResend() {
  if (!resendClient) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Resend } = require('resend');
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

interface OrderEmailData {
  email: string;
  orderId: string;
  productId: string;
  planName: string;
  amount: number;
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  const { email, orderId, productId, planName, amount } = data;

  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured, skipping email');
    return;
  }

  const product = findProduct(productId);
  const productName = product?.name || productId;

  const resend = getResend();

  await resend.emails.send({
    from: 'Meteor Store <noreply@imagentx.top>',
    to: email,
    subject: `订单确认 - ${productName} ${planName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #7c3aed;">🎉 支付成功！</h1>
        <p>感谢你购买 <strong>${productName}</strong> 的 <strong>${planName}</strong> 方案。</p>

        <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>订单号：</strong>${orderId}</p>
          <p style="margin: 4px 0;"><strong>产品：</strong>${productName} - ${planName}</p>
          <p style="margin: 4px 0;"><strong>金额：</strong>¥${amount}</p>
        </div>

        <p>如有任何问题，请回复此邮件联系我们。</p>

        <p style="color: #6b7280; font-size: 12px; margin-top: 40px;">
          Meteor Store · agentx.top
        </p>
      </div>
    `,
  });
}
