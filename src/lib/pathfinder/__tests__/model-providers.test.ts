import { describe, expect, it } from 'vitest';
import {
  getTrustedModelProvider,
  MODEL_PROVIDER_GROUPS,
  TRUSTED_MODEL_PROVIDERS,
} from '../model-providers';

describe('getTrustedModelProvider', () => {
  it('接受全部白名单服务商及其末尾斜杠', () => {
    expect(TRUSTED_MODEL_PROVIDERS).toHaveLength(20);

    for (const provider of TRUSTED_MODEL_PROVIDERS) {
      expect(getTrustedModelProvider(provider.baseUrl)).toMatchObject({ id: provider.id });
      expect(getTrustedModelProvider(`${provider.baseUrl}/`)).toMatchObject({ id: provider.id });
      expect(new URL(provider.docsUrl).protocol).toBe('https:');
    }
  });

  it('为每个下拉分组提供至少一个服务商', () => {
    for (const group of MODEL_PROVIDER_GROUPS) {
      expect(TRUSTED_MODEL_PROVIDERS.some((provider) => provider.group === group)).toBe(true);
    }
  });

  it('拒绝任意域名、相似路径、查询参数和片段', () => {
    expect(getTrustedModelProvider('https://api.example.com/v1')).toBeNull();
    expect(getTrustedModelProvider('https://api.deepseek.com?target=internal')).toBeNull();
    expect(getTrustedModelProvider('https://api.siliconflow.cn/v1#fragment')).toBeNull();
    expect(getTrustedModelProvider('https://api.openai.com/v1/extra')).toBeNull();
    expect(getTrustedModelProvider('https://api.openai.com.evil.example/v1')).toBeNull();
  });
});
