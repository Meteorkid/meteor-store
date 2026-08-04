import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  isEmailDeliveryConfigured,
  sendEmailVerification,
  sendNewsletterUnsubscribeConfirmation,
  sendOrderConfirmation,
  sendPasswordReset,
  sendStudentVerification,
} from '../email';

// Mock Resend
const mockSend = vi.fn();
vi.mock('resend', () => {
  return {
    Resend: class MockResend {
      emails = { send: mockSend };
    },
  };
});

// Mock products — 返回双语结构，与 src/data/products.ts 保持一致
vi.mock('../products', () => ({
  findProduct: vi.fn((id: string) => {
    const products: Record<string, { name: { zh: string; en: string } }> = {
      'omnicrawl': { name: { zh: 'OmniCrawl', en: 'OmniCrawl' } },
      'ex-memory': { name: { zh: 'ExMemory', en: 'ExMemory' } },
    };
    return products[id] || null;
  }),
}));

// escapeHtml 是 email.ts 的内部函数，这里单独测试其逻辑
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

describe('escapeHtml', () => {
  it('escapes ampersand', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });

  it('escapes less-than', () => {
    expect(escapeHtml('a < b')).toBe('a &lt; b');
  });

  it('escapes greater-than', () => {
    expect(escapeHtml('a > b')).toBe('a &gt; b');
  });

  it('escapes double quotes', () => {
    expect(escapeHtml('say "hello"')).toBe('say &quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#39;s');
  });

  it('escapes all special characters together', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  it('returns empty string for empty input', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('does not modify safe strings', () => {
    expect(escapeHtml('Hello World 123')).toBe('Hello World 123');
  });
});

describe('sendOrderConfirmation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 'test-key';
    process.env.RESEND_FROM_EMAIL = 'test@example.com';
    process.env.RESEND_REPLY_TO_EMAIL = 'support@example.com';
    process.env.NEXT_PUBLIC_SITE_URL = 'https://imagentx.top/';
  });

  it('should send email with correct content', async () => {
    mockSend.mockResolvedValue({ error: null });

    await sendOrderConfirmation({
      email: 'buyer@test.com',
      orderId: 'order-123',
      productId: 'omnicrawl',
      planName: 'Pro',
      amount: 199,
    });

    expect(mockSend).toHaveBeenCalledOnce();
    const call = mockSend.mock.calls[0][0];
    expect(call.from).toBe('Meteor Store <test@example.com>');
    expect(call.replyTo).toBe('support@example.com');
    expect(call.to).toBe('buyer@test.com');
    expect(call.subject).toContain('OmniCrawl');
    expect(call.subject).toContain('Pro');
    expect(call.html).toContain('order-123');
    expect(call.html).toContain('¥199');
  });

  it('should throw when Resend returns error', async () => {
    mockSend.mockResolvedValue({ error: { message: 'Rate limited' } });

    await expect(
      sendOrderConfirmation({
        email: 'buyer@test.com',
        orderId: 'order-456',
        productId: 'omnicrawl',
        planName: 'Starter',
        amount: 99,
      })
    ).rejects.toThrow('Email send failed: Rate limited');
  });

  it('should throw when send throws', async () => {
    mockSend.mockRejectedValue(new Error('Network error'));

    await expect(
      sendOrderConfirmation({
        email: 'buyer@test.com',
        orderId: 'order-789',
        productId: 'omnicrawl',
        planName: 'Pro',
        amount: 199,
      })
    ).rejects.toThrow('Network error');
  });

  it('should escape HTML in user content', async () => {
    mockSend.mockResolvedValue({ error: null });

    await sendOrderConfirmation({
      email: 'buyer@test.com',
      orderId: 'order-123',
      productId: 'omnicrawl',
      planName: 'Pro <b>Plan</b>',
      amount: 199,
    });

    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('Pro &lt;b&gt;Plan&lt;/b&gt;');
  });
});

