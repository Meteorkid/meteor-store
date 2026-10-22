import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mastersSeeds } from '../seeds';
import type { MastersRoundInput } from '../types';

const mocks = vi.hoisted(() => ({ getMastersAutomationRounds: vi.fn(), saveMastersRound: vi.fn() }));
vi.mock('../service', () => mocks);
import { discoverHkuApplicationUrl, fetchMastersPage, mastersSyncSources, parseMastersPage, syncMastersSources, MASTERS_MAX_PAGE_BYTES } from '../automation';

const now = new Date('2026-10-15T00:00:00Z');
const fixture = (id: string) => readFileSync(path.join(__dirname, 'fixtures', `${id}.html`), 'utf8');
const hkuUrl = 'https://master.cds.hku.hk/msccs/about/msc-in-computer-science-application-procedure-2027-28/';
const sourceUrl = (id: string) => id === 'hku' ? hkuUrl : mastersSyncSources.find(source => source.id === id)!.url;
const htmlResponse = (html: string) => new Response(html, { headers: { 'Content-Type': 'text/html' } });

function fixtureFetch(url: string) {
  if (url === mastersSyncSources[0].url) return Promise.resolve(htmlResponse(fixture('hku-entry')));
  const source = mastersSyncSources.find(item => new URL(item.url).hostname === new URL(url).hostname);
  if (!source) throw new Error('Unexpected source');
  return Promise.resolve(htmlResponse(fixture(source.id)));
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getMastersAutomationRounds.mockResolvedValue([]);
  mocks.saveMastersRound.mockImplementation(async (input: MastersRoundInput) => ({ ...input, revision: 1, dateVersion: 1 }));
});
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

