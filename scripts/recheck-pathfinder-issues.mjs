#!/usr/bin/env node
/**
 * 对已入库的开源任务重新做一次「能不能上手」判定。
 *
 * 抓取阶段的判定（src/lib/pathfinder/ingestion/actionable.ts）只作用于新抓到的
 * 条目。存量条目是在收紧判据之前入库的，而判定需要的 `comments` / `updated_at`
 * 并没有存进数据库，只能回查 GitHub——**这需要 GITHUB_TOKEN**：未授权时
 * REST 配额只有 60 次/小时，几十条就打满了。
 *
 * 用法（默认 dry-run）：
 *   node --experimental-strip-types --env-file=.env.production scripts/recheck-pathfinder-issues.mjs
 *   node --experimental-strip-types --env-file=.env.production scripts/recheck-pathfinder-issues.mjs --apply
 *
 * `--apply` 把判定不通过的条目置为 archived（不是删除：可逆、保留记录，
 * 而且同步不会把 archived 复活，见 changedPathfinderStatus）。
 *
 * `--quiet` 只在最后打一行 JSON 摘要，供 crontab 使用——逐条输出进 syslog 会刷屏，
 * 与另外四个 cron 脚本的日志形状也对不上。**同步任务从不回查已入库条目**
 * （抓取阶段的判定只作用于新条目），所以不定期跑这个，已关闭的 issue
 * 会一直挂在「可直接上手」里越积越多。
 */
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSql } from './lib/pg-sql.mjs';
import { beginRecheck, finishRecheck, InvalidRecheckStateError, quarantineRecheckState, readRecheckState, saveRecheckState } from './lib/recheck-state.mjs';
import { notActionableReason } from '../src/lib/pathfinder/ingestion/actionable.ts';

