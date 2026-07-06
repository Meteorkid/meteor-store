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
  licenseKey?: string;
  accessToken?: string;
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
        ${data.licenseKey ? `
        <div style="background: #1a1a2e; color: #e0e0e0; padding: 20px; border-radius: 8px; margin: 16px 0; text-align: center;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #aaa;">您的激活码</p>
          <p style="margin: 0; font-size: 24px; font-family: monospace; letter-spacing: 2px; color: #10b981;">
            <strong>${escapeHtml(data.licenseKey)}</strong>
          </p>
        </div>
        <p style="color: #666; font-size: 13px;">请妥善保管您的激活码，这是使用产品的唯一凭证。</p>
        ` : ''}
        ${data.accessToken ? `
        <p style="color: #666; font-size: 13px; margin-top: 16px;">
          <a href="${(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.imagentx.top')}/orders/${orderId}?token=${escapeHtml(data.accessToken)}" style="color: #8b5cf6;">查看订单详情</a>
        </p>
        ` : ''}
        <p style="color: #666; font-size: 14px;">如有问题，请回复此邮件联系我们。</p>
      </div>
    `,
  });

  if (error) throw new Error(`Email send failed: ${error.message}`);
}

/**
 * 向管理员发送异常告警（如支付金额不一致）。
 * 未配置 ALERT_EMAIL 时静默跳过，避免因告警本身缺配置而抛错影响主流程。
 */
export async function sendAdminAlert(subject: string, details: Record<string, string>) {
  const alertEmail = process.env.ALERT_EMAIL;
  if (!alertEmail) return;

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@imagentx.top';
  const rows = Object.entries(details)
    .map(([key, value]) => `<tr><td style="padding:4px 8px;color:#666;">${escapeHtml(key)}</td><td style="padding:4px 8px;">${escapeHtml(value)}</td></tr>`)
    .join('');

  try {
    await getResend().emails.send({
      from: `Meteor Store Alert <${fromEmail}>`,
      to: alertEmail,
      subject: `[告警] ${subject}`,
      html: `<table style="font-family: sans-serif; font-size: 14px;">${rows}</table>`,
    });
  } catch (err) {
    // 告警发送失败不应影响主流程，仅记录日志
    console.error('Admin alert email failed:', err);
  }
}
