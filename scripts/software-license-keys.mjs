#!/usr/bin/env node
import { createPrivateKey, createPublicKey, generateKeyPairSync } from 'node:crypto';
import { readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const [command, keyPath] = process.argv.slice(2);
if (!keyPath || !isAbsolute(keyPath) || !['generate', 'public'].includes(command)) {
  console.error('用法：node scripts/software-license-keys.mjs generate|public /绝对路径/private.pem');
  process.exit(1);
}
let privateKey;
if (command === 'generate') {
  const repository = realpathSync(fileURLToPath(new URL('../', import.meta.url)));
  const parent = realpathSync(dirname(keyPath));
  const inside = relative(repository, parent);
  if (!inside || (!inside.startsWith('..' + '/') && inside !== '..' && !isAbsolute(inside))) {
    throw new Error('私钥必须生成在仓库外的目录');
  }
  privateKey = generateKeyPairSync('ed25519').privateKey;
  // wx 不覆盖已有密钥；只将私钥写入指定文件，不输出到日志。
  writeFileSync(keyPath, privateKey.export({ type: 'pkcs8', format: 'pem' }), { mode: 0o600, flag: 'wx' });
} else {
  privateKey = createPrivateKey(readFileSync(keyPath));
  if (privateKey.asymmetricKeyType !== 'ed25519') throw new Error('需要 Ed25519 私钥');
}
const raw = createPublicKey(privateKey).export({ type: 'spki', format: 'der' }).subarray(-32).toString('base64');
console.log(`SOFTWARE_LICENSE_PUBLIC_KEY=${raw}`);
