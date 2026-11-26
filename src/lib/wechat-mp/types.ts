/** 管理端日更工作台与最近草稿记录共用的纯数据类型；不能从这里导入服务端模块。 */

export interface WechatDailyQueueItem {
  date: string;
  /** 已发布且有标题的栏目数量 */
  count: number;
  /** 已发布栏目名称，最多取前三个 */
  channels: string[];
}

export interface WechatDraftHistoryItem {
  mediaId: string;
  sourceKey: string;
  title: string;
  createdAt: string;
}
