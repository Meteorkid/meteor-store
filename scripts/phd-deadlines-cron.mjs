#!/usr/bin/env node

const secret = process.env.PATHFINDER_CRON_SECRET ?? '';
let summary = { event: 'phd_deadlines_cron', success: false };
if (Buffer.byteLength(secret) < 32) summary.reason = 'invalid_configuration';
else {
  try {
    const response = await fetch('http://127.0.0.1:3000/api/cron/phd-deadlines', {
      method: 'POST', headers: { authorization: `Bearer ${secret}` }, signal: AbortSignal.timeout(110_000),
    });
    const data = await response.json();
    summary = { ...summary, success: response.ok && data.success === true, httpStatus: response.status, created: data.created };
  } catch { summary.reason = 'request_failed'; }
}
console.log(JSON.stringify({ ...summary, timestamp: new Date().toISOString() }));
process.exitCode = summary.success ? 0 : 1;
