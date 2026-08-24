import { describe, expect, it } from 'vitest';
import {
  canAutoPublishPathfinderSource,
  canPublishPathfinderItemForLearning,
} from '../admin-catalog';
import { PATHFINDER_SYNC_SOURCES } from '../ingestion/sources';

describe('Pathfinder 自动发布白名单', () => {
  it('只允许代码配置中默认开启自动发布的官方来源', () => {
    const allowedSources = PATHFINDER_SYNC_SOURCES.filter((source) => (
      source.trustLevel === 'official' && source.autoPublish
    ));

    expect(allowedSources.map((source) => source.id)).toEqual([
      'openai-news',
      'google-deepmind-blog',
      'google-ai-blog',
      'github-ai-blog',
    ]);
    for (const source of allowedSources) {
      expect(canAutoPublishPathfinderSource(source.id)).toBe(true);
    }
  });

  it.each([
    'hugging-face-blog',
    'github-good-first-issues',
    'unknown-source',
  ])('拒绝非自动发布官方白名单来源：%s', (sourceId) => {
    expect(canAutoPublishPathfinderSource(sourceId)).toBe(false);
  });
});

describe('Pathfinder 学习路径发布门槛', () => {
  it('服务端禁止规则推断的 GitHub 条目和 AI 动态进入路径', () => {
    expect(canPublishPathfinderItemForLearning('github-good-first-issues', 'open-source')).toBe(false);
    expect(canPublishPathfinderItemForLearning('openai-news', 'ai-update')).toBe(false);
    expect(canPublishPathfinderItemForLearning('manual-official', 'competition')).toBe(true);
  });
});
