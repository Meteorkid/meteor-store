import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MastersRoundInput } from '@/lib/masters/types';

const mocks = vi.hoisted(() => ({
  session: vi.fn(), admin: vi.fn(), rateLimit: vi.fn(), audit: vi.fn(),
  list: vi.fn(), save: vi.fn(), unpublish: vi.fn(), importSeeds: vi.fn(),
}));
vi.mock('@/lib/auth', () => ({ getSession: mocks.session }));
vi.mock('@/lib/admin', () => ({ isAdminSession: mocks.admin }));
vi.mock('@/lib/admin-audit', () => ({ logAdminAction: mocks.audit }));
vi.mock('@/lib/rate-limit', () => ({ getClientIp: () => '127.0.0.1', rateLimit: mocks.rateLimit }));
vi.mock('@/lib/masters/service', () => ({
  listAdminMastersRounds: mocks.list, saveMastersRound: mocks.save,
  unpublishMastersRound: mocks.unpublish, importMastersSeeds: mocks.importSeeds,
}));

import { GET, PATCH, POST } from '../route';

const session = { userId: 'admin-1', email: 'admin@example.com', emailVerified: true };
const updatedAt = '2026-10-14T01:00:00.000Z';
const input: MastersRoundInput = {
  id: 'round-1', intakeYear: 2027, region: 'hong-kong', status: 'published', verifiedOn: '2026-10-14', expectedUpdatedAt: updatedAt,
  details: {
    university: 'Example University', programme: 'MSc Computer Science', subject: 'Computer science',
    studyType: 'taught', studyMode: 'Full-time', intakeLabel: 'Autumn 2027', applicantGroup: 'International applicants',
    roundName: 'Round 1', eventType: 'application', opensOn: null, openingNote: 'Opening date not announced', openingState: 'unknown',
    deadlineStatus: 'confirmed', deadlineOn: '2026-12-01', deadlineAt: null, deadlineTimeZone: null,
    deadlineText: '1 December 2026, date only', rolling: false, mayCloseEarly: false,
    officialUrl: 'https://example.edu/programme/admissions', sourceNote: 'Official programme page applies to international applicants for 2027.',
  },
};
const round = { ...input, id: 'round-1', revision: 1, dateVersion: 1, dateChangedAt: null,
  previousDeadlineText: null, createdAt: updatedAt, updatedAt };

function request(method: 'GET' | 'POST' | 'PATCH', body?: unknown, options: { query?: string; origin?: string; contentLength?: number } = {}) {
  return new NextRequest(`http://localhost:3000/api/admin/masters${options.query ?? ''}`, {
    method,
    headers: { 'Content-Type': 'application/json', Origin: options.origin ?? 'http://localhost:3000',
      ...(options.contentLength ? { 'Content-Length': String(options.contentLength) } : {}) },
    ...(body === undefined ? {} : { body: typeof body === 'string' ? body : JSON.stringify(body) }),
  });
}

