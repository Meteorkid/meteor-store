import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function resolveLocalModule(specifier: string, fromFile: string): string | null {
  let base: string;
  if (specifier.startsWith('@/')) base = path.join(root, 'src', specifier.slice(2));
  else if (specifier.startsWith('.')) base = path.resolve(path.dirname(fromFile), specifier);
  else return null;
  for (const suffix of ['.ts', '.tsx']) {
    if (fs.existsSync(base + suffix)) return base + suffix;
  }
  for (const suffix of ['/index.ts', '/index.tsx']) {
    if (fs.existsSync(base + suffix)) return base + suffix;
  }
  return null;
}

function staticImports(file: string): string[] {
  const source = fs.readFileSync(file, 'utf8');
  return [...source.matchAll(/^(?:import|export)\s+(?!type\b)[^;]*?from\s+['"]([^'"]+)['"]/gm)]
    .map(match => match[1]);
}

function walk(entry: string): string[] {
  const seen = new Set<string>();
  const queue = [entry];
  while (queue.length) {
    const file = queue.shift()!;
    if (seen.has(file)) continue;
    seen.add(file);
    for (const specifier of staticImports(file)) {
      const next = resolveLocalModule(specifier, file);
      if (next && !seen.has(next)) queue.push(next);
    }
  }
  return [...seen];
}

describe('Header 客户端依赖边界', () => {
  it('静态依赖链不引入 zod，避免 283KB 校验库进入全站首屏共享包', () => {
    const files = walk(path.join(root, 'src/components/Header.tsx'));
    const offenders = files.filter(file => /from ['"]zod['"]/.test(fs.readFileSync(file, 'utf8')));
    expect(offenders.map(file => path.relative(root, file))).toEqual([]);
  });

  it('监控 zod 解析器只允许按需动态导入', () => {
    const client = fs.readFileSync(path.join(root, 'src/lib/monitoring-client.ts'), 'utf8');
    expect(client).toMatch(/import\('\.\/monitoring-types'\)/);
    expect(client).not.toMatch(/import\s*\{[^}]*parseMonitoringResponse[^}]*\}\s*from\s*'\.\/monitoring-types'/);
  });
});
