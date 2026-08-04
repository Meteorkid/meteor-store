import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const wrapper = readFileSync(join(process.cwd(), 'src/components/SpotlightSearch.tsx'), 'utf8');

describe('Spotlight 搜索按需加载', () => {
  it('根布局挂载的包装器不静态引入搜索索引或拼音库', () => {
    expect(wrapper).not.toContain("from '@/lib/search-index'");
    expect(wrapper).not.toContain("from 'pinyin-pro'");
    expect(wrapper).toContain("import('./SpotlightSearchPanel')");
  });
});
