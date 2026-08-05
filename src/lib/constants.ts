// 全局业务常量

/** 站点规范地址，用于 sitemap、RSS 等需要绝对 URL 的场景 */
export const SITE_URL = 'https://www.imagentx.top';

/** 年付折扣率（月价 × 0.8 × 12 = 年价） */
export const ANNUAL_DISCOUNT = 0.8;

/**
 * 是否显示价格/购买/支付相关内容
 * ICP 个人备案期间设为 false，备案通过后改为 true
 */
export const SHOW_PRICING = process.env.NEXT_PUBLIC_SHOW_PRICING === 'true';

/**
 * 经营主体信息，用于备案公示与《电子商务法》第 15 条亮照经营。
 *
 * 这是全站唯一数据源——页脚、/contact、/terms、/privacy 都从这里取，
 * 不要再往 i18n 里塞主体信息的值（i18n 只放标签文案）。
 * 空字符串表示该项尚未取得，对应的展示行不渲染：宁可不显示，
 * 也不要把占位符挂到线上，管局会按「信息不实」驳回备案。
 *
 * 经营者姓名属个人隐私，公示不需要，也不要登记在这里。
 *
 * 名称与信用代码必须与工商登记**逐字符一致**（括号用全角 `（）`）：
 * 管局走工商接口比对，差一个字符就会以「证件真实性核验未通过」驳回。
 * 信用代码填进来之前先过一遍 GB 32100 校验位，别照着执照图片认字。
 */
export const OPERATOR = {
  /** 营业执照名称（工商登记全称，含类型后缀） */
  name: '广州市番禺区流星软件店（个体工商户）',
  /** 统一社会信用代码（GB 32100 校验位已核） */
  creditCode: '92440113MAKL668E7K',
  /**
   * 对外公示的经营地址。
   * 执照「经营场所」登记的是网络经营场所，印在证面上的首项是拼多多店铺，
   * 后接「等」——完整列表以 gsxt.gov.cn 公示为准。待确认 imagentx.top
   * 是否已在登记列表内再填，不确认前留空（宁可不显示也不挂不实信息）。
   */
  address: '',
  /** ICP 备案号，链接工信部 beian.miit.gov.cn */
  icp: '粤ICP备2026089905号',
  /** 公安联网备案号，ICP 备案通过后 30 日内办理 */
  police: '',
  /** 争议管辖法院所在地 */
  jurisdiction: '广州市番禺区',
} as const;

/** 产品分类颜色映射 */
export const categoryColors: Record<string, string> = {
  developer: 'text-blue-400 bg-blue-400/10',
  ai: 'text-purple-400 bg-purple-400/10',
  design: 'text-pink-400 bg-pink-400/10',
  utility: 'text-emerald-400 bg-emerald-400/10',
};

/** 产品分类中文标签 */
export const categoryLabels: Record<string, string> = {
  developer: '开发者工具',
  ai: 'AI 工具',
  design: '设计工具',
  utility: '实用工具',
};
