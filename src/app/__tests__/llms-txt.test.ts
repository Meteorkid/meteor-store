import { describe, expect, it } from 'vitest';
import { products } from '@/data/products';
import { blogSections } from '@/data/blog-sections';
import { helpArticles, isHelpArticleVisible } from '@/data/help-articles';
import { SITE_URL } from '@/lib/constants';
import { GET } from '../llms.txt/route';

async function fetchText(): Promise<string> {
  const response = GET();
  expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
  return response.text();
}

describe('/llms.txt', () => {
  it('以 text/plain 下发，且标明本文件会随数据更新', async () => {
    const response = GET();
    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
    expect(response.headers.get('cache-control')).toContain('max-age=3600');
    const body = await response.text();
    // 首行必须是 H1 站点名，这是 llms.txt 约定的第一条结构
    expect(body.startsWith('# Meteor Store')).toBe(true);
    // 引用块摘要
    expect(body).toContain('> ');
  });

  it('列出全部产品，且每个地址都是绝对 URL', async () => {
    const body = await fetchText();
    for (const product of products) {
      expect(body).toContain(`${SITE_URL}/zh/products/${product.id}`);
    }
    // 相对地址对 agent 没有意义，必须绝对
    expect(body).not.toMatch(/\]\(\/(?:zh|en)\//);
  });

  it('coming_soon 的产品要标注状态，不能当作在售', async () => {
    const body = await fetchText();
    const comingSoon = products.filter((product) => product.status === 'coming_soon');
    for (const product of comingSoon) {
      const line = body.split('\n').find((row) => row.includes(`/products/${product.id}`));
      expect(line).toContain('即将推出');
    }
  });

  it('列出全部博客分区', async () => {
    const body = await fetchText();
    for (const section of blogSections) {
      expect(body).toContain(`/zh/blog/section/${section.slug}`);
    }
  });

  it('文档只列重点，不退化成第二个 sitemap', async () => {
    const body = await fetchText();
    const visible = helpArticles.filter((article) => isHelpArticleVisible(article, true));
    // 有收录上限，所以文档链接数必须严格少于全量
    const listed = visible.filter((article) => body.includes(`/zh/docs/${article.slug}`));
    expect(listed.length).toBeGreaterThan(0);
    expect(listed.length).toBeLessThan(visible.length);
  });

  it('指引读者去 sitemap 取全量清单', async () => {
    const body = await fetchText();
    expect(body).toContain(`${SITE_URL}/sitemap.xml`);
  });

  it('XIsland 的集成机制用散文写清楚，并指向逐条拆解的文档', async () => {
    const body = await fetchText();
    // agent 读到的必须是「怎么接起来的」，而不是只有 30 行客户端名单
    expect(body).toContain('di-bridge');
    expect(body).toContain('Unix socket');
    expect(body).toContain('Claude Code hooks');
    // 链接从数据推导，文章改名或被过滤时这一段应当整体消失
    expect(body).toContain(`${SITE_URL}/zh/docs/xisland-agent-hooks`);
  });
});
