#!/usr/bin/env node

const ENDPOINT = 'http://127.0.0.1:3000/api/cron/pathfinder-sync';
const TIMEOUT_MS = 65_000;
const MIN_SECRET_BYTES = 32;

process.exitCode = await runSync();

async function runSync() {
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
      writeSummary({
        success: false,
        reason: 'invalid_response',
        httpStatus: response.status,
      });
      return 1;
    }

    const results = Array.isArray(payload?.results) ? payload.results : [];
    const failedSources = results
      .filter((result) => result && typeof result === 'object' && result.error)
      .map((result) => String(result.sourceId ?? 'unknown'));
    const totals = results.reduce((summary, result) => ({
      fetched: summary.fetched + asCount(result?.fetched),
      inserted: summary.inserted + asCount(result?.inserted),
      updated: summary.updated + asCount(result?.updated),
      skipped: summary.skipped + asCount(result?.skipped),
    }), { fetched: 0, inserted: 0, updated: 0, skipped: 0 });
    const success = response.ok && payload?.success === true && failedSources.length === 0;

    writeSummary({
      success,
      httpStatus: response.status,
      changed: payload?.changed === true,
      maintenanceChanged: asCount(payload?.maintenanceChanged),
      sourceCount: results.length,
      failedSources,
      ...totals,
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
    event: 'pathfinder_sync_cron',
    timestamp: new Date().toISOString(),
    ...summary,
  });
  if (summary.success) {
    console.log(line);
  } else {
    console.error(line);
  }
}
