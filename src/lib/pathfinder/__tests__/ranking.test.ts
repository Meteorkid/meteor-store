import { describe, expect, it } from 'vitest';

import { rankCatalogItems } from '../ranking';
import { catalogItemFixture, profileFixture } from './fixtures';

const now = new Date('2026-08-24T00:00:00.000Z');

describe('rankCatalogItems', () => {
  it('只返回现实条件允许的已发布学习条目', () => {
    const allowed = catalogItemFixture({ id: 'allowed' });
    const expired = catalogItemFixture({ id: 'expired', deadlineAt: '2026-08-01T00:00:00.000Z' });
    const aiUpdate = catalogItemFixture({ id: 'news', itemType: 'ai-update' });
    const wrongDirection = catalogItemFixture({ id: 'frontend', direction: 'frontend' });

    expect(rankCatalogItems([expired, aiUpdate, wrongDirection, allowed], profileFixture, { now })
      .map(({ item }) => item.id)).toEqual(['allowed']);
  });

  it('目标类型、基础、可信度与用户指定起点共同参与稳定排序', () => {
    const verifiedProject = catalogItemFixture({
      id: 'verified-project',
      source: { ...catalogItemFixture().source, trustLevel: 'verified' },
    });
    const competition = catalogItemFixture({ id: 'competition', itemType: 'competition' });
    const preferred = catalogItemFixture({ id: 'preferred', difficulty: 'intermediate' });

    const first = rankCatalogItems(
      [competition, verifiedProject, preferred],
      profileFixture,
      { now, preferredItemId: 'preferred' },
    );
    const second = rankCatalogItems(
      [preferred, competition, verifiedProject],
      profileFixture,
      { now, preferredItemId: 'preferred' },
    );

    expect(first[0].item.id).toBe('preferred');
    expect(second.map(({ item }) => item.id)).toEqual(first.map(({ item }) => item.id));
  });

  it('零基础不会仅靠软打分进入中高级实践，初学者也不会直接进入高级条目', () => {
    const beginner = catalogItemFixture({ id: 'beginner', difficulty: 'beginner' });
    const intermediate = catalogItemFixture({ id: 'intermediate', difficulty: 'intermediate' });
    const advanced = catalogItemFixture({ id: 'advanced', difficulty: 'advanced' });

    expect(rankCatalogItems(
      [advanced, intermediate, beginner],
      { ...profileFixture, foundation: 'none' },
      { now },
    ).map(({ item }) => item.id)).toEqual(['beginner']);
    expect(rankCatalogItems(
      [advanced, intermediate, beginner],
      { ...profileFixture, foundation: 'beginner' },
      { now },
    ).map(({ item }) => item.id)).not.toContain('advanced');
  });

  it('自由文本目标会让 RAG 与图像方向选择不同的优先资源', () => {
    const langchain = catalogItemFixture({
      id: 'langchain',
      title: { zh: 'LangChain', en: 'LangChain' },
      summary: { zh: '用于大模型检索与智能体工程', en: 'LLM retrieval and agent framework' },
      tags: { topic: ['llm-apps'], skill: ['retrieval'], career: ['ai'], format: ['repository'] },
    });
    const transformers = catalogItemFixture({
      id: 'transformers',
      title: { zh: 'Transformers', en: 'Transformers' },
      summary: { zh: '覆盖文本、视觉与多模态任务', en: 'Text, vision, and multimodal tasks' },
      tags: { topic: ['foundation-models'], skill: ['transformers'], career: ['ai'], format: ['repository'] },
    });

    const rag = rankCatalogItems([transformers, langchain], { ...profileFixture, goal: '完成一个 RAG 知识库问答' }, { now });
    const vision = rankCatalogItems([langchain, transformers], { ...profileFixture, goal: '完成一个图像分类项目' }, { now });

    expect(rag[0].item.id).toBe('langchain');
    expect(vision[0].item.id).toBe('transformers');
  });
});
