import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { phdSeeds } from '../seeds';
import type { MastersRound, MastersRoundInput } from '@/lib/masters/types';
import { withMastersOpeningEvidence } from '@/lib/masters/opening-evidence';

const mocks = vi.hoisted(() => ({ getPhdAutomationRounds: vi.fn(), savePhdRound: vi.fn() }));
vi.mock('../service', () => mocks);
import { fetchPhdPage, parsePhdPage, phdSyncSources, syncPhdSources, PHD_MAX_PAGE_BYTES, PHD_FETCH_TIMEOUT_MS, type PhdSourceId } from '../automation';

const now = new Date('2026-10-29T00:00:00Z');
const fixture = (id: string) => readFileSync(path.join(__dirname, 'fixtures', `${id}.html`), 'utf8');
const source = (id: PhdSourceId) => phdSyncSources.find(item => item.id === id)!;
const evidence = (id: PhdSourceId) => source(id).evidenceUrl ? fixture(`${id}-evidence`) : '';
const parse = (id: PhdSourceId, html = fixture(id), extra = evidence(id)) => parsePhdPage(id, html, source(id).url, now, extra);
const htmlResponse = (html: string) => new Response(html, { headers: { 'content-type': 'text/html' } });
function fixtureFetch(url: string) {
  const primary = phdSyncSources.find(item => item.url === url);
  const supporting = phdSyncSources.find(item => item.evidenceUrl === url);
  if (!primary && !supporting) throw new Error('Unexpected source');
  return Promise.resolve(htmlResponse(fixture(primary?.id ?? `${supporting!.id}-evidence`)));
}
function asSaved(input: MastersRoundInput, overrides: Partial<MastersRound & { automationPaused: boolean }> = {}) {
  return {
    ...input, id: input.id!, revision: 1, dateVersion: 1, automationPaused: false,
    dateChangedAt: null, previousDeadlineText: null, createdAt: '2026-10-29T00:00:00Z', updatedAt: '2026-10-29T00:00:00Z',
    ...overrides,
  } satisfies MastersRound & { automationPaused: boolean };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getPhdAutomationRounds.mockResolvedValue([]);
  mocks.savePhdRound.mockImplementation(async (input: MastersRoundInput) => asSaved(input));
});
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

