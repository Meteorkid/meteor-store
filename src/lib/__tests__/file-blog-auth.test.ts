import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const pageSource = readFileSync(
  join(process.cwd(), 'src/app/[locale]/blog/[slug]/page.tsx'),
  'utf8',
);

describe('站主文件文章的身份查询', () => {
  it('不为编辑链接在服务端重复读取会话', () => {
    expect(pageSource).not.toContain("from '@/lib/auth'");
    expect(pageSource).not.toContain('await getSession()');
    expect(pageSource).toContain('<AdminGithubEditLink');
  });
});
