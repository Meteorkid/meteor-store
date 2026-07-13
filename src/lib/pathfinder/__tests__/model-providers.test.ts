import { describe, expect, it } from 'vitest';
import { getTrustedModelProvider } from '../model-providers';

describe('getTrustedModelProvider', () => {
  it('接受白名单服务商及其末尾斜杠', () => {
    expect(getTrustedModelProvider('https://api.deepseek.com/')).toMatchObject({ id: 'deepseek' });
    expect(getTrustedModelProvider('https://api.openai.com/v1/')).toMatchObject({ id: 'openai' });
  });

  it('拒绝任意域名、查询参数和片段', () => {
    expect(getTrustedModelProvider('https://api.example.com/v1')).toBeNull();
    expect(getTrustedModelProvider('https://api.deepseek.com?target=internal')).toBeNull();
    expect(getTrustedModelProvider('https://api.siliconflow.cn/v1#fragment')).toBeNull();
  });
});
