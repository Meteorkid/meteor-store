#!/usr/bin/env node

// 凭据由--env-file提供，只输出脱敏的来源与计数。
const secret = process.env.PATHFINDER_CRON_SECRET ?? '';
let summary = { event: 'phd_sync_cron', success: false };
if (Buffer.byteLength(secret) < 32) summary.reason = 'invalid_configuration';
else {
  try {
    const response = await fetch('http://127.0.0.1:3000/api/cron/phd-sync', {
      method: 'POST', headers: { authorization: `Bearer ${secret}` }, signal: AbortSignal.timeout(110_000),
    });
    const data = await response.json();
    summary = { ...summary, success: response.ok && data.success === true, httpStatus: response.status,
      checked: data.checked, published: data.published, changed: data.changed, failed: data.failed,
      unchanged: data.unchanged, paused: data.paused, errors: data.errors };
  } catch { summary.reason = 'request_failed'; }
}
console.log(JSON.stringify({ ...summary, timestamp: new Date().toISOString() }));
process.exitCode = summary.success ? 0 : 1;
