#!/usr/bin/env node

/**
 * Pathfinder 收藏条目的截止提醒。
 *
 * 与同步任务一样只做一件事：带密钥打本机接口、把结果压成一行 JSON 摘要。
 * 密钥由 Node 从权限 600 的环境文件读取（`--env-file`），不出现在 crontab
 * 或进程参数里——`ps` 能看到命令行，crontab 会被备份到别处。
 *
 * 按天调用即可：接口内部按 (user_id, item_id, deadline) 去重，
 * 同一个截止时间只发一次，重复调用不会重复轰炸用户。
 */
const ENDPOINT = 'http://127.0.0.1:3000/api/cron/pathfinder-deadlines';
const TIMEOUT_MS = 65_000;
const MIN_SECRET_BYTES = 32;

process.exitCode = await runReminders();

async function runReminders() {
  const secret = process.env.PATHFINDER_CRON_SECRET ?? '';
  if (Buffer.byteLength(secret, 'utf8') < MIN_SECRET_BYTES) {
    writeSummary({ success: false, reason: 'invalid_secret' });
    return 1;
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${secret}`,
        'content-type': 'application/json',
      },
      body: '{}',
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    let payload;
    try {
      payload = await response.json();
    } catch {
      writeSummary({ success: false, reason: 'invalid_response', httpStatus: response.status });
      return 1;
    }

    const success = response.ok && payload?.success === true;
    writeSummary({
      success,
      httpStatus: response.status,
      checked: asCount(payload?.checked),
      reminded: asCount(payload?.reminded),
      // skipped 包含「已提醒过」和「发信失败已撤回占位」两种，
      // 后者会在下一轮重试；持续偏高说明发信通道有问题
      skipped: asCount(payload?.skipped),
    });
    return success ? 0 : 1;
  } catch (error) {
    writeSummary({
      success: false,
      reason: error instanceof Error && error.name === 'TimeoutError'
        ? 'timeout'
        : 'request_failed',
    });
    return 1;
  }
}

function asCount(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

function writeSummary(summary) {
  const line = JSON.stringify({
    event: 'pathfinder_deadlines_cron',
    timestamp: new Date().toISOString(),
    ...summary,
  });
  if (summary.success) {
    console.log(line);
  } else {
    console.error(line);
  }
}
