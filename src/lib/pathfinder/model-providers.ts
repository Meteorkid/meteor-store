/**
 * 服务端允许转发的 OpenAI Chat Completions 兼容服务。
 * 白名单是阻断 SSRF 的安全边界，不接受任意用户输入的 URL。
 */
export const MODEL_PROVIDER_GROUPS = ['国内与区域服务', '国际服务'] as const;

export type ModelProviderGroup = (typeof MODEL_PROVIDER_GROUPS)[number];

export const TRUSTED_MODEL_PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    group: '国际服务',
    docsUrl: 'https://platform.openai.com/docs/api-reference/chat',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com',
    group: '国内与区域服务',
    docsUrl: 'https://api-docs.deepseek.com/',
  },
  {
    id: 'siliconflow',
    name: 'SiliconFlow',
    baseUrl: 'https://api.siliconflow.cn/v1',
    group: '国内与区域服务',
    docsUrl: 'https://docs.siliconflow.cn/en/api-reference/chat-completions/chat-completions',
  },
  {
    id: 'dashscope-cn',
    name: '阿里云百炼（中国）',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    group: '国内与区域服务',
    docsUrl: 'https://help.aliyun.com/en/model-studio/base-url',
  },
  {
    id: 'dashscope-intl',
    name: '阿里云百炼（国际）',
    baseUrl: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
    group: '国内与区域服务',
    docsUrl: 'https://help.aliyun.com/en/model-studio/base-url',
  },
  {
    id: 'zhipu',
    name: '智谱 AI',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    group: '国内与区域服务',
    docsUrl: 'https://docs.bigmodel.cn/cn/guide/develop/http/introduction',
  },
  {
    id: 'minimax-cn',
    name: 'MiniMax（中国）',
    baseUrl: 'https://api.minimaxi.com/v1',
    group: '国内与区域服务',
    docsUrl: 'https://platform.minimaxi.com/document/%E5%AF%B9%E8%AF%9D?key=66701d281d57f38758d581d0',
  },
  {
    id: 'minimax-intl',
    name: 'MiniMax（国际）',
    baseUrl: 'https://api.minimax.io/v1',
    group: '国内与区域服务',
    docsUrl: 'https://platform.minimax.io/docs/api-reference/api-overview',
  },
  {
    id: 'volcengine-ark',
    name: '火山方舟',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    group: '国内与区域服务',
    docsUrl: 'https://www.volcengine.com/docs/82379/1925114',
  },
  {
    id: 'tencent-hunyuan',
    name: '腾讯混元',
    baseUrl: 'https://api.hunyuan.cloud.tencent.com/v1',
    group: '国内与区域服务',
    docsUrl: 'https://cloud.tencent.com/document/product/1729/111007',
  },
  {
    id: 'google-gemini',
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    group: '国际服务',
    docsUrl: 'https://ai.google.dev/gemini-api/docs/openai',
  },
  {
    id: 'xai',
    name: 'xAI Grok',
    baseUrl: 'https://api.x.ai/v1',
    group: '国际服务',
    docsUrl: 'https://docs.x.ai/developers/rest-api-reference/inference/chat',
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1',
    group: '国际服务',
    docsUrl: 'https://docs.mistral.ai/api',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    group: '国际服务',
    docsUrl: 'https://openrouter.ai/docs/quickstart',
  },
  {
    id: 'groq',
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    group: '国际服务',
    docsUrl: 'https://console.groq.com/docs/openai',
  },
  {
    id: 'together',
    name: 'Together AI',
    baseUrl: 'https://api.together.ai/v1',
    group: '国际服务',
    docsUrl: 'https://docs.together.ai/docs/inference/openai-compatibility',
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    group: '国际服务',
    docsUrl: 'https://docs.fireworks.ai/tools-sdks/openai-compatibility',
  },
  {
    id: 'nvidia-nim',
    name: 'NVIDIA NIM',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    group: '国际服务',
    docsUrl: 'https://docs.api.nvidia.com/nim/reference/openai-gpt-oss-120b-infer',
  },
  {
    id: 'cerebras',
    name: 'Cerebras',
    baseUrl: 'https://api.cerebras.ai/v1',
    group: '国际服务',
    docsUrl: 'https://inference-docs.cerebras.ai/resources/openai',
  },
  {
    id: 'deepinfra',
    name: 'DeepInfra',
    baseUrl: 'https://api.deepinfra.com/v1/openai',
    group: '国际服务',
    docsUrl: 'https://docs.deepinfra.com/chat/overview',
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