/** 从公开 issue 地址反推固定 GitHub REST 地址，不接受 URL 凭据或其它主机。 */
function apiUrlOf(canonicalUrl) {
  const match = canonicalUrl.match(/^https:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/issues\/(\d+)(?:[/?#]|$)/);
  return match ? `https://api.github.com/repos/${match[1]}/${match[2]}/issues/${match[3]}` : null;
}

/** 依赖参数仅供隔离夹具注入；CLI 不接受可改写 GitHub 主机的参数。 */
export async function main(options = {}) {
  const args = options.args ?? process.argv.slice(2);
  const env = options.env ?? process.env;
  const apply = args.includes('--apply');
  const quiet = args.includes('--quiet');
  const output = options.output ?? console;
  const say = (...values) => { if (!quiet) output.log(...values); };
  const now = options.now ?? (() => new Date().toISOString());
  const fetchIssue = options.fetch ?? fetch;
  const saveState = options.saveState ?? saveRecheckState;
  const stateFile = env.PATHFINDER_RECHECK_STATE_FILE ?? join(
    env.HEALTH_CHECK_STATE_FILE ? dirname(env.HEALTH_CHECK_STATE_FILE) : fileURLToPath(new URL('../data/monitoring', import.meta.url)),
    'pathfinder-recheck.json',
  );
  let started = beginRecheck(null, now());
  let stateError = null;
  let canRecordState = apply;
  let stateRecorded = false;
  // dry-run 不会覆盖现有正式任务状态，也不会把模拟结果当成已应用的完整成功。
  if (apply) {
    try {
      started = beginRecheck(await readRecheckState(stateFile), started.lastAttemptAt);
    } catch (error) {
      if (error instanceof InvalidRecheckStateError) {
        try { await quarantineRecheckState(stateFile); stateError = 'task-state-reset'; }
        catch { stateError = 'task-state-unavailable'; canRecordState = false; }
      } else {
        // 读不到旧记录时不覆盖未知历史；附属状态不能挡住原有回查。
        stateError = 'task-state-unavailable'; canRecordState = false;
      }
    }
    if (canRecordState) {
      try { await saveState(stateFile, started); }
      catch { stateError = 'task-state-unavailable'; }
    }
  }

  const result = { checked: 0, skipped: 0, verified: 0, failed: 0, doomed: 0, archived: 0, reason: null, failures: [] };
  let sql;
  const doomed = [];
  const recordFailure = (row, reason, httpStatus = null) => {
    result.failed += 1;
    // 不保存标题、响应正文、URL、异常信息或凭据；无效 ID 不进入日志。
    if (result.failures.length < 5 && /^[a-zA-Z0-9_-]{1,100}$/.test(row.id)) result.failures.push({ id: row.id, reason, httpStatus });
    say(`  ?  ${row.id.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 100)}  ${reason}${httpStatus ? ` ${httpStatus}` : ''}`);
  };
  try {
    if (!env.DATABASE_URL || !env.GITHUB_TOKEN) {
      result.reason = 'configuration';
    } else {
      sql = (options.createSql ?? createSql)(env.DATABASE_URL);
      const rows = await sql`
        select id, canonical_url, title_en from pathfinder_items
        where item_type = 'open-source' and status = 'published'
        order by published_at asc
      `;
      result.checked = rows.length;
      say(`公开的开源条目 ${rows.length} 条，开始回查 GitHub…`);
      for (const row of rows) {
        const api = apiUrlOf(row.canonical_url);
        if (!api) { result.skipped += 1; continue; }
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10_000);
        let httpStatus = null;
        try {
          const response = await fetchIssue(api, {
            headers: {
              Authorization: `Bearer ${env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'Meteor-Pathfinder/1.0',
            },
            redirect: 'error', signal: controller.signal,
          });
          httpStatus = response.status;
          if (!response.ok) {
            await response.body?.cancel();
            recordFailure(row, 'http', httpStatus);
            continue;
          }
          let raw;
          try { raw = await response.json(); } catch { recordFailure(row, 'invalid-response', httpStatus); continue; }
          if (!raw || typeof raw !== 'object' || !['open', 'closed'].includes(raw.state)) {
            recordFailure(row, 'invalid-response', httpStatus); continue;
          }
          const reason = notActionableReason({
            createdAt: raw.created_at ?? null, updatedAt: raw.updated_at ?? null,
            comments: typeof raw.comments === 'number' ? raw.comments : 0,
            isPullRequest: raw.pull_request !== undefined,
            hasAssignee: Boolean(raw.assignee) || (Array.isArray(raw.assignees) && raw.assignees.length > 0),
          });
          result.verified += 1;
          const verdict = raw.state === 'closed' ? 'closed' : reason;
          if (verdict) { doomed.push(row.id); say(`  ✗ [${verdict}] ${row.id}`); }
        } catch {
          recordFailure(row, 'network', httpStatus);
        } finally { clearTimeout(timeout); }
      }
      result.doomed = doomed.length;
      if (apply && doomed.length > 0) {
        const at = now();
        // 条件更新，保留同步任务或管理员刚修改的状态。
        const updated = await sql`
          update pathfinder_items set status = 'archived', reviewed_at = ${at}, updated_at = ${at}
          where id = any(${doomed}) and status = 'published'
          returning id
        `;
        result.archived = updated.length;
      }
      if (!apply) say('[dry-run] 未写库；加 --apply 才会归档并记录正式任务状态。');
    }
  } catch {
    result.reason = 'database';
  } finally {
    try { await sql?.end(); } catch { result.reason = 'database'; }
  }
  const finished = finishRecheck(started, result, now());
  if (canRecordState) {
    try { await saveState(stateFile, finished); stateRecorded = true; }
    catch { stateError = 'task-state-unavailable'; }
  }
  const success = finished.status === 'ok' && stateError === null;
  const line = JSON.stringify({ event: 'pathfinder_recheck_cron', timestamp: finished.finishedAt,
    status: finished.status, success, applied: apply, ...result, stateRecorded,
    ...(stateError ? { error: stateError } : {}) });
  if (success) output.log(line); else output.error(line);
  return stateError || result.reason === 'configuration' ? 2 : finished.status === 'ok' ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = await main();