describe('博士当期官方证据解析', () => {
  it('种子全部为无日期草稿，不能直接作为已核验日历', () => {
    expect(new Set(phdSeeds.map(seed => seed.region)).size).toBe(5);
    for (const seed of phdSeeds) {
      expect(seed).toMatchObject({ status: 'draft', verifiedOn: null, details: { deadlineStatus: 'unverified', deadlineOn: null, opensOn: null, studyType: 'research' } });
      expect(seed.id).toMatch(/^phd-/);
    }
  });

  it.each(phdSyncSources)('$id依照当期证据产生独立博士记录', ({ id }) => {
    const rounds = parse(id);
    expect(rounds).toHaveLength({ hku: 3, smu: 1, must: 1, oxford: 2, griffith: 1 }[id]);
    for (const round of rounds) {
      const year = id === 'hku' && round.id?.endsWith('clearing-2') ? 2028 : 2027;
      expect(round).toMatchObject({ intakeYear: year, status: 'published', verifiedOn: '2026-10-29', details: { studyType: 'research', deadlineStatus: 'confirmed' } });
      expect(round.id).toMatch(new RegExp(`^phd-.*${year}`));
      expect(round.details.sourceNote).toContain('自动核验');
      expect(round.details.firstObservedOpenOn).toBeUndefined();
    }
  });

  it('香港大学院系与校级同轮日期交叉核对，保留名额条件与香港时刻', () => {
    const rounds = parse('hku');
    expect(rounds.map(round => round.details.deadlineOn)).toEqual(['2026-12-01', '2027-04-30', '2027-08-31']);
    expect(rounds.map(round => round.details.opensOn)).toEqual(['2026-09-01', '2026-12-02', '2027-05-01']);
    expect(rounds[0].details).toMatchObject({ deadlineAt: '2026-12-01T23:59:00+08:00', deadlineTimeZone: 'Asia/Hong_Kong', eventType: 'application' });
    expect(rounds[2]).toMatchObject({ id: 'phd-hku-cs-2028-clearing-2', intakeYear: 2028, details: { intakeLabel: '2028年1月入学（2027/28学年）' } });
    expect(rounds[1].details.sourceNote).toContain('剩余名额');
    expect(() => parse('hku', fixture('hku').replace('December 1, 2026', 'December 2, 2026'))).toThrow('department_dates_mismatch');
    expect(() => parse('hku', fixture('hku'), '')).toThrow();
    expect(() => parse('hku', fixture('hku'), evidence('hku').replace('2027/28', '2028/29'))).toThrow('intake_mismatch');
  });

  it('SMU依实际AY和August年份解析，不能把通用年度表当作本年度证据', () => {
    expect(parse('smu')[0].details).toMatchObject({ opensOn: '2026-08-01', deadlineOn: '2027-01-31', deadlineAt: null, deadlineTimeZone: null });
    expect(() => parse('smu', '<p>PhD programme accepts application for full-time study only. Term 1 (August) opens 01 August of prior year, closes 31 January of intake year.</p>')).toThrow();
    expect(() => parse('smu', fixture('smu').replace('August 2027', 'August 2028'))).toThrow('intake_mismatch');
    expect(() => parse('smu', fixture('smu').replace('31 January 2027', '31 February 2027'))).toThrow();
    expect(() => parse('smu', fixture('smu'), '<h1>Master of Science in Computing</h1>')).toThrow('programme_scope_mismatch');
  });

  it('澳门科大只读取当前普通第一轮字面量，忽略注释旧轮次及特殊课程日期', () => {
    expect(parse('must')[0].details).toMatchObject({
      opensOn: '2026-09-08', deadlineOn: '2026-11-16', deadlineAt: '2026-11-16T18:00:00+08:00',
      deadlineTimeZone: 'Asia/Shanghai', mayCloseEarly: true, eventType: 'application',
    });
    expect(() => parse('must', fixture('must').replace("title: '普通入學（第一輪）'", "title: '本科直博'"))).toThrow('application_round_missing');
    expect(() => parse('must', fixture('must').replace("end: '2026-11-16'", "end: '2025-11-16'"))).toThrow('deadline_intake_mismatch');
    expect(() => parse('must', fixture('must').replace('北京時間', '未注明時區'))).toThrow('deadline_context_missing');
    expect(() => parse('must', fixture('must') + fixture('must'))).toThrow('application_table_ambiguous');
  });

  it('Oxford奖学金与最终申请分别保存，不能混成同一申请期限', () => {
    const rounds = parse('oxford', '<p>Other scholarship date: 1 January 2028</p>' + fixture('oxford'));
    expect(rounds.map(round => [round.details.eventType, round.details.deadlineOn, round.details.deadlineAt])).toEqual([
      ['scholarship', '2026-12-02', '2026-12-02T12:00:00Z'],
      ['application', '2027-03-02', '2027-03-02T12:00:00Z'],
    ]);
    expect(rounds[1].details.roundName).toContain('预计');
    expect(() => parse('oxford', fixture('oxford').replace('Expected to be the final application deadline', 'Final application deadline to be considered for Oxford scholarships'))).toThrow('deadline_table_ambiguous');
  });

  it('Griffith只读国际Pathway奖学金，不借国内日期补开放年或混入普通申请', () => {
    const [round] = parse('griffith', fixture('griffith').replace('applications open 2 November 2026 and close 5 February 2027', 'applications open 1 August 2026 and close 1 September 2026'));
    expect(round.details).toMatchObject({ eventType: 'scholarship', opensOn: null, openingState: 'unknown', deadlineOn: '2027-02-05', deadlineAt: null, deadlineTimeZone: null });
    expect(round.details.applicantGroup).toContain('仅International Griffith Pathway');
    expect(() => parse('griffith', fixture('griffith').replace('40 credit point', '30 credit point'))).toThrow();
  });

  it('Griffith真实abbr身份句未显示括号释义时仍正确解析', () => {
    const html = fixture('griffith');
    expect(html).toContain('<abbr title="Doctor of Philosophy">PhD</abbr>');
    expect(parse('griffith', html)[0]).toMatchObject({
      id: 'phd-griffith-research-2027-international-scholarship-2', intakeYear: 2027,
      details: { eventType: 'scholarship', opensOn: null, deadlineOn: '2027-02-05', deadlineAt: null, deadlineTimeZone: null },
    });
    expect(parse('griffith', html.replace('<abbr title="Doctor of Philosophy">PhD</abbr>', 'PhD (Doctor of Philosophy)'))).toHaveLength(1);
  });

  it('Griffith缺少完整博士身份句时拒绝，不能仅凭其他段落的PhD词样发布', () => {
    const html = fixture('griffith').replace(/<p class="feature a-center">[\s\S]*?<\/p>/, '') + '<p>Industry PhD scholarships</p>';
    expect(() => parse('griffith', html)).toThrow('programme_mismatch');
  });

  it.each(phdSyncSources)('$id的新年份必须从新正文产生新ID', ({ id }) => {
    const next = (html: string) => html.replace(/20\d{2}/g, year => String(Number(year) + 1)).replaceAll('/28', '/29').replaceAll('-28', '-29');
    const updated = parse(id, next(fixture(id)), next(evidence(id)));
    expect(updated.map(round => round.intakeYear)).toEqual(id === 'hku' ? [2028, 2028, 2029] : Array(updated.length).fill(2028));
    expect(updated.every(round => round.id?.includes(`-${round.intakeYear}-`))).toBe(true);
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2027-08-01T00:00:00Z'));
    if (id === 'hku') {
      expect(parsePhdPage(id, fixture(id), source(id).url, new Date(), evidence(id)).map(round => round.id)).toEqual(['phd-hku-cs-2028-clearing-2']);
    } else {
      expect(() => parsePhdPage(id, fixture(id), source(id).url, new Date(), evidence(id))).toThrow('source_intake_outdated');
    }
  });

  it('香港学年与实际入学年分开，旧周期结束后不留在下一届', () => {
    const rounds = parse('hku');
    expect(rounds.map(round => round.intakeYear)).toEqual([2027, 2027, 2028]);
    expect(rounds.every(round => round.details.programme === 'PhD in Computer Science')).toBe(true);
    expect(() => parse('hku', fixture('hku').replace('4-year Doctor of Philosophy', '4-year Master of Philosophy'))).toThrow('programme_mismatch');
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2028-08-01T00:00:00Z'));
    expect(() => parsePhdPage('hku', fixture('hku'), source('hku').url, new Date('2028-08-01T00:00:00Z'), evidence('hku'))).toThrow('source_intake_outdated');
  });

  it('同主机其他项目URL也不能被当作该博士项目核验', () => {
    expect(() => parsePhdPage('smu', fixture('smu'), 'https://computing.smu.edu.sg/msc/online-application', now, evidence('smu'))).toThrow('programme_url_mismatch');
  });
});