describe('sendEmailVerification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 'test-key';
    process.env.RESEND_FROM_EMAIL = 'test@example.com';
    process.env.RESEND_REPLY_TO_EMAIL = 'support@example.com';
    process.env.NEXT_PUBLIC_SITE_URL = 'https://imagentx.top/';
  });

  it('发送中文验证邮件，token 只出现在 URL fragment', async () => {
    mockSend.mockResolvedValue({ error: null });

    await sendEmailVerification({
      email: 'user@example.com',
      token: 'signed.token/value',
      locale: 'zh',
    });

    const call = mockSend.mock.calls[0][0];
    expect(call.replyTo).toBe('support@example.com');
    expect(call.subject).toContain('验证邮箱');
    expect(call.html).toContain(
      'https://imagentx.top/zh/verify-email#token=signed.token%2Fvalue',
    );
    expect(call.html).not.toContain('?token=');
  });

  it('已有 API key 时允许复用默认发件地址', () => {
    delete process.env.RESEND_FROM_EMAIL;

    expect(isEmailDeliveryConfigured()).toBe(true);
  });
});

describe('sendPasswordReset', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 'test-key';
    process.env.RESEND_FROM_EMAIL = 'test@example.com';
    process.env.RESEND_REPLY_TO_EMAIL = 'support@example.com';
    process.env.NEXT_PUBLIC_SITE_URL = 'https://www.imagentx.top/';
  });

  it('重置 token 只出现在 URL fragment 并携带 Reply-To', async () => {
    mockSend.mockResolvedValue({ error: null });

    await sendPasswordReset({
      email: 'user@example.com',
      token: 'signed.token/value',
      locale: 'zh',
    });

    const call = mockSend.mock.calls[0][0];
    expect(call.replyTo).toBe('support@example.com');
    expect(call.subject).toContain('重置密码');
    expect(call.html).toContain(
      'https://www.imagentx.top/zh/reset-password#token=signed.token%2Fvalue',
    );
    expect(call.html).not.toContain('?token=');
  });
});

describe('sendNewsletterUnsubscribeConfirmation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 'test-key';
    process.env.RESEND_FROM_EMAIL = 'test@example.com';
    process.env.RESEND_REPLY_TO_EMAIL = 'support@example.com';
    process.env.NEXT_PUBLIC_SITE_URL = 'https://www.imagentx.top/';
  });

  it('退订 token 只出现在 URL fragment 并携带 Reply-To', async () => {
    mockSend.mockResolvedValue({ error: null });

    await sendNewsletterUnsubscribeConfirmation({
      email: 'user@example.com',
      token: 'signed.token/value',
      locale: 'zh',
    });

    const call = mockSend.mock.calls[0][0];
    expect(call.replyTo).toBe('support@example.com');
    expect(call.subject).toContain('确认退订');
    expect(call.html).toContain(
      'https://www.imagentx.top/zh/newsletter/unsubscribe#token=signed.token%2Fvalue',
    );
    expect(call.html).not.toContain('?token=');
  });
});

describe('sendStudentVerification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 'test-key';
    process.env.RESEND_FROM_EMAIL = 'test@example.com';
    process.env.RESEND_REPLY_TO_EMAIL = 'support@example.com';
    process.env.NEXT_PUBLIC_SITE_URL = 'https://www.imagentx.top/';
  });

  it('学生验证 token 只出现在 URL fragment 并携带 Reply-To', async () => {
    mockSend.mockResolvedValue({ error: null });

    await sendStudentVerification({
      email: 'student@mit.edu',
      token: 'signed.token/value',
      locale: 'zh',
    });

    const call = mockSend.mock.calls[0][0];
    expect(call.replyTo).toBe('support@example.com');
    expect(call.subject).toContain('学生身份');
    expect(call.html).toContain(
      'https://www.imagentx.top/zh/student#token=signed.token%2Fvalue',
    );
    expect(call.html).not.toContain('?token=');
  });
});
