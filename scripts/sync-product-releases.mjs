#!/usr/bin/env node
/**
 * 刷新 `src/data/product-releases.json`（更新日志的构建期兜底快照）。
 *
 * 为什么需要人工跑：页面正常走运行时从 GitHub 拉全文，快照只在拉取失败时生效。
 * 如果让 CI 自动提交，仓库里会持续产生「机器人改数据」的噪声提交，
 * 而且发版说明往往需要人看一眼再决定要不要保留。所以保持手动。
 *
 * 用法：
 *   node scripts/sync-product-releases.mjs
 *   GITHUB_TOKEN=xxx node scripts/sync-product-releases.mjs
 *
 * 未认证时 GitHub 限流是 60 次/小时，本脚本每个产品只发一次请求，够用。
 */
import { writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/data/product-releases.json');

/** 与 src/data/product-changelog.ts 的 ChangelogProductId 保持一致 */
const REPOS = {
  xisland: 'Meteorkid/XIsland',
  xnook: 'Meteorkid/XNook',
};

/** 快照只留摘要，完整正文由运行时拉取。600 字足够判断这一版讲了什么。 */
const SUMMARY_LIMIT = 600;

async function fetchReleases(repo) {
  const response = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100`, {
    headers: {
      accept: 'application/vnd.github+json',
      'user-agent': 'meteor-store-sync-releases',
      ...(process.env.GITHUB_TOKEN
        ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`${repo}: GitHub ${response.status} ${await response.text()}`);
  }
  return response.json();
}

const output = {};
for (const [key, repo] of Object.entries(REPOS)) {
  const raw = await fetchReleases(repo);
  const entries = raw
    .filter((item) => !item.draft && item.tag_name)
    .map((item) => ({
      tag: item.tag_name,
      name: item.name || item.tag_name,
      published: (item.published_at || '').slice(0, 10),
      url: item.html_url,
      prerelease: Boolean(item.prerelease),
      summary: (item.body || '').trim().slice(0, SUMMARY_LIMIT),
    }))
    .sort((a, b) => b.published.localeCompare(a.published));
  output[key] = entries;
  console.log(`${key}: ${entries.length} 个版本，最新 ${entries[0]?.tag ?? '—'}`);
}

await writeFile(OUT, `${JSON.stringify(output, null, 1)}\n`, 'utf8');
console.log(`已写入 ${OUT}`);
