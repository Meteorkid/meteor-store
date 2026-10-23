'use client';

import { usePathname } from 'next/navigation';
import { buildAlternateUrls } from '@/lib/seo';

/** 布局会跨导航复用，通用SEO链接必须跟随当前路由，而非首次请求的路径。 */
export default function RouteAlternateLinks({ initialPathname }: { initialPathname?: string | null }) {
  const alternates = buildAlternateUrls(usePathname() ?? initialPathname);
  if (!alternates?.languages) return null;
  return <>
    <link rel="canonical" href={alternates.canonical} />
    <link rel="alternate" hrefLang="zh-CN" href={alternates.languages.zh} />
    <link rel="alternate" hrefLang="en" href={alternates.languages.en} />
    <link rel="alternate" hrefLang="x-default" href={alternates.languages.xDefault} />
  </>;
}
