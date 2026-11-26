/** 小红书内容工作台的纯数据类型；不能从这里导入数据库模块。 */

export type XiaohongshuSourceKind = 'daily' | 'post' | 'manual';
export type XiaohongshuStatus = 'draft' | 'ready' | 'published';

export interface XiaohongshuNote {
  id: string;
  title: string;
  body: string;
  tags: string[];
  /** 小红书图文笔记的图片；第一张就是封面 */
  images: string[];
  sourceKind: XiaohongshuSourceKind;
  /** 日刊日期、站内文章 id；手动笔记为 null */
  sourceRef: string | null;
  sourceUrl: string | null;
  status: XiaohongshuStatus;
  publishedAt: string | null;
  /** 手动发布后粘贴的笔记链接；不是平台同步结果 */
  publishedUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface XiaohongshuNoteInput {
  title: string;
  body: string;
  tags: string[];
  images: string[];
  sourceKind: XiaohongshuSourceKind;
  sourceRef: string | null;
  sourceUrl: string | null;
  status: XiaohongshuStatus;
  /** 只在 status=published 时写入；只作发布记录 */
  publishedUrl?: string | null;
}

export type XiaohongshuGenerateSource =
  | { kind: 'daily'; date: string }
  | { kind: 'post'; postId: string }
  | { kind: 'manual' };
