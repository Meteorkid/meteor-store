/**
 * 服务端允许转发的 OpenAI Chat Completions 兼容服务。
 * 白名单是阻断 SSRF 的安全边界，不接受任意用户输入的 URL。
 */
export const TRUSTED_MODEL_PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com',
  },
  {
    id: 'siliconflow',
    name: 'SiliconFlow',
    baseUrl: 'https://api.siliconflow.cn/v1',
  },
] as const;

export type TrustedModelProvider = (typeof TRUSTED_MODEL_PROVIDERS)[number];

/** 仅接受白名单中的完整 Base URL；统一忽略末尾斜杠。 */
export function getTrustedModelProvider(baseUrl: string): TrustedModelProvider | null {
  const normalized = normalizeBaseUrl(baseUrl);
  if (!normalized) return null;

  return TRUSTED_MODEL_PROVIDERS.find((provider) => provider.baseUrl === normalized) ?? null;
}

function normalizeBaseUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) {
      return null;
    }

    const path = url.pathname.replace(/\/+$/, '');
    return `${url.origin}${path}`;
  } catch {
    return null;
  }
}
