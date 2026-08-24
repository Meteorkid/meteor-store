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
      // 雇主自己的职位板：内容是事实性岗位信息，但资格由解析层强制标为需人工核对
      'databricks-student-jobs',
      'scale-ai-student-jobs',
    ]);
    for (const source of allowedSources) {
      expect(canAutoPublishPathfinderSource(source.id)).toBe(true);
    }
  });

  it('已策展仓库的 issue 可以进入学习路径，泛 GitHub 搜索不行', () => {
    // 前者的方向与难度由目录里那条仓库条目背书，后者只能靠标题猜
    expect(canPublishPathfinderItemForLearning('curated-issues-ai', 'open-source')).toBe(true);
    expect(canPublishPathfinderItemForLearning('github-good-first-issues', 'open-source')).toBe(false);
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
