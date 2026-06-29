import { Resend } from 'resend';
import { findProduct } from './products';

let resendClient: Resend | null = null;

function getResend() {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

/** 转义 HTML 特殊字符，防止注入 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface OrderEmailData {
  email: string;
  orderId: string;
  productId: string;
  planName: string;
  amount: number;
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  const product = findProduct(data.productId);
  const productName = escapeHtml(product?.name || data.productId);
  const planName = escapeHtml(data.planName);
  const orderId = escapeHtml(data.orderId);

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@imagentx.top';
  const { error } = await getResend().emails.send({
    from: `Meteor Store <${fromEmail}>`,
    to: data.email,
    subject: `订单确认 - ${productName} ${planName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">🎉 支付成功！</h1>
        <p>感谢您购买 <strong>${productName}</strong> 的 <strong>${planName}</strong> 方案。</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>订单号：</strong>${orderId}</p>
          <p><strong>产品：</strong>${productName}</p>
          <p><strong>方案：</strong>${planName}</p>
          <p><strong>支付金额：</strong>¥${data.amount}</p>
        </div>
        <p style="color: #666; font-size: 14px;">如有问题，请回复此邮件联系我们。</p>
      </div>
    `,
  });

  if (error) throw new Error(`Email send failed: ${error.message}`);
}
