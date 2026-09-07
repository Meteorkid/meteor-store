#!/usr/bin/env node

/**
 * 把当天的资讯日报发进通知箱（Header 铃铛）。
 *
 * 与其它 Pathfinder 定时任务一样只做一件事：带密钥打本机接口、把结果压成
 * 一行 JSON 摘要。密钥由 Node 从权限 600 的环境文件读取（`--env-file`），
 * 不出现在 crontab 或进程参数里——`ps` 能看到命令行，crontab 会被备份到别处。
 *
 * **按天调用**：幂等由 `announcements.source_key` 的唯一索引保证，同一期日报
 * 只会发一条公告，所以补跑或重试都不会在铃铛里堆出重复通知。
 *
 * 上游偶尔断更（实测 36 天出 30 期）。断更那天接口返回 `duplicate`——
 * 最新一期还是昨天那份、已经发过了——这是正常的，不算失败。
 */
const ENDPOINT = 'http://127.0.0.1:3000/api/cron/pathfinder-digest';
const TIMEOUT_MS = 45_000;
const MIN_SECRET_BYTES = 32;

process.exitCode = await announceDigest();

async function announceDigest() {
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
      // created=已发出 / duplicate=今天已发过 / no-digest=上游还没出这一期
      status: typeof payload?.status === 'string' ? payload.status : 'unknown',
      sourceKey: typeof payload?.sourceKey === 'string' ? payload.sourceKey : null,
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
    event: 'pathfinder_digest_cron',
    timestamp: new Date().toISOString(),
    ...summary,
  });
  if (summary.success) {
    console.log(line);
  } else {
    console.error(line);
  }
}
