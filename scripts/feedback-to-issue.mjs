#!/usr/bin/env node
/**
 * 反馈 → GitHub Issue 转换脚本
 * 
 * 用法：
 *   node scripts/feedback-to-issue.mjs --feedback-id=42
 *   node scripts/feedback-to-issue.mjs --feedback-id=42 --type=feature
 *   node scripts/feedback-to-issue.mjs --feedback-id=42 --dry-run
 * 
 * 前提：
 *   - 安装 GitHub CLI: brew install gh && gh auth login
 *   - 需要 Neon 数据库连接（DATABASE_URL 环境变量）
 */

import { parseArgs } from 'node:util';
import { neon } from '@neondatabase/serverless';

const REPO = 'Meteorkid/meteor-store';

const { values } = parseArgs({
  options: {
    'feedback-id': { type: 'string' },
    'type': { type: 'string', default: 'bug' },
    'dry-run': { type: 'boolean', default: false },
  },
});

if (!values['feedback-id']) {
  console.error('用法: node scripts/feedback-to-issue.mjs --feedback-id=<id>');
  process.exit(1);
}

const feedbackId = parseInt(values['feedback-id'], 10);
const issueType = values.type;
const dryRun = values['dry-run'];

// 连接数据库
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('请设置 DATABASE_URL 环境变量');
  process.exit(1);
}
const sql = neon(dbUrl);

async function main() {
  // 查询反馈记录
  const [feedback] = await sql`
    SELECT id, email, type, content, status, created_at
    FROM feedbacks
    WHERE id = ${feedbackId}
  `;

  if (!feedback) {
    console.error(`反馈 #${feedbackId} 不存在`);
    process.exit(1);
  }

  if (feedback.status === 'resolved') {
    console.log('⚠️  该反馈已处理，如需重新创建 Issue，请手动操作');
    if (!dryRun) process.exit(0);
  }

  // 构建 Issue 内容
  const email = feedback.email || '匿名用户';
  const date = new Date(feedback.created_at).toISOString().split('T')[0];
  const content = feedback.content.substring(0, 3000); // 截断过长内容

  const title = issueType === 'bug'
    ? `[Bug] 用户反馈：${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`
    : `[Feature] 用户建议：${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`;

  const labels = issueType === 'bug' ? ['bug', 'user-feedback'] : ['enhancement', 'user-feedback'];

  const body = `## 用户反馈

> 来自：${email} | 日期：${date} | 类型：${feedback.type}

${content}

---

*此 Issue 由反馈 #${feedbackId} 自动生成。管理员请补充技术细节和复现步骤。*`;

  if (dryRun) {
    console.log('=== Dry Run ===');
    console.log(`标题: ${title}`);
    console.log(`标签: ${labels.join(', ')}`);
    console.log(`内容:\n${body}`);
    return;
  }

  // 通过 GitHub CLI 创建 Issue
  const { execSync } = await import('node:child_process');

  try {
    const cmd = `gh issue create --repo "${REPO}" --title "${title}" --body "${body.replace(/"/g, '\\"')}" --label "${labels.join(',')}"`;
    const output = execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' });
    console.log(`✅ Issue 已创建: ${output.trim()}`);
  } catch (err) {
    console.error('❌ 创建 Issue 失败:', err.message);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('脚本执行失败:', err);
  process.exit(1);
});
