import { Resend } from 'resend';
import { getSiteUrl, SENDER_EMAIL } from './constants';
import { findPurchasable } from './products';

let resendClient: Resend | null = null;

function getResend() {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

function getReplyToEmail(): string | undefined {
  return process.env.RESEND_REPLY_TO_EMAIL?.trim() || undefined;
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

interface VerificationEmailData {
  email: string;
  token: string;
  locale: 'zh' | 'en';
}

type PasswordResetEmailData = VerificationEmailData;
type NewsletterUnsubscribeEmailData = VerificationEmailData;
type StudentVerificationEmailData = VerificationEmailData;

export function isEmailDeliveryConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmailVerification(data: VerificationEmailData) {
  const siteUrl = getSiteUrl();
  const verificationUrl = escapeHtml(
    `${siteUrl}/${data.locale}/verify-email#token=${encodeURIComponent(data.token)}`,
  );
  const fromEmail = process.env.RESEND_FROM_EMAIL || SENDER_EMAIL;
  const copy = data.locale === 'en'
    ? {
        subject: 'Verify your Meteor Store email',
        title: 'Verify your email',
        body: 'Click the button below to verify your email address. This link expires in 24 hours.',
        action: 'Verify email',
        hint: 'If you did not create this account, you can ignore this email.',
      }
    : {
        subject: '验证邮箱 - Meteor Store',
        title: '验证邮箱',
        body: '点击下方按钮验证你的邮箱地址。链接将在 24 小时后失效。',
        action: '验证邮箱',
        hint: '如果不是你创建了这个账户，可以忽略这封邮件。',
      };

  const { error } = await getResend().emails.send({
    from: `Meteor Store <${fromEmail}>`,
    replyTo: getReplyToEmail(),
    to: data.email,
    subject: copy.subject,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
        <h1>${copy.title}</h1>
        <p>${copy.body}</p>
        <p style="margin: 28px 0;">
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 20px; border-radius: 8px; background: #7c3aed; color: #fff; text-decoration: none; font-weight: 600;">${copy.action}</a>
        </p>
        <p style="color: #666; font-size: 13px;">${copy.hint}</p>
      </div>
    `,
  });

  if (error) throw new Error(`Email send failed: ${error.message}`);
}

export async function sendPasswordReset(data: PasswordResetEmailData) {
  const siteUrl = getSiteUrl();
  const resetUrl = escapeHtml(
    `${siteUrl}/${data.locale}/reset-password#token=${encodeURIComponent(data.token)}`,
  );
  const fromEmail = process.env.RESEND_FROM_EMAIL || SENDER_EMAIL;
  const copy = data.locale === 'en'
    ? {
        subject: 'Reset your Meteor Store password',
        title: 'Reset your password',
        body: 'Click the button below to choose a new password. This link expires in 1 hour.',
        action: 'Reset password',
        hint: 'If you did not request this change, you can ignore this email.',
      }
    : {
        subject: '重置密码 - Meteor Store',
        title: '重置密码',
        body: '点击下方按钮设置新密码。链接将在 1 小时后失效。',
        action: '重置密码',
        hint: '如果不是你发起的请求，可以忽略这封邮件。',
      };

  const { error } = await getResend().emails.send({
    from: `Meteor Store <${fromEmail}>`,
    replyTo: getReplyToEmail(),
    to: data.email,
    subject: copy.subject,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
        <h1>${copy.title}</h1>
        <p>${copy.body}</p>
        <p style="margin: 28px 0;">
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; border-radius: 8px; background: #7c3aed; color: #fff; text-decoration: none; font-weight: 600;">${copy.action}</a>
        </p>
        <p style="color: #666; font-size: 13px;">${copy.hint}</p>
      </div>
    `,
  });

  if (error) throw new Error(`Email send failed: ${error.message}`);
}

export async function sendNewsletterUnsubscribeConfirmation(
  data: NewsletterUnsubscribeEmailData,
) {
  const siteUrl = getSiteUrl();
  const unsubscribeUrl = escapeHtml(
    `${siteUrl}/${data.locale}/newsletter/unsubscribe#token=${encodeURIComponent(data.token)}`,
  );
  const fromEmail = process.env.RESEND_FROM_EMAIL || SENDER_EMAIL;
  const copy = data.locale === 'en'
    ? {
        subject: 'Confirm newsletter unsubscribe - Meteor Store',
        title: 'Confirm unsubscribe',
        body: 'Click the button below to stop receiving product updates. This link expires in 1 hour.',
        action: 'Unsubscribe',
        hint: 'If you did not request this, you can ignore this email and your subscription will remain active.',
      }
    : {
        subject: '确认退订产品动态 - Meteor Store',
        title: '确认退订',
        body: '点击下方按钮停止接收产品动态。链接将在 1 小时后失效。',
        action: '确认退订',
        hint: '如果不是你发起的请求，可以忽略这封邮件，你的订阅不会受到影响。',
      };

  const { error } = await getResend().emails.send({
    from: `Meteor Store <${fromEmail}>`,
    replyTo: getReplyToEmail(),
    to: data.email,
    subject: copy.subject,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
        <h1>${copy.title}</h1>
        <p>${copy.body}</p>
        <p style="margin: 28px 0;">
          <a href="${unsubscribeUrl}" style="display: inline-block; padding: 12px 20px; border-radius: 8px; background: #7c3aed; color: #fff; text-decoration: none; font-weight: 600;">${copy.action}</a>
        </p>
        <p style="color: #666; font-size: 13px;">${copy.hint}</p>
      </div>
    `,
  });

  if (error) throw new Error(`Email send failed: ${error.message}`);
}

export async function sendStudentVerification(data: StudentVerificationEmailData) {
  const siteUrl = getSiteUrl();
  const verificationUrl = escapeHtml(
    `${siteUrl}/${data.locale}/student#token=${encodeURIComponent(data.token)}`,
  );
  const fromEmail = process.env.RESEND_FROM_EMAIL || SENDER_EMAIL;
  const copy = data.locale === 'en'
    ? {
        subject: 'Verify your student status - Meteor Store',
        title: 'Verify student status',
        body: 'Click the button below to verify this education email for your Meteor Store account. This link expires in 24 hours.',
        action: 'Verify student status',
        hint: 'If you did not request this, you can ignore this email.',
      }
    : {
        subject: '验证学生身份 - Meteor Store',
        title: '验证学生身份',
        body: '点击下方按钮，将此教育邮箱验证到你的 Meteor Store 账户。链接将在 24 小时后失效。',
        action: '验证学生身份',
        hint: '如果不是你发起的请求，可以忽略这封邮件。',
      };

  const { error } = await getResend().emails.send({
    from: `Meteor Store <${fromEmail}>`,
    replyTo: getReplyToEmail(),
    to: data.email,
    subject: copy.subject,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
        <h1>${copy.title}</h1>
        <p>${copy.body}</p>
        <p style="margin: 28px 0;">
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 20px; border-radius: 8px; background: #7c3aed; color: #fff; text-decoration: none; font-weight: 600;">${copy.action}</a>
        </p>
        <p style="color: #666; font-size: 13px;">${copy.hint}</p>
      </div>
    `,
  });

  if (error) throw new Error(`Email send failed: ${error.message}`);
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  const product = findPurchasable(data.productId);
  const productName = escapeHtml(product?.name?.zh || data.productId);
  const planName = escapeHtml(data.planName);
  const orderId = escapeHtml(data.orderId);

  const fromEmail = process.env.RESEND_FROM_EMAIL || SENDER_EMAIL;
  const { error } = await getResend().emails.send({
    from: `Meteor Store <${fromEmail}>`,
    replyTo: getReplyToEmail(),
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
        <p style="color: #666; font-size: 13px;">请妥善保管您的激活码，这是使用产品的唯一凭证。建议直接复制保存到本地，不要转发本邮件。</p>
        ` : ''}
        <p style="color: #666; font-size: 14px; margin-top: 16px;">如有问题，请回复此邮件联系我们。</p>
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

  const fromEmail = process.env.RESEND_FROM_EMAIL || SENDER_EMAIL;
  const rows = Object.entries(details)
    .map(([key, value]) => `<tr><td style="padding:4px 8px;color:#666;">${escapeHtml(key)}</td><td style="padding:4px 8px;">${escapeHtml(value)}</td></tr>`)
    .join('');

  try {
    await getResend().emails.send({
      from: `Meteor Store Alert <${fromEmail}>`,
      replyTo: getReplyToEmail(),
      to: alertEmail,
      subject: `[告警] ${subject}`,
      html: `<table style="font-family: sans-serif; font-size: 14px;">${rows}</table>`,
    });
  } catch (err) {
    // 告警发送失败不应影响主流程，仅记录日志
    console.error('Admin alert email failed:', err);
  }
}

interface PassExpiryReminderEmailData {
  email: string;
  expiresAt: string;
}

/**
 * 发送 Meteor Pass 到期提醒邮件。
 * 用 expiresAt 计算剩余天数，并给出续费入口（定价区）。
 */
export async function sendPassExpiryReminder(data: PassExpiryReminderEmailData) {
  const siteUrl = getSiteUrl();
  const fromEmail = process.env.RESEND_FROM_EMAIL || SENDER_EMAIL;

  const daysLeft = Math.max(0, Math.ceil(
    (new Date(data.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000),
  ));
  const renewUrl = escapeHtml(`${siteUrl}/zh/pricing`);

  const { error } = await getResend().emails.send({
    from: `Meteor Store <${fromEmail}>`,
    replyTo: getReplyToEmail(),
    to: data.email,
    subject: 'Meteor Pass 即将到期，别忘了续费',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">⏳ Meteor Pass 即将到期</h1>
        <p>您的 Meteor Pass 全站会员将于 <strong>${escapeHtml(data.expiresAt.slice(0, 10))}</strong> 到期，还剩 <strong>${daysLeft}</strong> 天。</p>
        <p>到期后，站内产品将不再解锁。续费后有效期自动顺延，不会浪费已购时长。</p>
        <p style="margin: 28px 0;">
          <a href="${renewUrl}" style="display: inline-block; padding: 12px 20px; border-radius: 8px; background: #7c3aed; color: #fff; text-decoration: none; font-weight: 600;">立即续费</a>
        </p>
        <p style="color: #666; font-size: 13px;">如果您近期已续费，请忽略本邮件。有任何问题请回复此邮件。</p>
      </div>
    `,
  });

  if (error) throw new Error(`Email send failed: ${error.message}`);
}

export interface PathfinderDeadlineReminderEmailData {
  email: string;
  title: string;
  organization: string;
  daysLeft: number;
  /** 站内条目详情地址，站点域名由 getSiteUrl 补全 */
  itemUrl: string;
}

/**
 * Pathfinder 收藏条目的截止提醒。
 *
 * 与 Pass 到期提醒不同，这封信不推销任何东西——它只是把用户自己收藏过的
 * 一件事在到点前提出来，所以正文只说清「哪条、还剩几天、去哪看」。
 */
export async function sendPathfinderDeadlineReminder(data: PathfinderDeadlineReminderEmailData) {
  const siteUrl = getSiteUrl();
  const fromEmail = process.env.RESEND_FROM_EMAIL || SENDER_EMAIL;
  const itemUrl = escapeHtml(`${siteUrl}/zh${data.itemUrl}`);
  const savedUrl = escapeHtml(`${siteUrl}/zh/pathfinder/saved`);
  const daysLeft = Math.max(0, Math.trunc(data.daysLeft));
  const countdown = daysLeft === 0 ? '今天截止' : `还剩 ${daysLeft} 天`;

  const { error } = await getResend().emails.send({
    from: `Meteor Store <${fromEmail}>`,
    replyTo: getReplyToEmail(),
    to: data.email,
    subject: `${countdown}：${data.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">⏳ 你收藏的机会${countdown}</h1>
        <p style="font-size: 16px;"><strong>${escapeHtml(data.title)}</strong></p>
        <p style="color: #666;">${escapeHtml(data.organization)}</p>
        <p style="margin: 28px 0;">
          <a href="${itemUrl}" style="display: inline-block; padding: 12px 20px; border-radius: 8px; background: #7c3aed; color: #fff; text-decoration: none; font-weight: 600;">查看详情</a>
        </p>
        <p style="color: #666; font-size: 13px;">截止时间以官方页面为准。不想再收到这条提醒，可以在<a href="${savedUrl}">收藏列表</a>里单独关闭它。</p>
      </div>
    `,
  });

  if (error) throw new Error(`Email send failed: ${error.message}`);
}

interface AdminPendingDigestData {
  to: string[];
  /** 各类待办的条数，只放大于 0 的项 */
  items: Array<{ label: string; count: number; href: string }>;
  total: number;
}

/**
 * 管理员待办摘要邮件。
 *
 * 站内的角标只在人打开网站时才看得到。这封信补的是「完全离开站点」的情况：
 * 由定时任务按天调用，有待办才发，没有就不打扰。
 *
 * 不做「距上次发送多久」这类去重表——**调用频率本身就是去重**：一天跑一次，
 * 就一天最多一封。加一张表只会多一个要维护、要迁移的东西。
 */
export async function sendAdminPendingDigest(data: AdminPendingDigestData) {
  if (data.to.length === 0 || data.total <= 0) return;

  const siteUrl = getSiteUrl();
  const fromEmail = process.env.RESEND_FROM_EMAIL || SENDER_EMAIL;
  const rows = data.items.map((item) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">
        <a href="${siteUrl}${escapeHtml(item.href)}" style="color:#7c3aed;text-decoration:none;">${escapeHtml(item.label)}</a>
      </td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:600;">${item.count}</td>
    </tr>`).join('');

  try {
    await getResend().emails.send({
      from: `Meteor Store <${fromEmail}>`,
      replyTo: getReplyToEmail(),
      // 逐个收件人分别发送，避免在信头里互相暴露管理员邮箱
      to: data.to,
      subject: `后台有 ${data.total} 项待处理`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;">
          <p style="font-size:15px;color:#333;">后台目前有 <strong>${data.total}</strong> 项待处理：</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>
          <p style="margin-top:20px;">
            <a href="${siteUrl}/zh/admin" style="display:inline-block;background:#7c3aed;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-size:14px;">进入后台</a>
          </p>
          <p style="font-size:12px;color:#999;margin-top:24px;">没有待处理事项时不会收到这封信。</p>
        </div>`,
    });
  } catch (err) {
    // 提醒发送失败不应影响定时任务的其它工作，仅记录日志
    console.error('Admin pending digest email failed:', err);
  }
}
