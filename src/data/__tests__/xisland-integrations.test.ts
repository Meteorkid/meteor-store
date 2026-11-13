import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  countIntegrationsByStatus,
  formatIntegrationCopy,
  integrationSectionCopy,
  integrationStatusLabels,
  xislandIntegrations,
} from '../xisland-integrations';

describe('xislandIntegrations 数据完整性', () => {
  it('共 30 条，与仓库 README 的集成表格行数一致', () => {
    // 这个数字是对外文案的依据（「30 条集成路线」），不能漂移。
    // 若 README 增删了集成，这里会红，提醒同步更新文案。
    expect(xislandIntegrations).toHaveLength(30);
  });

  it('名称唯一，没有重复条目', () => {
    const names = xislandIntegrations.map((item) => item.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('每条都有中英双语的集成路线说明', () => {
    for (const item of xislandIntegrations) {
      expect(item.route.zh.length).toBeGreaterThan(0);
      expect(item.route.en.length).toBeGreaterThan(0);
    }
  });

  it('状态分布：恰好 1 条部分验证（Claude Code），0 条完全验证', () => {
    const counts = countIntegrationsByStatus();
    expect(counts.verified).toBe(0);
    expect(counts['contract-partial']).toBe(1);
    expect(counts.contract).toBe(29);
    // 与 README 一致：只有 Claude Code 做到了真机层面的验证
    const partial = xislandIntegrations.filter((i) => i.status === 'contract-partial');
    expect(partial.map((i) => i.name)).toEqual(['Claude Code']);
  });
});

describe('formatIntegrationCopy 占位符替换', () => {
  it('替换 {total} 与 {verified}', () => {
    expect(formatIntegrationCopy('共 {total} 条，其中 {verified} 条已验证', { total: 30, verified: 1 }))
      .toBe('共 30 条，其中 1 条已验证');
  });

  it('同一个占位符出现多次都会被替换', () => {
    expect(formatIntegrationCopy('{total} 条路线。展开全部 {total} 条', { total: 30 }))
      .toBe('30 条路线。展开全部 30 条');
  });

  it('认不出的占位符原样保留，不替换成 undefined', () => {
    // 宁可留下 {foo} 让人一眼看出漏了变量，也不要输出 "undefined" 这种脏文本
    expect(formatIntegrationCopy('{total} 与 {unknown}', { total: 30 }))
      .toBe('30 与 {unknown}');
  });

  it('区块文案的中英文都含 total 占位符，数字不会写死', () => {
    expect(integrationSectionCopy.intro.zh).toContain('{total}');
    expect(integrationSectionCopy.intro.en).toContain('{total}');
    expect(integrationSectionCopy.toggle.zh).toContain('{total}');
    expect(integrationSectionCopy.toggle.en).toContain('{total}');
    // 30 这个数字不得硬编码进文案 —— 数据变了文案要跟着变
    expect(integrationSectionCopy.intro.zh).not.toContain('30');
    expect(integrationSectionCopy.intro.en).not.toContain('30');
  });
});

describe('措辞纪律（防止把「契约测试通过」说成「已支持」）', () => {
  it('状态文案不出现「已支持 / Supported」这类二元断言', () => {
    for (const label of Object.values(integrationStatusLabels)) {
      expect(label.zh).not.toContain('已支持');
      expect(label.zh).not.toContain('完全支持');
      expect(label.en.toLowerCase()).not.toBe('supported');
      expect(label.en.toLowerCase()).not.toContain('fully supported');
    }
  });

  it('契约测试状态的中英文都点明「待完成」语义', () => {
    expect(integrationStatusLabels.contract.zh).toContain('契约测试通过');
    expect(integrationStatusLabels.contract.en.toLowerCase()).toContain('contract tests passed');
  });

  it('产品页不得出现「已全面支持 / fully supports」这类夸大表述', () => {
    const page = readFileSync(
      join(process.cwd(), 'src/app/[locale]/products/[id]/page.tsx'),
      'utf8',
    );
    // 必须排除注释：页面里正有一段注释在解释「为什么不做这个声明」，
    // 直接全文匹配会把那段解释本身判成违规
    const codeOnly = page.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    expect(codeOnly).not.toContain('已全面支持');
    expect(codeOnly).not.toContain('fully supports');
    expect(codeOnly).not.toContain('supports all');
  });

  it('数据文件里没有编造出 README 之外的「已支持」声明', () => {
    const source = readFileSync(
      join(process.cwd(), 'src/data/xisland-integrations.ts'),
      'utf8',
    );
    // 只允许在注释里解释为什么不这么写
    const codeOnly = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    expect(codeOnly).not.toContain('已支持');
  });
});
