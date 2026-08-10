import { describe, expect, it } from 'vitest';
import { scrubSentryEvent } from '../sentry-scrub';

describe('Sentry 博客令牌脱敏', () => {
  it('删除大小写不同的授权头并遮蔽事件内的 msb_ 明文', () => {
    const token = `msb_${'a'.repeat(43)}`;
    const event = {
      message: `request failed with ${token}`,
      request: {
        headers: {
          Authorization: `Bearer ${token}`,
          aUtHoRiZaTiOn: `Bearer ${token}`,
          'X-Request-Id': 'request-1',
        },
      },
      exception: { values: [{ value: `bad token ${token}` }] },
      breadcrumbs: [{ message: token, data: { response: `denied ${token}` } }],
      extra: { nested: { credential: token } },
    };

    const scrubbed = scrubSentryEvent(event);
    const serialized = JSON.stringify(scrubbed);

    expect(scrubbed).toBe(event);
    expect(scrubbed.request.headers).not.toHaveProperty('Authorization');
    expect(scrubbed.request.headers).not.toHaveProperty('aUtHoRiZaTiOn');
    expect(scrubbed.request.headers['X-Request-Id']).toBe('request-1');
    expect(serialized).not.toContain(token);
    expect(serialized).toContain('[REDACTED]');
  });
});
