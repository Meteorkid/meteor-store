/**
 * Meteor Pathfinder 免费资源库
 *
 * 所有资源均为公开免费可访问内容，模型只能返回此处定义的 id；
 * 服务端依据 id 映射为完整资源对象，模型不得自行编造 URL。
 *
 * lowBandwidth = true 表示该资源流量友好（文字为主或可离线缓存）。
 */

export interface PathfinderResource {
  /** 资源唯一标识，模型输出引用此 id */
  id: string;
  /** 资源名称 */
  name: string;
  /** 推荐原因（一句话） */
  reason: string;
  /** 真实可访问链接 */
  url: string;
  /** 是否低带宽友好 */
  lowBandwidth: boolean;
  /** 资源类型标签 */
  kind: '文档' | '视频' | '工具' | '社区' | '课程';
}

/**
 * 初版资源库：覆盖编程、数学、英语、写作、职业探索等方向
 * 全部为公开免费资源，未涉及付费课程或商业推广
 */
export const PATHFINDER_RESOURCES: PathfinderResource[] = [
  {
    id: 'mdn-web-docs',
    name: 'MDN Web Docs',
    reason: '权威且免费的 Web 开发文档，文字为主、流量友好，支持手机阅读',
    url: 'https://developer.mozilla.org/zh-CN/',
    lowBandwidth: true,
    kind: '文档',
  },
  {
    id: 'python-docs-zh',
    name: 'Python 官方中文文档',
    reason: 'Python 入门到进阶的权威资料，完全免费且可离线下载',
    url: 'https://docs.python.org/zh-cn/3/',
    lowBandwidth: true,
    kind: '文档',
  },
  {
    id: 'free-programming-books',
    name: 'free-programming-books',
    reason: '社区维护的免费编程书单，涵盖多语言与多方向',
    url: 'https://github.com/EbookFoundation/free-programming-books',
    lowBandwidth: true,
    kind: '文档',
  },
  {
    id: 'w3schools',
    name: 'W3Schools',
    reason: '交互式在线练习编程基础，手机浏览器可直接运行代码',
    url: 'https://www.w3schools.com/',
    lowBandwidth: false,
    kind: '课程',
  },
  {
    id: 'khan-academy',
    name: '可汗学院中文版',
    reason: '免费数学与科学视频课程，支持按基础水平分级学习',
    url: 'https://zh.khanacademy.org/',
    lowBandwidth: false,
    kind: '视频',
  },
  {
    id: 'chinese-mooc',
    name: '中国大学 MOOC',
    reason: '国内高校公开课合集，免费旁听大学课程',
    url: 'https://www.icourse163.org/',
    lowBandwidth: false,
    kind: '课程',
  },
  {
    id: 'stack-overflow',
    name: 'Stack Overflow',
    reason: '程序员问答社区，遇到具体问题可搜索解决方案',
    url: 'https://stackoverflow.com/',
    lowBandwidth: true,
    kind: '社区',
  },
  {
    id: 'leetcode-cn',
    name: '力扣（LeetCode 中国）',
    reason: '免费题库练习编程题，支持手机端刷题',
    url: 'https://leetcode.cn/',
    lowBandwidth: false,
    kind: '工具',
  },
  {
    id: 'duolingo',
    name: '多邻国',
    reason: '游戏化英语学习，碎片时间可用，免费版功能充足',
    url: 'https://www.duolingo.cn/',
    lowBandwidth: false,
    kind: '工具',
  },
  {
    id: 'github-skills',
    name: 'GitHub Skills',
    reason: 'GitHub 官方推出的免费交互式学习课程，覆盖 Git 与多门语言',
    url: 'https://skills.github.com/',
    lowBandwidth: true,
    kind: '课程',
  },
];

/** 资源 id → 资源对象映射，供服务端使用 */
export const RESOURCE_MAP: ReadonlyMap<string, PathfinderResource> = new Map(
  PATHFINDER_RESOURCES.map((r) => [r.id, r]),
);

/** 合法资源 id 集合，供 Zod 校验 */
export const RESOURCE_IDS = PATHFINDER_RESOURCES.map((r) => r.id);

/** 根据模型返回的 id 列表解析为完整资源对象，过滤非法 id */
export function resolveResources(ids: string[]): PathfinderResource[] {
  const seen = new Set<string>();
  const out: PathfinderResource[] = [];
  for (const id of ids) {
    const res = RESOURCE_MAP.get(id);
    if (res && !seen.has(id)) {
      seen.add(id);
      out.push(res);
    }
  }
  return out;
}
