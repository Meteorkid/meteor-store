import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('global-error 不把整包翻译带进客户端', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/app/global-error.tsx'), 'utf8');

  it('只保留错误页自身的三句文案', () => {
    expect(source).not.toMatch(/messages\/(?:zh|en)\.json/);
    expect(source).toContain('应用出错了');
    expect(source).toContain('Application Error');
  });
});
