import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  hasNewsletterContact,
  subscribeNewsletterContact,
  unsubscribeNewsletterContact,
} from '../newsletter';

const createContact = vi.fn();
const getContact = vi.fn();
const updateContact = vi.fn();

vi.mock('resend', () => ({
  Resend: class MockResend {
    contacts = {
      create: createContact,
      get: getContact,
      update: updateContact,
    };
  },
}));

describe('Newsletter 联系人', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 'test-key';
    process.env.RESEND_AUDIENCE_ID = 'audience-1';
    createContact.mockResolvedValue({ data: { id: 'C1' }, error: null });
    getContact.mockResolvedValue({
      data: { id: 'C1', email: 'user@example.com', unsubscribed: false },
      error: null,
    });
    updateContact.mockResolvedValue({ data: { id: 'C1' }, error: null });
  });

  it('重复联系人重新订阅时恢复 unsubscribed 状态', async () => {
    createContact.mockResolvedValue({
      data: null,
      error: { message: 'Contact already exists' },
    });

    await expect(subscribeNewsletterContact('user@example.com')).resolves.toBe('restored');

    expect(updateContact).toHaveBeenCalledWith({
      email: 'user@example.com',
      audienceId: 'audience-1',
      unsubscribed: false,
    });
  });

  it('只有存在且尚未退订的联系人会收到确认邮件', async () => {
    await expect(hasNewsletterContact('user@example.com')).resolves.toBe(true);
    getContact.mockResolvedValueOnce({
      data: { id: 'C1', email: 'user@example.com', unsubscribed: true },
      error: null,
    });
    await expect(hasNewsletterContact('user@example.com')).resolves.toBe(false);
  });

  it('确认退订时把联系人标记为 unsubscribed', async () => {
    await unsubscribeNewsletterContact('user@example.com');

    expect(updateContact).toHaveBeenCalledWith({
      email: 'user@example.com',
      audienceId: 'audience-1',
      unsubscribed: true,
    });
  });
});
