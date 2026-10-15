#!/usr/bin/env node

// 凭据由 --env-file 载入；仅访问本机，不在参数或日志中输出密钥。
const action = process.argv[2];
const secret = process.env.PATHFINDER_CRON_SECRET ?? '';
let summary = { event: 'daily_cron', action, success: false };
if (!['generate', 'remind'].includes(action) || Buffer.byteLength(secret) < 32) {
  summary.reason = 'invalid_configuration';
} else {
  try {
    const response = await fetch(`http://127.0.0.1:3000/api/cron/daily?action=${action}`, {
      method: 'POST', headers: { authorization: `Bearer ${secret}` },
      signal: AbortSignal.timeout(110_000),
    });
    const data = await response.json();
    summary = { ...summary, success: response.ok && data.success === true, httpStatus: response.status,
      status: data.status, editions: data.editions };
  } catch { summary.reason = 'request_failed'; }
}
console.log(JSON.stringify({ ...summary, timestamp: new Date().toISOString() }));
process.exitCode = summary.success ? 0 : 1;
