/**
 * 中文标签在英文页的展示名。
 *
 * 标签的 key、URL 与筛选仍使用原文，只有展示文本换成英文：同一个标签在中英文
 * 页面必须指向同一个归档，不能因为换语言就分裂成两个标签页。
 * 未收录的标签保持原文，避免为内容标签编造译名。
 */
const BLOG_TAG_LABELS_EN: Record<string, string> = {
  大学生: 'University students',
  法律: 'Law',
  反爬: 'Anti-scraping',
  家庭: 'Family',
  开源: 'Open source',
  民法典: 'Civil Code',
  爬虫: 'Web crawling',
  医学: 'Medicine',
  写作: 'Writing',
};

export function localizedBlogTag(label: string, locale: string): string {
  return locale === 'en' ? BLOG_TAG_LABELS_EN[label] ?? label : label;
}