describe('官方硕士页面解析', () => {
  it.each(mastersSyncSources)('$id从当期官方内容解析年份与期限后自动公开', ({ id }) => {
    const rounds = parseMastersPage(id, fixture(id), sourceUrl(id), now);
    expect(rounds.length).toBe({ hku: 2, hkust: 4, 'cityu-macau': 1, nus: 1, oxford: 1, uq: 2 }[id]);
    for (const round of rounds) {
      expect(round.status).toBe('published');
      expect(round.intakeYear).toBe(2027);
      expect(round.verifiedOn).toBe('2026-10-15');
      expect(round.id).toContain('2027');
      expect(round.details.sourceNote).toContain('自动核验');
    }
  });

  it('HKU只从固定项目入口发现当前年份，不猜URL', () => {
    const current = fixture('hku-entry');
    expect(discoverHkuApplicationUrl(current)).toBe(hkuUrl);
    expect(discoverHkuApplicationUrl(current + current.replaceAll('2027-28', '2028-29'))).toContain('2028-29');
    expect(() => discoverHkuApplicationUrl('<a href="https://outside.example/msccs/about/msc-in-computer-science-application-procedure-2029-30/">Apply</a>')).toThrow();
    expect(() => discoverHkuApplicationUrl('<p>No updated application page.</p>')).toThrow();
  });

  it('HKUST使用申请截止列而不是面试通知日期，保留rolling', () => {
    const rounds = parseMastersPage('hkust', fixture('hkust'), sourceUrl('hkust'), now);
    expect(rounds.map(round => round.details.deadlineOn)).toEqual(['2026-10-11', '2026-11-29', '2027-01-10', '2027-02-28']);
    expect(rounds.every(round => round.details.rolling && round.details.deadlineTimeZone === 'Asia/Hong_Kong')).toBe(true);
    expect(() => parseMastersPage('hkust', fixture('hkust').replace('Interview Notification By', 'Other column'), sourceUrl('hkust'), now)).toThrow();
  });

  it('UQ按国际生区块及实际页面年份推导，不采用domestic日期或URL参数', () => {
    const rounds = parseMastersPage('uq', fixture('uq'), `${sourceUrl('uq')}?year=2027`, now);
    expect(rounds.map(round => round.details.deadlineOn)).toEqual(['2026-11-30', '2027-05-31']);
    expect(rounds.every(round => round.intakeYear === 2027 && round.details.deadlineAt === null && round.details.officialUrl.endsWith('year=2027'))).toBe(true);
    expect(() => parseMastersPage('uq', fixture('uq'), `${sourceUrl('uq')}?year=2099`, now)).toThrow('requested_year_mismatch');
    expect(() => parseMastersPage('uq', fixture('uq').replace('data-student-type="international"', 'data-student-type="other"'), sourceUrl('uq'), now)).toThrow();
    expect(() => parseMastersPage('uq', '<h1>Master of Computer Science</h1><div data-student-type="international">Select your location</div>', sourceUrl('uq'), now)).toThrow();
  });

  it.each(mastersSyncSources)('$id新入学年从新正文得到新ID，不覆写旧年份', ({ id }) => {
    const next = fixture(id).replace(/\b20\d{2}\b/g, year => String(Number(year) + 1)).replaceAll('/28', '/29').replaceAll('-28', '-29');
    const url = sourceUrl(id).replaceAll('2027-28', '2028-29');
    const rounds = parseMastersPage(id, next, url, now);
    expect(rounds.every(round => round.intakeYear === 2028 && round.id?.includes('2028'))).toBe(true);
  });

  it('NUS与澳门仅有日期时不制造截止时刻或时区', () => {
    for (const id of ['nus', 'cityu-macau'] as const) {
      const [round] = parseMastersPage(id, fixture(id), sourceUrl(id), now);
      expect(round.details.deadlineAt).toBeNull();
      expect(round.details.deadlineTimeZone).toBeNull();
    }
    expect(() => parseMastersPage('nus', fixture('nus').replace('31 January 2027', '31 February 2027'), sourceUrl('nus'), now)).toThrow();
  });

  it.each(['nus', 'nus-20261022'])('NUS兼容August intake与真实August 2027表格：%s', id => {
    const [round] = parseMastersPage('nus', fixture(id), sourceUrl('nus'), now);
    expect(round).toMatchObject({
      id: 'nus-mcomp-infosec-2027-august', intakeYear: 2027,
      details: { opensOn: '2026-10-01', deadlineOn: '2027-01-31', deadlineAt: null, deadlineTimeZone: null },
    });
  });

  it('NUS按表头定位列，重排和结果公布列不改变申请日期', () => {
    const table = '<table><tr><th>Application results</th><th>Closing Date</th><th>Intake</th><th>Opening Date</th></tr>'
      + '<tr><td>31 May 2027</td><td>31 January 2027</td><td>August 2027</td><td>1 October 2026</td></tr></table>';
    const html = fixture('nus-20261022').replace(/<table\b[^>]*>[\s\S]*?<\/table>/i, table);
    const [round] = parseMastersPage('nus', html, sourceUrl('nus'), now);
    expect(round.details).toMatchObject({ opensOn: '2026-10-01', deadlineOn: '2027-01-31' });
  });

  it('NUS显式入学年与日期一起滚动时创建新年份ID', () => {
    const html = fixture('nus-20261022').replace(/\b20\d{2}\b/g, year => String(Number(year) + 1));
    const [round] = parseMastersPage('nus', html, sourceUrl('nus'), now);
    expect(round).toMatchObject({ id: 'nus-mcomp-infosec-2028-august', intakeYear: 2028 });
    expect(round.details).toMatchObject({ opensOn: '2027-10-01', deadlineOn: '2028-01-31' });
  });

  it.each([
    ['入学年与截止年不同', (html: string) => html.replace('August 2027', 'August 2028')],
    ['开放日期早于入学前一年', (html: string) => html.replace('1 October 2026', '1 October 2025')],
    ['开放日期晚于截止日期', (html: string) => html.replace('1 October 2026', '1 February 2027')],
    ['截止日期不早于八月入学', (html: string) => html.replace('31 January 2027', '1 August 2027')],
    ['缺少Intake表头', (html: string) => html.replace('>Intake<', '>Cohort<')],
    ['缺少Opening Date表头', (html: string) => html.replace('Opening Date', 'Application results')],
    ['重复表头', (html: string) => html.replace('<th style="width: 27.6712%">', '<th>Intake</th><th style="width: 27.6712%">')],
    ['重复申请表格', (html: string) => html + html],
    ['多个八月入学行', (html: string) => html.replace('</tbody>', '<tr><td>August 2028</td><td>1 October 2027</td><td colspan="2">31 January 2028</td></tr></tbody>')],
    ['日期列缺失', (html: string) => html.replace('<td style="width: 37.5342%">1 October 2026</td>', '')],
  ] as const)('NUS拒绝歧义或错年证据：%s', (_label, mutate) => {
    expect(() => parseMastersPage('nus', mutate(fixture('nus-20261022')), sourceUrl('nus'), now)).toThrow();
  });

  it('Oxford只读取最终申请截止区块，不采用页面其他奖学金日期', () => {
    const html = '<p>Scholarships: 12:00 midday UK time on Monday 16 November 2026</p>' + fixture('oxford');
    const [round] = parseMastersPage('oxford', html, sourceUrl('oxford'), now);
    expect(round.details.deadlineOn).toBe('2027-01-06');
    expect(round.details.deadlineAt).toBe('2027-01-06T12:00:00Z');
  });

  it('官方入口仍停在上一入学年时不冒充新年度核验', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2027-08-01T00:00:00Z'));
    expect(() => parseMastersPage('hkust', fixture('hkust'), sourceUrl('hkust'), new Date('2027-08-01T00:00:00Z')))
      .toThrow('source_intake_outdated');
  });
});

