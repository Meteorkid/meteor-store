/**
 * 公告的浏览器安全部分：类型定义与纯展示逻辑。
 *
 * 客户端组件只能从这里导入运行时值。`announcements.ts` 顶部 `import { db }`，
 * 而 `db/index.ts` 在模块级建 Proxy（有副作用）、package.json 也没有 `sideEffects: false`，
 * 打包器摇不掉——从那里导入哪怕只是一个纯函数，都会把 drizzle-orm 与
 * @neondatabase/serverless 打进客户端 bundle（NotificationBell 挂在 Header，全站生效）。
 */

export interface Announcement {
  id: string;
  titleZh: string | null;
  titleEn: string | null;
  bodyZh: string | null;
  bodyEn: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** 按当前语言取标题/正文，缺失时回退到另一语言。 */
export function pickAnnouncementText(
  valueZh: string | null | undefined,
  valueEn: string | null | undefined,
  locale: string,
): string {
  if (locale === 'en') return valueEn || valueZh || '';
  return valueZh || valueEn || '';
}
