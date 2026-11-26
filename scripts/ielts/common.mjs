/**
 * 雅思听力录音生产脚本的公共约定：仓库根、默认工作目录、slug 解析、.env.local 读取。
 *
 * 工作目录刻意放在仓库之外（Agent workspace 下）：逐句 mp3 是合成证据，不进 git，
 * 也不污染部署包。
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** 仓库根目录（scripts/ielts/ 的上两级）。 */
export const repoRoot = path.resolve(__dirname, '../..');

/** 离线合成产物的默认工作目录：逐句分片、整篇 mp3、meta.json、导出 JSON。 */
export const defaultWorkdir = path.join(
  '/Users/meteor/Library/Application Support/Doubao/Default/.doubao/agent_mode/workspace',
  'ielts-audio',
);

/** 课时 slug：test-NN-part-N。 */
export const SLUG_RE = /^test-\d{2}-part-[1-4]$/;

/** 音频对象 key：ielts-listening/{slug}/{transcriptHash}-{audioHash8}.mp3。 */
export const AUDIO_KEY_RE = /^ielts-listening\/test-\d{2}-part-[1-4]\/[a-f0-9]{16}-[a-f0-9]{8}\.mp3$/;

/**
 * 解析 `--only a,b,c` 形式的 slug 列表。
 * 不传时返回 null（表示全量）；空串视为未传。
 */
export function parseOnly(value) {
  if (value === undefined || value === null || value.trim() === '') return null;
  const slugs = value.split(',').map(item => item.trim()).filter(Boolean);
  for (const slug of slugs) {
    if (!SLUG_RE.test(slug)) throw new Error(`非法 slug：${slug}（应为 test-NN-part-N）`);
  }
  return slugs;
}

/**
 * 读取仓库根 `.env.local`（KEY=VALUE），合并进 process.env。
 * 已存在于环境变量的值不被覆盖；文件不存在时静默跳过。
 * 不做 shell 展开、不解析引号之外的复杂格式，R2 凭证都是纯字符值，够用。
 */
export function loadEnvFile(root = repoRoot) {
  const envPath = path.join(root, '.env.local');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}
