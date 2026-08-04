import { Resend } from 'resend';

let resendClient: Resend | null = null;

function getConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || apiKey === 're_' || !audienceId) {
    throw new Error('RESEND_API_KEY or RESEND_AUDIENCE_ID is not configured');
  }
  return { apiKey, audienceId };
}

function getResend(apiKey: string) {
  if (!resendClient) resendClient = new Resend(apiKey);
  return resendClient;
}

export function isNewsletterConfigured(): boolean {
  const apiKey = process.env.RESEND_API_KEY;
  return Boolean(apiKey && apiKey !== 're_' && process.env.RESEND_AUDIENCE_ID);
}

export async function subscribeNewsletterContact(email: string): Promise<'created' | 'restored'> {
  const { apiKey, audienceId } = getConfig();
  const resend = getResend(apiKey);
  const { error } = await resend.contacts.create({
    email,
    audienceId,
    unsubscribed: false,
  });

  if (!error) return 'created';
  if (!error.message?.includes('already exists')) {
    throw new Error(`Newsletter subscription failed: ${error.message}`);
  }

  const { error: updateError } = await resend.contacts.update({
    email,
    audienceId,
    unsubscribed: false,
  });
  if (updateError) {
    throw new Error(`Newsletter resubscription failed: ${updateError.message}`);
  }
  return 'restored';
}

export async function hasNewsletterContact(email: string): Promise<boolean> {
  const { apiKey, audienceId } = getConfig();
  const { data, error } = await getResend(apiKey).contacts.get({ email, audienceId });
  if (error || !data) return false;
  return !data.unsubscribed;
}

export async function unsubscribeNewsletterContact(email: string): Promise<void> {
  const { apiKey, audienceId } = getConfig();
  const { error } = await getResend(apiKey).contacts.update({
    email,
    audienceId,
    unsubscribed: true,
  });
  if (error) throw new Error(`Newsletter unsubscribe failed: ${error.message}`);
}