describe('官方抓取边界', () => {
  it('保持2MiB/10秒预算和固定HTTPS白名单，重定向不得跨白名单主机', async () => {
    expect(PHD_FETCH_TIMEOUT_MS).toBe(10_000);
    expect(PHD_MAX_PAGE_BYTES).toBe(2 * 1024 * 1024);
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 302, headers: { location: source('smu').url } }));
    vi.stubGlobal('fetch', fetch);
    await expect(fetchPhdPage('http://computing.smu.edu.sg/phd', 'computing.smu.edu.sg')).rejects.toThrow('unsafe_source');
    await expect(fetchPhdPage('https://127.0.0.1/phd', '127.0.0.1')).rejects.toThrow('unsafe_source');
    expect(fetch).not.toHaveBeenCalled();
    await expect(fetchPhdPage(source('hku').url, 'www.cs.hku.hk')).rejects.toThrow('unsafe_source');
    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch.mock.calls[0][1]).toMatchObject({ redirect: 'manual', cache: 'no-store' });
    expect(fetch.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
  });

  it('声明长度、真实流、403与200挑战页都不能视作核验成功', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(new Response('x', { headers: { 'content-length': String(PHD_MAX_PAGE_BYTES + 1) } }))
      .mockResolvedValueOnce(htmlResponse('x'.repeat(PHD_MAX_PAGE_BYTES + 1)))
      .mockResolvedValueOnce(new Response('denied', { status: 403 }))
      .mockResolvedValueOnce(htmlResponse('<title>Just a moment...</title>')));
    for (let i = 0; i < 4; i += 1) await expect(fetchPhdPage(source('oxford').url, 'www.ox.ac.uk')).rejects.toThrow();
  });
});

