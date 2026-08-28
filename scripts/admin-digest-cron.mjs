#!/usr/bin/env node

/**
 * 管理员待办摘要邮件。
 *
 * 与其它 cron 脚本一样只做一件事：带密钥打本机接口、把结果压成一行 JSON 摘要。
 * 密钥由 Node 从权限 600 的环境文件读取（`--env-file`），不出现在 crontab
 * 或进程参数里——`ps` 能看到命令行，crontab 会被备份到别处。
 *
 * **按天调用**：接口只在确实有待办时发信，去重靠调用频率本身——一天调一次
 * 就一天最多一封。调得更频繁会变成骚扰，而不会更快让人知道。
 */
const ENDPOINT = 'http://127.0.0.1:3000/api/cron/admin-digest';
const TIMEOUT_MS = 35_000;
const MIN_SECRET_BYTES = 32;

process.exitCode = await runDigest();

async function runDigest() {
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

    // 没有待办时 sent 为 false，这不是失败——是「今天没事，不打扰」
    const success = response.ok;
    writeSummary({
      success,
      httpStatus: response.status,
      sent: payload?.sent === true,
      total: Number.isSafeInteger(payload?.total) ? payload.total : 0,
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

function writeSummary(summary) {
  const line = JSON.stringify({
    event: 'admin_digest_cron',
    timestamp: new Date().toISOString(),
    ...summary,
  });
  if (summary.success) {
    console.log(line);
  } else {
    console.error(line);
  }
}