describe('受限官方抓取', () => {
  it('只准固定HTTPS主机，重定向不能逃到外站', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 302, headers: { location: 'https://outside.example/source' } }));
    vi.stubGlobal('fetch', fetch);
    await expect(fetchMastersPage('http://mimt.hkust.edu.hk/test', 'mimt.hkust.edu.hk')).rejects.toThrow();
    await expect(fetchMastersPage('https://outside.example/test', 'outside.example')).rejects.toThrow();
    expect(fetch).not.toHaveBeenCalled();
    await expect(fetchMastersPage(sourceUrl('hkust'), 'mimt.hkust.edu.hk')).rejects.toThrow();
    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch.mock.calls[0][1]).toMatchObject({ redirect: 'manual', cache: 'no-store' });
    expect(fetch.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
  });

  it('Content-Length和实际流式读取都有2MiB硬上限', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(new Response('x', { headers: { 'content-length': String(MASTERS_MAX_PAGE_BYTES + 1) } }))
      .mockResolvedValueOnce(htmlResponse('x'.repeat(MASTERS_MAX_PAGE_BYTES + 1)));
    vi.stubGlobal('fetch', fetch);
    for (let index = 0; index < 2; index += 1) await expect(fetchMastersPage(sourceUrl('hkust'), 'mimt.hkust.edu.hk')).rejects.toThrow('page_too_large');
  });

  it('Oxford403和200挑战页都不能当作核验成功', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response('challenge', { status: 403 }))
      .mockResolvedValueOnce(htmlResponse('<title>Just a moment...</title>')));
    for (let index = 0; index < 2; index += 1) await expect(fetchMastersPage(sourceUrl('oxford'), 'www.ox.ac.uk')).rejects.toThrow();
  });
});

describe('自动同步隔离与已有记录保护', () => {
  it('六个来源重新校验后首发11个轮次，初始draft字段顺序不影响比对', async () => {
    vi.stubGlobal('fetch', vi.fn(fixtureFetch));
    mocks.getMastersAutomationRounds.mockImplementation(async (ids: string[]) => mastersSeeds.filter(seed => ids.includes(seed.id!)).map(seed => ({
      ...seed, details: Object.fromEntries(Object.entries(seed.details).reverse()), revision: 1, automationPaused: false, updatedAt: '2026-10-14T00:00:00Z',
    })));
    const result = await syncMastersSources(now);
    expect(result).toMatchObject({ checked: 6, published: 11, failed: 0 });
    expect(mocks.saveMastersRound).toHaveBeenCalledTimes(11);
    expect(mocks.saveMastersRound.mock.calls.every(call => call[1].automatic === true)).toBe(true);
  });

  it('单源403不阻止其他5站，不打印上游错误或用旧seed兜底发布', async () => {
    vi.stubGlobal('fetch', vi.fn((url: string) => url.includes('www.ox.ac.uk') ? Promise.resolve(new Response('secret diagnostic body', { status: 403 })) : fixtureFetch(url)));
    const result = await syncMastersSources(now);
    expect(result).toMatchObject({ checked: 6, published: 10, failed: 1, errors: [{ source: 'oxford', reason: 'fetch_failed' }] });
    expect(JSON.stringify(result)).not.toContain('secret');
    expect(mocks.saveMastersRound.mock.calls.some(call => call[0].id.startsWith('oxford'))).toBe(false);
  });

  it('NUS真实新表格通过当前证据同步，错年证据不能用seed兜底发布', async () => {
    let html = fixture('nus-20261022');
    vi.stubGlobal('fetch', vi.fn((url: string) => url === sourceUrl('nus') ? Promise.resolve(htmlResponse(html)) : fixtureFetch(url)));
    expect(await syncMastersSources(now)).toMatchObject({ checked: 6, published: 11, failed: 0 });
    expect(mocks.saveMastersRound.mock.calls.find(call => call[0].id.startsWith('nus'))?.[0].details)
      .toMatchObject({ opensOn: '2026-10-01', deadlineOn: '2027-01-31' });
    mocks.saveMastersRound.mockClear();
    html = html.replace('August 2027', 'August 2028');
    expect(await syncMastersSources(now)).toMatchObject({ checked: 6, published: 10, failed: 1, errors: [{ source: 'nus', reason: 'parse_failed' }] });
    expect(mocks.saveMastersRound.mock.calls.some(call => call[0].id.startsWith('nus'))).toBe(false);
  });

  it('显式暂停和被人工改写的初始draft均不自动覆盖', async () => {
    vi.stubGlobal('fetch', vi.fn(fixtureFetch));
    mocks.getMastersAutomationRounds.mockImplementation(async (ids: string[]) => mastersSeeds.filter(seed => ids.includes(seed.id!)).map(seed => ({
      ...seed, details: { ...seed.details, sourceNote: '人工决定保留的说明' }, revision: 1,
      automationPaused: seed.region !== 'hong-kong', updatedAt: '2026-10-14T00:00:00Z',
    })));
    const result = await syncMastersSources(now);
    expect(result).toMatchObject({ published: 0, paused: 11, failed: 0 });
    expect(mocks.saveMastersRound).not.toHaveBeenCalled();
  });
});