describe('博士同步暂停与版本保护', () => {
  it('新学年按实际入学年创建新ID，保留旧周期所有记录', async () => {
    const oldInputs = phdSyncSources.flatMap(entry => parse(entry.id));
    const oldRows = oldInputs.map(input => asSaved(input));
    const snapshot = structuredClone(oldRows);
    const oldIds = new Set(oldRows.map(row => row.id));
    const next = (html: string) => html.replace(/20\d{2}/g, year => String(Number(year) + 1)).replaceAll('/28', '/29').replaceAll('-28', '-29');
    vi.stubGlobal('fetch', vi.fn(async (url: string) => htmlResponse(next(await (await fixtureFetch(url)).text()))));
    mocks.getPhdAutomationRounds.mockImplementation(async (ids: string[]) => oldRows.filter(row => ids.includes(row.id)));
    expect(await syncPhdSources(now)).toMatchObject({ published: 8, changed: 0, failed: 0 });
    expect(mocks.savePhdRound.mock.calls.every(([input]) => !oldIds.has(input.id))).toBe(true);
    expect(mocks.savePhdRound).toHaveBeenCalledWith(expect.objectContaining({ id: 'phd-hku-cs-2029-clearing-2', intakeYear: 2029 }), { automatic: true });
    expect(oldRows).toEqual(snapshot);
  });

  it('单一来源失败不阻止其他来源，失败来源不能使用种子日期发布', async () => {
    vi.stubGlobal('fetch', vi.fn((url: string) => url === source('hku').url ? Promise.resolve(new Response('error', { status: 503 })) : fixtureFetch(url)));
    expect(await syncPhdSources(now)).toMatchObject({ checked: 5, published: 5, failed: 1, errors: [{ source: 'hku', reason: 'fetch_failed' }] });
    expect(mocks.savePhdRound.mock.calls.some(([input]) => input.id.includes('hku'))).toBe(false);
  });

  it('人工暂停和修改过的draft不复活；保存携带CAS并尊重并发冲突', async () => {
    vi.stubGlobal('fetch', vi.fn(fixtureFetch));
    const rows = new Map<string, ReturnType<typeof asSaved>>();
    rows.set(phdSeeds[0].id!, asSaved(phdSeeds[0], { automationPaused: true }));
    rows.set(phdSeeds[1].id!, asSaved(phdSeeds[1], { revision: 2 }));
    rows.set(phdSeeds[2].id!, asSaved(phdSeeds[2]));
    mocks.getPhdAutomationRounds.mockImplementation(async (ids: string[]) => ids.flatMap(id => rows.has(id) ? [rows.get(id)!] : []));
    mocks.savePhdRound.mockImplementation(async (input: MastersRoundInput) => input.id === phdSeeds[2].id ? null : asSaved(input));
    const result = await syncPhdSources(now);
    expect(result).toMatchObject({ published: 5, paused: 3, failed: 0 });
    expect(mocks.savePhdRound).toHaveBeenCalledWith(expect.objectContaining({ id: phdSeeds[2].id, expectedUpdatedAt: rows.get(phdSeeds[2].id!)!.updatedAt }), { automatic: true });
    expect(mocks.savePhdRound.mock.calls.some(([input]) => input.id === phdSeeds[0].id || input.id === phdSeeds[1].id)).toBe(false);
  });

  it('保留首次开放证据，同日相同核验不重复保存', async () => {
    vi.stubGlobal('fetch', vi.fn(fixtureFetch));
    const rows = new Map<string, ReturnType<typeof asSaved>>();
    for (const entry of phdSyncSources) {
      for (const input of parse(entry.id)) rows.set(input.id!, asSaved(withMastersOpeningEvidence(input, undefined, now)));
    }
    mocks.getPhdAutomationRounds.mockImplementation(async (ids: string[]) => ids.map(id => rows.get(id)!));
    expect(await syncPhdSources(now)).toMatchObject({ unchanged: 8, published: 0, failed: 0 });
    expect(mocks.savePhdRound).not.toHaveBeenCalled();
    expect(rows.get('phd-oxford-cs-2027-final')!.details.firstObservedOpenOn).toBe('2026-10-29');
  });

  it('源页解析变化或存储失败按阶段上报，不回退为静态发布', async () => {
    vi.stubGlobal('fetch', vi.fn((url: string) => url === source('must').url ? Promise.resolve(htmlResponse('<h1>New admissions page</h1>')) : fixtureFetch(url)));
    mocks.savePhdRound.mockImplementation(async (input: MastersRoundInput) => {
      if (input.id?.includes('smu')) throw new Error('database unavailable');
      return asSaved(input);
    });
    expect(await syncPhdSources(now)).toMatchObject({ failed: 2, errors: [{ source: 'smu', reason: 'save_failed' }, { source: 'must', reason: 'parse_failed' }] });
  });
});
