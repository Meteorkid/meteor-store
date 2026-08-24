import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/constants';
import {
  PATHFINDER_DIFFICULTIES,
  PATHFINDER_DIRECTIONS,
  PATHFINDER_ITEM_TYPES,
  PATHFINDER_REMOTE_STATUSES,
} from '@/lib/pathfinder/catalog-types';
import { CATALOG_SORTS } from '@/lib/pathfinder/catalog-view';

/**
 * Pathfinder v1 的机器合约。
 *
 * 枚举值全部从类型定义推导，不手写第二份——手抄的枚举会在加类型时悄悄过期，
 * 而过期的合约比没有合约更糟：调用方会照着它写死分支。
 */
export const dynamic = 'force-static';

export async function GET() {
  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'Meteor Pathfinder API',
      version: '1.0.0',
      description: '面向大学生的竞赛、实习、开源任务与 AI 动态目录。只读、公开、无需鉴权；每条内容都保留官方来源与核验时间。',
    },
    servers: [{ url: `${SITE_URL}/api/v1/pathfinder` }],
    paths: {
      '/items': {
        get: {
          summary: '列出已发布条目',
          parameters: [
            enumParam('type', PATHFINDER_ITEM_TYPES, '条目类型'),
            enumParam('direction', PATHFINDER_DIRECTIONS, '技术方向'),
            enumParam('difficulty', PATHFINDER_DIFFICULTIES, '难度'),
            enumParam('remote', PATHFINDER_REMOTE_STATUSES, '参与形式'),
            enumParam('sort', CATALOG_SORTS, '排序方式'),
            {
              name: 'task',
              in: 'query',
              description: '设为 1 时只返回可直接上手的具体任务（GitHub issue、具体岗位），排除整仓库入口与招聘门户',
              schema: { type: 'string', enum: ['1'] },
            },
            {
              name: 'q',
              in: 'query',
              description: '关键词，匹配标题、摘要、机构、来源、资格与标签',
              schema: { type: 'string', maxLength: 100 },
            },
            {
              name: 'deadline',
              in: 'query',
              description: '只返回该窗口内截止且尚未结束的条目',
              schema: { type: 'string', enum: ['30d', '90d'] },
            },
            {
              name: 'limit',
              in: 'query',
              description: '返回条数，默认 50，上限 100',
              schema: { type: 'integer', minimum: 1, maximum: 100, default: 50 },
            },
          ],
          responses: {
            200: {
              description: '条目列表',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ItemList' } } },
            },
            400: {
              description: '参数非法。枚举值写错会直接报错，不会静默返回全量数据。',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        ItemList: {
          type: 'object',
          required: ['items', 'total', 'limit', 'generatedAt'],
          properties: {
            items: { type: 'array', items: { $ref: '#/components/schemas/Item' } },
            total: { type: 'integer', description: '筛选后的总数，可能大于 items 长度' },
            limit: { type: 'integer' },
            generatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Item: {
          type: 'object',
          required: ['id', 'type', 'title', 'source', 'canonicalUrl', 'verifiedAt'],
          properties: {
            id: { type: 'string' },
            type: { type: 'string', enum: [...PATHFINDER_ITEM_TYPES] },
            title: { $ref: '#/components/schemas/LocalizedText' },
            summary: { $ref: '#/components/schemas/LocalizedText' },
            organization: { $ref: '#/components/schemas/LocalizedText' },
            directions: { type: 'array', items: { type: 'string', enum: [...PATHFINDER_DIRECTIONS] } },
            difficulty: { type: 'string', enum: [...PATHFINDER_DIFFICULTIES] },
            actionable: {
              type: 'boolean',
              description: '是否为可直接上手的具体任务，而不是仓库入口或招聘门户',
            },
            learningEligible: { type: 'boolean', description: '是否可纳入学习路径' },
            requiresManualEligibilityCheck: {
              type: 'boolean',
              description: '资格含画像判断不了的硬条件（工作许可、年级、学校），需本人核对',
            },
            cost: {
              type: 'object',
              properties: {
                amount: { type: ['number', 'null'], description: 'null 表示官方未披露，0 表示免费' },
                currency: { type: ['string', 'null'] },
                label: { oneOf: [{ $ref: '#/components/schemas/LocalizedText' }, { type: 'null' }] },
              },
            },
            remoteStatus: { type: 'string', enum: [...PATHFINDER_REMOTE_STATUSES] },
            deadline: {
              type: 'object',
              description: '官方只公布日期时 date 有值而 at 为 null，不会伪造时刻与时区',
              properties: {
                at: { type: ['string', 'null'], format: 'date-time' },
                date: { type: ['string', 'null'], pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
                text: { oneOf: [{ $ref: '#/components/schemas/LocalizedText' }, { type: 'null' }] },
              },
            },
            source: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { $ref: '#/components/schemas/LocalizedText' },
                trustLevel: { type: 'string', enum: ['official', 'verified'] },
                siteUrl: { type: 'string', format: 'uri' },
              },
            },
            canonicalUrl: { type: 'string', format: 'uri', description: '官方原文地址' },
            url: { type: 'string', format: 'uri', description: '站内详情页' },
            publishedAt: { type: ['string', 'null'], format: 'date-time' },
            discoveredAt: { type: 'string', format: 'date-time' },
            verifiedAt: { type: 'string', format: 'date-time', description: '最近一次核验时间' },
          },
        },
        LocalizedText: {
          type: 'object',
          required: ['zh', 'en'],
          properties: { zh: { type: 'string' }, en: { type: 'string' } },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              required: ['code', 'message'],
              properties: { code: { type: 'string' }, message: { type: 'string' } },
            },
          },
        },
      },
    },
  };

  return NextResponse.json(spec, {
    headers: { 'Cache-Control': 'public, max-age=3600', 'Access-Control-Allow-Origin': '*' },
  });
}

function enumParam(name: string, values: readonly string[], description: string) {
  return {
    name,
    in: 'query',
    description,
    schema: { type: 'string', enum: [...values] },
  };
}