describe('硕士申请日历后台接口', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-14T04:00:00.000Z'));
    mocks.session.mockResolvedValue(session);
    mocks.admin.mockReturnValue(true);
    mocks.rateLimit.mockResolvedValue({ limited: false });
    mocks.list.mockResolvedValue([round]);
    mocks.save.mockImplementation(async (value: MastersRoundInput) => ({ ...round, ...value, id: value.id ?? round.id }));
    mocks.unpublish.mockResolvedValue(true);
    mocks.importSeeds.mockResolvedValue({ created: 11 });
  });
  afterEach(() => vi.useRealTimers());

  it('所有 handler 对非管理员返回不可缓存的404，并且不读写数据', async () => {
    mocks.admin.mockReturnValue(false);
    const responses = await Promise.all([
      GET(request('GET')), POST(request('POST', { action: 'import' })), PATCH(request('PATCH', { action: 'save', input })),
    ]);
    for (const response of responses) {
      expect(response.status).toBe(404);
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect((await response.json()).error).toBe('Not found');
    }
    expect(mocks.list).not.toHaveBeenCalled();
    expect(mocks.save).not.toHaveBeenCalled();
    expect(mocks.importSeeds).not.toHaveBeenCalled();
  });

  it('未登录不能读取草稿', async () => {
    mocks.session.mockResolvedValue(null);
    expect((await GET(request('GET'))).status).toBe(404);
    expect(mocks.list).not.toHaveBeenCalled();
  });

  it('按入学年份查询，不因截止发生在上一年而遗漏记录', async () => {
    const response = await GET(request('GET', undefined, { query: '?year=2027' }));
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(mocks.list).toHaveBeenCalledWith(2027);
    expect((await response.json()).rounds[0].details.deadlineOn).toBe('2026-12-01');
  });

  it('省略年份时使用默认申请入学年', async () => {
    expect((await GET(request('GET'))).status).toBe(200);
    expect(mocks.list).toHaveBeenCalledWith(2027);
  });

  it.each(['', 'not-a-year', '2027.5', '2019', '2101'])('拒绝非法年份 %s', async year => {
    const response = await GET(request('GET', undefined, { query: `?year=${year}` }));
    expect(response.status).toBe(400);
    expect(mocks.list).not.toHaveBeenCalled();
  });

  it('两个写 handler 都检查真实 Origin', async () => {
    const options = { origin: 'https://outside.example' };
    for (const response of await Promise.all([
      POST(request('POST', { action: 'import' }, options)), PATCH(request('PATCH', { action: 'save', input }, options)),
    ])) {
      expect(response.status).toBe(403);
      expect(response.headers.get('Cache-Control')).toBe('no-store');
    }
    expect(mocks.importSeeds).not.toHaveBeenCalled();
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('两个写 handler 均限流并使用内存降级', async () => {
    mocks.rateLimit.mockResolvedValue({ limited: true });
    expect((await POST(request('POST', { action: 'import' }))).status).toBe(429);
    expect((await PATCH(request('PATCH', { action: 'save', input }))).status).toBe(429);
    expect(mocks.rateLimit.mock.calls.every(call => call[3].fallback === 'memory')).toBe(true);
    expect(mocks.importSeeds).not.toHaveBeenCalled();
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('首批导入只调用固定种子服务，审计记录新增数量和草稿状态', async () => {
    const response = await POST(request('POST', { action: 'import' }));
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toEqual({ created: 11 });
    expect(mocks.importSeeds).toHaveBeenCalledWith();
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({ action: 'masters.import', detail: { created: 11, status: 'draft' } }));
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('重复导入新增为0也正常返回，不将已有记录作为失败', async () => {
    mocks.importSeeds.mockResolvedValue({ created: 0 });
    expect((await POST(request('POST', { action: 'import' }))).status).toBe(200);
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({ detail: { created: 0, status: 'draft' } }));
  });

  it('不能用导入入口指定远程来源或要求直接发布', async () => {
    expect((await POST(request('POST', { action: 'import', url: 'https://outside.example', status: 'published' }))).status).toBe(400);
    expect(mocks.importSeeds).not.toHaveBeenCalled();
  });

  it('无效JSON被拒绝', async () => {
    expect((await PATCH(request('PATCH', '{'))).status).toBe(400);
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('省略长度头也会限制实际请求流到128KB', async () => {
    const response = await PATCH(request('PATCH', { action: 'save', input: { ...input, extra: 'x'.repeat(128 * 1024) } }));
    expect(response.status).toBe(413);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('根据长度头提前拒绝超大导入请求', async () => {
    const response = await POST(request('POST', { action: 'import' }, { contentLength: 128 * 1024 + 1 }));
    expect(response.status).toBe(413);
    expect(mocks.importSeeds).not.toHaveBeenCalled();
  });

  it('日期级截止原样保存为日期，不擅自补时刻或时区', async () => {
    const response = await PATCH(request('PATCH', { action: 'save', input }));
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(mocks.save).toHaveBeenCalledWith(input);
    expect(mocks.save.mock.calls[0][0].details).toMatchObject({ deadlineAt: null, deadlineTimeZone: null });
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({ action: 'masters.publish', targetId: round.id, detail: expect.objectContaining({ dateVersion: 1, revision: 1 }) }));
    expect(mocks.audit.mock.calls[0][1].detail).not.toHaveProperty('sourceNote');
  });

  it('新建草稿不要求提前生成ID和版本', async () => {
    const draft = { ...input, id: undefined, expectedUpdatedAt: undefined, status: 'draft', verifiedOn: null };
    expect((await PATCH(request('PATCH', { action: 'save', input: draft }))).status).toBe(200);
    expect(mocks.save).toHaveBeenCalledWith(expect.objectContaining({ status: 'draft', verifiedOn: null }));
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({ action: 'masters.save' }));
  });

  it('有ID的编辑必须提供版本', async () => {
    expect((await PATCH(request('PATCH', { action: 'save', input: { ...input, expectedUpdatedAt: undefined } }))).status).toBe(409);
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('服务端并发冲突返回409，不记录成功审计', async () => {
    mocks.save.mockResolvedValue(null);
    const response = await PATCH(request('PATCH', { action: 'save', input }));
    expect(response.status).toBe(409);
    expect((await response.json()).errorCode).toBe('conflict');
    expect(mocks.audit).not.toHaveBeenCalled();
  });

  it.each([null, '2026-10-15'])('发布不能缺失核验日或使用未来核验日 %s', async verifiedOn => {
    expect((await PATCH(request('PATCH', { action: 'save', input: { ...input, verifiedOn } }))).status).toBe(400);
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it.each([
    { officialUrl: 'http://example.edu/admissions' }, { sourceNote: '' }, { applicantGroup: '' },
    { deadlineStatus: 'unannounced' }, { deadlineStatus: 'unverified' }, { deadlineOn: '2026-02-30' },
    { deadlineAt: '2026-12-01T10:00:00+08:00' }, { deadlineTimeZone: 'Not/AZone' },
    { deadlineAt: '2026-12-02T01:00:00Z', deadlineTimeZone: 'Asia/Hong_Kong' },
    { opensOn: '2026-12-02' },
  ])('拒绝违反来源或日期约束的输入 %j', async details => {
    expect((await PATCH(request('PATCH', { action: 'save', input: { ...input, details: { ...input.details, ...details } } }))).status).toBe(400);
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('可发布经核验的尚未公布日期状态，不编造截止日期', async () => {
    const details = { ...input.details, deadlineStatus: 'unannounced', deadlineOn: null, deadlineAt: null, deadlineText: 'Official dates not yet announced' };
    expect((await PATCH(request('PATCH', { action: 'save', input: { ...input, details } }))).status).toBe(200);
    expect(mocks.save.mock.calls[0][0].details.deadlineOn).toBeNull();
  });

  it('rolling与固定轮次截止可以同时存在', async () => {
    const details = { ...input.details, rolling: true, mayCloseEarly: true };
    expect((await PATCH(request('PATCH', { action: 'save', input: { ...input, details } }))).status).toBe(200);
    expect(mocks.save.mock.calls[0][0].details).toMatchObject({ rolling: true, mayCloseEarly: true, deadlineOn: '2026-12-01' });
  });

  it('下架带版本并写审计，竞争修改不能重复下架', async () => {
    const body = { action: 'unpublish', id: round.id, expectedUpdatedAt: updatedAt };
    expect((await PATCH(request('PATCH', body))).status).toBe(200);
    expect(mocks.unpublish).toHaveBeenCalledWith(round.id, updatedAt);
    expect(mocks.audit).toHaveBeenCalledWith(session, expect.objectContaining({ action: 'masters.unpublish', targetId: round.id }));
    mocks.unpublish.mockResolvedValue(false);
    expect((await PATCH(request('PATCH', body))).status).toBe(409);
    expect(mocks.audit).toHaveBeenCalledTimes(1);
  });

  it('下架不能省略版本', async () => {
    expect((await PATCH(request('PATCH', { action: 'unpublish', id: round.id }))).status).toBe(400);
    expect(mocks.unpublish).not.toHaveBeenCalled();
  });

  it('内部读取失败返回no-store，不暴露底层错误', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      mocks.list.mockRejectedValue(new Error('private database details'));
      const response = await GET(request('GET'));
      expect(response.status).toBe(500);
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(await response.json()).toEqual({ error: 'load_failed', errorCode: 'load_failed' });
    } finally { log.mockRestore(); }
  });
});
