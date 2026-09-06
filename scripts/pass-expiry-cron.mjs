#!/usr/bin/env node

/**
 * Meteor Pass 到期提醒。
 *
 * 与其它 cron 脚本一样只做一件事：带密钥打本机接口、把结果压成一行 JSON 摘要。
 * 密钥由 Node 从权限 600 的环境文件读取（`--env-file`），不出现在 crontab
 * 或进程参数里——`ps` 能看到命令行，crontab 会被备份到别处。
 *
 * **按天调用**：接口扫的是「7 天内到期」的窗口，一天一次足够；
 * 幂等由 `pass_reminders` 表按 (email, expiresAt) 保证，同一个到期日只发一次，
 * 所以补跑或重试都不会给用户发第二封。
 *
 * 超时给到 55 秒：路由声明了 `maxDuration = 60`，逐个用户发信是串行 IO，
 * 比另外几个 cron 慢得多。这里必须比路由的上限短，否则脚本先超时退出、
 * 而服务端还在发信，日志里会留下一条与事实不符的失败记录。
 */
const ENDPOINT = 'http://127.0.0.1:3000/api/cron/pass-expiry';
const TIMEOUT_MS = 55_000;
const MIN_SECRET_BYTES = 32;

process.exitCode = await runPassExpiry();

async function runPassExpiry() {
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

    // reminded 为 0 不是失败——是「这几天没人到期」，绝大多数日子都该是这个结果
    const success = response.ok;
    writeSummary({
      success,
      httpStatus: response.status,
      checked: countOf(payload?.checked),
      reminded: countOf(payload?.reminded),
      skipped: countOf(payload?.skipped),
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

function countOf(value) {
  return Number.isSafeInteger(value) ? value : 0;
}

function writeSummary(summary) {
  const line = JSON.stringify({
    event: 'pass_expiry_cron',
    timestamp: new Date().toISOString(),
    ...summary,
  });
  if (summary.success) {
    console.log(line);
  } else {
    console.error(line);
  }
}
