import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProductUpdateJob, ProductUpdateState } from '@/lib/product-updates/types';

const mocks = vi.hoisted(() => ({ locale: vi.fn(), auth: vi.fn() }));
vi.mock('next-intl', () => ({ useLocale: mocks.locale }));
vi.mock('@/components/AuthProvider', () => ({ useAuth: mocks.auth }));

import ProductUpdatesPanel from '../ProductUpdatesPanel';

function fixture(): ProductUpdateState {
  return {
    currentRevision: 'revision-1', catalogError: false, job: null,
    current: [{ productId: 'xisland', name: 'XIsland', downloads: [{ id: 'dmg', version: '1.0.0', sha256: 'b'.repeat(64) }] }],
    check: {
      id: '20397c3d-62ea-4582-8c7c-0d1ea4f811ea', checkedAt: '2026-10-22T02:00:00.000Z', baseRevision: 'revision-1',
      rows: [{
        productId: 'xisland', name: 'XIsland', channel: 'github-stable', currentVersion: '1.0.0', latestVersion: '1.1.0',
        status: 'update', message: '已找到正式发布文件及官方 SHA-256，同步时校验下载内容。', sourceUrl: 'https://github.com/example/xisland/releases/tag/v1.1.0', publishedAt: '2026-10-21T02:00:00Z',
        assets: [{ fileId: 'dmg', name: 'XIsland-1.1.0.dmg', url: 'https://github.com/example/xisland/releases/download/v1.1.0/XIsland.dmg', bytes: 10485760, sha256: 'a'.repeat(64), architecture: 'macos-arm64', assetId: 123 }],
      }],
    },
  };
}

function render(state = fixture()) { return renderToStaticMarkup(<ProductUpdatesPanel userId="admin-a" initialState={state} />); }
function syncButton(html: string) {
  return html.match(/<button[^>]*>[^<]*(?:一键同步|Sync all updates)[^<]*<\/button>/)?.[0] ?? '';
}
function job(status: ProductUpdateJob['status']): ProductUpdateJob {
  return { id: 'job-a', checkId: 'check-a', status, startedAt: '2026-10-22T02:20:00Z', updatedAt: '2026-10-22T02:21:00Z', finishedAt: null,
    rows: [{ productId: 'xisland', status: 'pending', message: '等待处理' }] };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-22T02:30:00Z'));
  mocks.locale.mockReturnValue('zh');
  mocks.auth.mockReturnValue({ loading: false, user: { id: 'admin-a', isAdmin: true } });
});
afterEach(() => vi.useRealTimers());

