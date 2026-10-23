import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { SITE_URL } from '@/lib/constants';
const route = vi.hoisted(() => ({ pathname: '/zh/blog' as string | null }));
vi.mock('next/navigation', () => ({ usePathname: () => route.pathname }));
import RouteAlternateLinks from '../RouteAlternateLinks';

describe('持久布局的SEO声明跟随路由', () => {
  it('原生路径尚未就绪时服务端仍输出初始canonical，随后不复用旧地址', () => {
    route.pathname = null;
    expect(renderToStaticMarkup(<RouteAlternateLinks initialPathname="/zh/products/statux" />))
      .toContain(`href="${SITE_URL}/zh/products/statux"`);
    route.pathname = '/en/blog/tag/Shared';
    expect(renderToStaticMarkup(<RouteAlternateLinks initialPathname="/zh/products/statux" />)).toBe('');
  });
  it('普通页进入内容页时撤掉通用声明，离开后使用新地址', () => {
    route.pathname = '/zh/blog';
    expect(renderToStaticMarkup(<RouteAlternateLinks />)).toContain(`href="${SITE_URL}/zh/blog"`);
    for (const pathname of ['/zh/blog/p/post-1', '/zh/blog/tag/Shared']) {
      route.pathname = pathname;
      expect(renderToStaticMarkup(<RouteAlternateLinks />)).toBe('');
    }
    route.pathname = '/en/products/statux';
    const html = renderToStaticMarkup(<RouteAlternateLinks />);
    expect(html).toContain(`href="${SITE_URL}/en/products/statux"`);
    expect(html).not.toContain('/zh/blog');
    expect(html.match(/rel="canonical"/g)).toHaveLength(1);
    expect(html.match(/hrefLang=/g)).toHaveLength(3);
  });
});
