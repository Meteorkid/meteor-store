import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  PATHFINDER_DIRECTIONS,
  PATHFINDER_ITEM_TYPES,
} from '@/lib/pathfinder/catalog-types';
import { CATALOG_SORTS } from '@/lib/pathfinder/catalog-view';

/**
 * v1 是对外契约：字段一旦发布就不能悄悄改名或改语义。
 * 测试环境是 node、没有数据库，所以这里用源码契约钉住三件容易漂移的事：
 * 枚举必须从类型推导、非法参数必须报错、公开接口不能要求鉴权。
 */
const apiDir = path.join(__dirname, '..');
const itemsSource = readFileSync(path.join(apiDir, 'items', 'route.ts'), 'utf-8');
const specSource = readFileSync(path.join(apiDir, 'openapi.json', 'route.ts'), 'utf-8');

describe('Pathfinder v1 契约', () => {
  it('枚举从类型定义推导，不手抄第二份', () => {
    // 手抄的枚举会在新增类型时悄悄过期，而过期的合约比没有合约更糟
    expect(specSource).toContain('PATHFINDER_ITEM_TYPES');
    expect(specSource).toContain('PATHFINDER_DIRECTIONS');
    expect(specSource).toContain('CATALOG_SORTS');
    for (const literal of [...PATHFINDER_ITEM_TYPES, ...PATHFINDER_DIRECTIONS, ...CATALOG_SORTS]) {
      expect(specSource).not.toContain(`enum: ['${literal}'`);
    }
  });

  it('非法枚举值返回 400 而不是静默返回全量数据', () => {
    for (const code of ['invalid_type', 'invalid_direction', 'invalid_sort', 'invalid_limit']) {
      expect(itemsSource).toContain(`'${code}'`);
    }
    expect(itemsSource).toMatch(/status: 400/);
  });

  it('公开只读接口不引入鉴权', () => {
    // 这里输出的内容与网页上任何人都能看到的一致；加鉴权只会让来源可复核这件事更难
    expect(itemsSource).not.toMatch(/getSession|Authorization|Bearer/);
  });

  it('输出区分「具体任务」与「入口页」，并保留来源与核验时间', () => {
    expect(itemsSource).toContain('actionable: isActionableTask(item)');
    expect(itemsSource).toContain('verifiedAt: item.verifiedAt');
    expect(itemsSource).toContain('canonicalUrl: item.canonicalUrl');
  });

  it('允许跨源读取并声明缓存', () => {
    expect(itemsSource).toContain("'Access-Control-Allow-Origin': '*'");
    expect(itemsSource).toMatch(/Cache-Control.*max-age/);
  });
});
