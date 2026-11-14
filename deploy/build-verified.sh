#!/usr/bin/env bash
# 发布构建必须读到真实数据；降级页面不能因为 next build 退出0而被上传。
set -euo pipefail
[[ -n "${DATABASE_URL:-}" ]] || { echo 'ERROR: 发布构建缺少 DATABASE_URL' >&2; exit 1; }
export PGOPTIONS="${PGOPTIONS:+$PGOPTIONS }-c default_transaction_read_only=on -c transaction_read_only=on"
export PGAPPNAME=meteor-store-build
export METEOR_BUILD_DB_POOL_SIZE=2

node --input-type=module <<'NODE'
import pg from 'pg';
let client;
try {
  client = new pg.Client({ connectionString: process.env.DATABASE_URL, options: process.env.PGOPTIONS, application_name: process.env.PGAPPNAME });
  await client.connect();
  const defaults = (await client.query('SHOW default_transaction_read_only')).rows[0].default_transaction_read_only;
  const transaction = (await client.query('SHOW transaction_read_only')).rows[0].transaction_read_only;
  const applicationName = (await client.query('SHOW application_name')).rows[0].application_name;
  if (defaults !== 'on' || transaction !== 'on' || applicationName !== 'meteor-store-build') throw new Error('invalid-build-session');
  console.log('构建数据库只读验证通过：default_transaction_read_only=on, transaction_read_only=on, application_name=meteor-store-build');
} catch {
  console.error('ERROR: 构建数据库只读预检失败，停止构建');
  process.exitCode = 1;
} finally { await client?.end(); }
NODE

build_log=$(mktemp "${TMPDIR:-/tmp}/meteor-store-build-XXXXXXXX")
chmod 600 "$build_log"
echo "构建日志保留于：$build_log"
if ! pnpm build 2>&1 | tee "$build_log"; then
  echo 'ERROR: 构建退出非零，保留产物和日志，不允许上传' >&2
  exit 1
fi
if grep -Eiq 'Failed query:|remaining connection slots|too many clients|读取投稿失败|雅思对照读取失败|数据库连接池错误' "$build_log"; then
  echo 'ERROR: 构建出现数据库读取错误或内容降级，不允许上传' >&2
  exit 1
fi
[[ -s .next/BUILD_ID && -s .next/server/app/sitemap.xml.body ]] || {
  echo 'ERROR: 构建缺少必要产物，不允许上传' >&2
  exit 1
}