describe('产品更新面板服务端首屏', () => {
  it('呈现真实当前版本、最新版本、来源、时间与可展开文件校验信息', () => {
    const html = render();
    expect(html).toContain('当前下载版本');
    expect(html).toContain('1.0.0');
    expect(html).toContain('1.1.0');
    expect(html).toContain('https://github.com/example/xisland/releases/tag/v1.1.0');
    expect(html).toContain('检查时间');
    expect(html).toContain('UTC+8');
    expect(html).toContain('<details');
    expect(html).toContain('XIsland-1.1.0.dmg');
    expect(html).toContain('10 MiB');
    expect(html).toContain('macos-arm64');
    expect(html).toContain('a'.repeat(64));
    expect(syncButton(html)).not.toContain(' disabled=""');
  });

  it('尚未检查时只展示当前下载，并禁用同步', () => {
    const state = fixture();
    state.check = null;
    const html = render(state);
    expect(html).toContain('先检查产品更新');
    expect(html).toContain('1.0.0');
    expect(syncButton(html)).toContain(' disabled=""');
  });

  it('检查所用目录已变化时必须重查', () => {
    const state = fixture();
    state.currentRevision = 'revision-2';
    state.current[0].downloads[0].version = '1.0.1';
    const html = render(state);
    expect(html).toContain('1.0.1');
    expect(html).toContain('下载目录已发生变化');
    expect(html).toContain('上次检查结果（需重新检查）');
    expect(html).not.toContain('1 个产品可同步');
    expect(syncButton(html)).not.toContain('(1)');
    expect(syncButton(html)).toContain(' disabled=""');
  });

  it('一小时后检查失效', () => {
    vi.setSystemTime(new Date('2026-10-22T03:00:00Z'));
    const html = render();
    expect(html).toContain('检查结果已超过一小时');
    expect(syncButton(html)).toContain(' disabled=""');
  });

  it.each(['current', 'blocked', 'error'] as const)('%s 没有可同步项时不开放同步', status => {
    const state = fixture();
    state.check!.rows[0].status = status;
    const html = render(state);
    expect(html).toContain('本次检查没有可同步的更新');
    expect(syncButton(html)).toContain(' disabled=""');
  });

  it.each(['queued', 'running'] as const)('%s 时两步操作均禁用', status => {
    const state = fixture();
    state.job = job(status);
    const html = render(state);
    expect(html.match(/<button[^>]*>检查产品更新<\/button>/)?.[0]).toContain(' disabled=""');
    expect(syncButton(html)).toContain(' disabled=""');
    expect(html).toContain('每两秒更新进度');
  });

  it('同步过程保留每个产品阶段，部分失败不冒充全部成功', () => {
    const state = fixture();
    state.job = job('partial');
    const statuses = ['pending', 'downloading', 'uploading', 'verified', 'synced', 'skipped', 'failed'] as const;
    state.job.rows = statuses.map(status => ({ productId: status, status, message: '' }));
    const html = render(state);
    for (const label of ['等待处理', '正在下载', '正在上传', '校验通过', '已同步', '已跳过', '失败']) expect(html).toContain(label);
    expect(html).toContain('部分产品同步失败，失败项继续保留原下载');
    expect(html).not.toContain('同步已完成，当前下载版本已刷新');
  });

  it('目录损坏时显示基础版本并禁用同步', () => {
    const state = fixture();
    state.catalogError = true;
    const html = render(state);
    expect(html).toContain('下载目录无法通过校验');
    expect(syncButton(html)).toContain(' disabled=""');
  });

  it('英文页面含英语操作与状态', () => {
    mocks.locale.mockReturnValue('en');
    const html = render();
    expect(html).toContain('Check product updates');
    expect(html).toContain('Sync all updates');
    expect(html).toContain('Update available');
    expect(html).toContain('Files and checksums');
    expect(html).not.toContain('已找到正式发布文件');
  });

  it.each([
    ['同一版本的官方构建校验值与当前下载不同，需人工核对，不能覆盖。', 'different official build checksum'],
    ['PyPI 包仍处于 Alpha 阶段，不能同步到稳定下载。', 'classified as Alpha or Beta'],
  ])('英文页面保留阻止同步的具体原因', (reason, expected) => {
    mocks.locale.mockReturnValue('en');
    const state = fixture();
    state.check!.rows[0].status = 'blocked';
    state.check!.rows[0].message = reason;
    expect(render(state)).toContain(expected);
  });

  it('英文明确区分已发布PyPI包与Alpha开发阶段，不误称已被阻止', () => {
    mocks.locale.mockReturnValue('en');
    const state = fixture();
    state.check!.rows[0].message = '已确认 omnicrawl-core 已发布包，可同步安装链接与版本。项目元数据标注为 Alpha 开发阶段。';
    const html = render(state);
    expect(html).toContain('The project is classified as Alpha.');
    expect(html).not.toContain('cannot replace a stable download');
    expect(html).not.toContain('项目元数据');
  });

  it('未登录或失去管理员权限后不保留私有数据', () => {
    mocks.auth.mockReturnValue({ loading: false, user: null });
    expect(render()).toBe('');
    mocks.auth.mockReturnValue({ loading: false, user: { id: 'admin-a', isAdmin: false } });
    expect(render()).toBe('');
  });

  it('账号变化后不复用另一账号的初始结果', () => {
    mocks.auth.mockReturnValue({ loading: false, user: { id: 'admin-b', isAdmin: true } });
    const html = render();
    expect(html).toContain('正在读取产品更新状态');
    expect(html).not.toContain('XIsland');
    expect(syncButton(html)).toContain(' disabled=""');
  });

  it('认证仍在加载时保留已经过服务端鉴权的首屏', () => {
    mocks.auth.mockReturnValue({ loading: true, user: null });
    expect(render()).toContain('XIsland');
  });
});
