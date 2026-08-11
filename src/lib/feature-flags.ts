/**
 * 简易 Feature Flag 机制
 *
 * 优先级：环境变量 > flags 配置 > 默认值
 * - 环境变量 FEATURE_{FLAG_NAME} 设为 "true"/"false" 可覆盖
 * - 生产环境新增 flag 默认为 false（安全第一）
 * - 开发环境默认为 true
 */

type FlagName =
  | 'enablePricing'       // 定价区块
  | 'enableBlogSubmit'    // 读者投稿
  | 'enableInviteCodes'   // 邀请码
  | 'enableComments'      // 评论
  | 'enableNewsletter'    // 邮件订阅
  | 'enableStudentVerify' // 学生认证
  | 'enableNewHomepage';  // 新版首页

type FlagConfig = Record<FlagName, { default: boolean; description: string }>;

const flags: FlagConfig = {
  enablePricing:       { default: true,  description: '定价区块（首页 #pricing + 支付流程）' },
  enableBlogSubmit:    { default: true,  description: '读者投稿功能' },
  enableInviteCodes:   { default: true,  description: '邀请码创建与兑换' },
  enableComments:      { default: true,  description: '博客评论' },
  enableNewsletter:    { default: true,  description: '邮件订阅' },
  enableStudentVerify: { default: true,  description: '学生认证' },
  enableNewHomepage:   { default: false, description: '新版首页（开发中）' },
};

const isDev = process.env.NODE_ENV === 'development';

export function isFeatureEnabled(name: FlagName): boolean {
  // 1. 环境变量显式覆盖
  const envKey = `FEATURE_${name.replace(/[A-Z]/g, (c) => `_${c}`).toUpperCase()}`;
  const envVal = process.env[envKey];
  if (envVal === 'true') return true;
  if (envVal === 'false') return false;

  // 2. 配置默认值
  const flag = flags[name];
  if (!flag) return false;

  // 3. 开发环境宽松、生产环境严格
  if (isDev) return true;
  return flag.default;
}

export function getAllFlags(): Record<FlagName, boolean> {
  const result: Record<string, boolean> = {};
  for (const name of Object.keys(flags) as FlagName[]) {
    result[name] = isFeatureEnabled(name);
  }
  return result as Record<FlagName, boolean>;
}

export function getFlagDescription(name: FlagName): string {
  return flags[name]?.description ?? '未知 flag';
}
