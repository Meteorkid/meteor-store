import { isDeepStrictEqual } from 'node:util';
import { SITE_URL } from '@/lib/constants';
import { cleanExternalText } from '@/lib/pathfinder/ingestion/normalize';
import { DailyDateSchema, dailyDate } from '@/lib/daily/types';
import { mastersSeeds } from './seeds';
import { getMastersAutomationRounds, saveMastersRound } from './service';
import { defaultMastersYear, MastersRoundInputSchema, type MastersRoundDetails, type MastersRoundInput } from './types';

export const MASTERS_MAX_PAGE_BYTES = 2 * 1024 * 1024;
export const MASTERS_FETCH_TIMEOUT_MS = 10_000;
export const mastersSyncSources = [
  { id: 'hku', url: 'https://master.cds.hku.hk/msccs/' },
  { id: 'hkust', url: 'https://mimt.hkust.edu.hk/admissions/application-deadlines-procedures' },
  { id: 'cityu-macau', url: 'https://fof.cityu.edu.mo/en/masterofscienceinfintech' },
  { id: 'nus', url: 'https://www.comp.nus.edu.sg/programmes/pg/misc/application/' },
  { id: 'oxford', url: 'https://www.ox.ac.uk/admissions/graduate/courses/msc-advanced-computer-science' },
  { id: 'uq', url: 'https://study.uq.edu.au/study-options/programs/master-computer-science-5522' },
] as const;
export type MastersSourceId = (typeof mastersSyncSources)[number]['id'];

function allowedUrl(raw: string, host: string): URL {
  const url = new URL(raw);
  if (!mastersSyncSources.some(source => new URL(source.url).hostname === host)
    || url.protocol !== 'https:' || url.hostname !== host || url.username || url.password
    || (url.port && url.port !== '443')) throw new Error('unsafe_source');
  url.hash = '';
  return url;
}

/** 仅受控高校主机；重定向与流式读取共享10秒预算，不执行网页脚本。 */
export async function fetchMastersPage(raw: string, host: string): Promise<{ html: string; url: string }> {
  let url = allowedUrl(raw, host);
  const signal = AbortSignal.timeout(MASTERS_FETCH_TIMEOUT_MS);
  for (let redirects = 0; redirects <= 3; redirects += 1) {
    const response = await fetch(url.toString(), {
      redirect: 'manual', cache: 'no-store', signal,
      headers: { Accept: 'text/html,application/xhtml+xml', 'User-Agent': `MeteorStore/1.0 (+${SITE_URL}/masters)` },
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location || redirects === 3) throw new Error('redirect_failed');
      url = allowedUrl(new URL(location, url).toString(), host);
      continue;
    }
    if (!response.ok) throw new Error('fetch_failed');
    if (Number(response.headers.get('content-length')) > MASTERS_MAX_PAGE_BYTES) throw new Error('page_too_large');
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType && !/text\/html|application\/xhtml\+xml/i.test(contentType)) throw new Error('not_html');
    if (!response.body) throw new Error('empty_page');
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const next = await reader.read();
        if (next.done) break;
        size += next.value.byteLength;
        if (size > MASTERS_MAX_PAGE_BYTES) {
          await reader.cancel().catch(() => undefined);
          throw new Error('page_too_large');
        }
        chunks.push(next.value);
      }
    } finally { reader.releaseLock(); }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const html = new TextDecoder().decode(bytes);
    if (!html.trim() || /<title[^>]*>\s*(?:Just a moment|Access denied)/i.test(html)) throw new Error('blocked_page');
    return { html, url: url.toString() };
  }
  throw new Error('redirect_failed');
}

function pageText(html: string): string {
  return cleanExternalText(html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' '), MASTERS_MAX_PAGE_BYTES);
}
function required(match: RegExpMatchArray | null): RegExpMatchArray {
  if (!match) throw new Error('evidence_missing');
  return match;
}
function intakeYear(value: string, end?: string): number {
  const year = Number(value);
  if (!Number.isInteger(year) || year < 2020 || year > 2100
    || (end && Number(end.length === 2 ? `${String(year + 1).slice(0, 2)}${end}` : end) !== year + 1)) {
    throw new Error('intake_mismatch');
  }
  return year;
}
function numericDate(year: number, month: number, day: number): string {
  return DailyDateSchema.parse(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
}
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const WORD_DATE = '(\\d{1,2})\\s+([A-Za-z]{3,9})\\s*,?\\s*(\\d{4})';
function wordDate(day: string, month: string, year: string): string {
  const index = MONTHS.indexOf(month.slice(0, 3).toLowerCase());
  if (index < 0) throw new Error('invalid_month');
  return numericDate(Number(year), index + 1, Number(day));
}
function deadlineWithinIntake(date: string, year: number) {
  if (date < `${year - 1}-01-01` || date > `${year}-12-31`) throw new Error('deadline_intake_mismatch');
}

function makeRound(templateId: string, year: number, details: Partial<MastersRoundDetails>, url: string, now: Date): MastersRoundInput {
  const template = mastersSeeds.find(seed => seed.id === templateId);
  if (!template) throw new Error('unknown_programme');
  const merged = { ...template.details, ...details, officialUrl: url };
  if (merged.deadlineOn) deadlineWithinIntake(merged.deadlineOn, year);
  return MastersRoundInputSchema.parse({
    ...template, id: templateId.replace('2027', String(year)), intakeYear: year,
    status: 'published', verifiedOn: dailyDate(now), details: merged,
  });
}

/** 从固定项目主页发现当前年份链接，不通过把旧URL中的年份加一来猜新页面。 */
export function discoverHkuApplicationUrl(html: string): string {
  const candidates = [...html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)].flatMap(match => {
    try {
      const url = allowedUrl(new URL(match[1], mastersSyncSources[0].url).toString(), 'master.cds.hku.hk');
      const year = /^\/msccs\/about\/msc-in-computer-science-application-procedure-(\d{4})-(\d{2})\/?$/.exec(url.pathname);
      return year ? [{ year: intakeYear(year[1], year[2]), url: url.toString() }] : [];
    } catch { return []; }
  });
  if (!candidates.length) throw new Error('application_link_missing');
  return candidates.sort((a, b) => b.year - a.year)[0].url;
}

function parseHku(html: string, url: string, now: Date) {
  const text = pageText(html);
  const intake = required(text.match(/Application Deadline for\s+(\d{4})[/-](\d{2,4})\s+Fall intake\s*\(September\s+(\d{4})\)/i));
  const year = intakeYear(intake[1], intake[2]);
  if (Number(intake[3]) !== year || !url.includes(`-${year}-${String(year + 1).slice(-2)}`)
    || !/General Stream/i.test(text) || !/WITHOUT the Delta X Fellowship/i.test(text)) throw new Error('programme_scope_mismatch');
  return ['Main', 'Clearing'].map(label => {
    const match = required(text.match(new RegExp(`${label} Round Deadline:\\s*${WORD_DATE}\\s*\\(HKT noon\\)`, 'i')));
    const date = wordDate(match[1], match[2], match[3]);
    return makeRound(`hku-msccs-general-2027-${label === 'Main' ? 'main' : 'clearing'}`, year, {
      intakeLabel: `${year}/${String(year + 1).slice(-2)} 秋季（${year}年9月）`,
      opensOn: null, openingState: 'unknown', openingNote: '本次官方项目页未给出具体开放日。',
      deadlineOn: date, deadlineAt: `${date}T12:00:00+08:00`, deadlineTimeZone: 'Asia/Hong_Kong', deadlineText: match[0],
      sourceNote: `自动核验官方项目页：${intake[0]}；${match[0]}。适用General Stream且不选择Delta X Fellowship路径。`,
    }, url, now);
  });
}

function parseHkust(html: string, url: string, now: Date) {
  const text = pageText(html);
  const intake = required(text.match(/applications for the\s+(\d{4})\/(\d{2,4})\s+MSc in International Management/i));
  const year = intakeYear(intake[1], intake[2]);
  const start = text.indexOf('Application Deadline (23:59 HK Time)');
  const end = text.indexOf('How To Apply', start);
  if (start < 0 || end < 0 || !/rolling basis/i.test(text)) throw new Error('deadline_table_missing');
  const table = text.slice(start, end);
  if (!table.includes('Interview Notification By')) throw new Error('deadline_column_missing');
  const matches = [...table.matchAll(/Phase\s+0?\s*([1-4])\s+([A-Za-z]{3,9})\s+(\d{1,2})\s+(\d{4})\s+([A-Za-z]{3,9})\s+(\d{1,2})\s+(\d{4})/gi)];
  if (matches.length !== 4 || new Set(matches.map(match => match[1])).size !== 4) throw new Error('rounds_incomplete');
  const open = new RegExp(`Application for ${year}/${String(year + 1).slice(-2)} intake is now open`, 'i').test(text);
  return matches.map(match => {
    // 同行第二列是面试通知日期，绝不能作为申请截止。
    const date = wordDate(match[3], match[2], match[4]);
    return makeRound(`hkust-mimt-2027-phase-${match[1]}`, year, {
      intakeLabel: `${year}/${String(year + 1).slice(-2)} 入学季`, opensOn: null,
      openingState: open ? 'open' : 'unknown', openingNote: open ? '官方项目页明确当前入学季申请已开放。' : '未能在项目页确认开放状态。',
      deadlineOn: date, deadlineAt: `${date}T23:59:00+08:00`, deadlineTimeZone: 'Asia/Hong_Kong', deadlineText: `${date} 23:59 HK Time`,
      rolling: true, sourceNote: `自动核验${year}/${String(year + 1).slice(-2)}官方申请表，第${match[1]}轮Application Deadline列为${date}，23:59 HK Time；Interview Notification By列不作为申请截止。`,
    }, url, now);
  });
}

function parseCity(html: string, url: string, now: Date) {
  const text = pageText(html);
  if (!/Master of Science in Financial Technology/i.test(text)) throw new Error('programme_mismatch');
  const match = required(text.match(/(\d{4})\s*\/\s*(\d{4})\s+Online Application\s+Application deadline:\s*(\d{4})\s*\/\s*(\d{1,2})\s*\/\s*(\d{1,2})/i));
  const year = intakeYear(match[1], match[2]);
  const date = numericDate(Number(match[3]), Number(match[4]), Number(match[5]));
  return [makeRound('cityu-macau-fintech-2027', year, {
    intakeLabel: `${year}/${year + 1} 入学季`, opensOn: null, openingState: 'unknown',
    openingNote: '官方项目页未披露具体开放日。', deadlineOn: date, deadlineAt: null, deadlineTimeZone: null,
    deadlineText: `${date}（仅日期，未披露截止时刻和时区）`, sourceNote: `自动核验金融科技项目官方页申请区块：${match[0]}。不套用校级通用日期。`,
  }, url, now)];
}

function parseNus(html: string, url: string, now: Date) {
  const text = pageText(html);
  if (!/Master of Computing\s*\(with Specialisations\)/i.test(text) || !/Infocomm Security/i.test(text)) throw new Error('programme_scope_mismatch');
  const tables = [...html.matchAll(/<table\b[^>]*>[\s\S]*?<\/table>/gi)]
    .map(match => pageText(match[0])).filter(value => /Opening Date.*Closing Date.*August intake/i.test(value));
  if (tables.length !== 1) throw new Error('application_table_ambiguous');
  const match = required(tables[0].match(new RegExp(`August intake\\s+${WORD_DATE}\\s+${WORD_DATE}`, 'i')));
  const opensOn = wordDate(match[1], match[2], match[3]);
  const deadlineOn = wordDate(match[4], match[5], match[6]);
  const year = intakeYear(match[6]);
  if (deadlineOn >= `${year}-08-01` || opensOn > deadlineOn) throw new Error('intake_mismatch');
  return [makeRound('nus-mcomp-infosec-2027-august', year, {
    intakeLabel: `${year}年8月入学`, opensOn, openingState: 'scheduled', openingNote: `官方申请表开放日：${opensOn}。`,
    deadlineOn, deadlineAt: null, deadlineTimeZone: null, deadlineText: `${deadlineOn}（仅日期，未披露截止时刻和时区）`,
    sourceNote: `自动核验MComp with Specialisations申请表：${match[0]}；页面列出Infocomm Security方向。仅采用Opening Date与Closing Date列，不采用申请结果公布日期。`,
  }, url, now)];
}

function ukNoon(date: string): string {
  const target = Date.parse(`${date}T12:00:00Z`);
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(target));
  const hour = Number(parts.find(part => part.type === 'hour')?.value);
  return new Date(target - (hour - 12) * 3_600_000).toISOString().replace('.000Z', 'Z');
}

function parseOxford(html: string, url: string, now: Date) {
  const text = pageText(html);
  if (!/MSc in Advanced Computer Science/i.test(text)) throw new Error('programme_mismatch');
  const match = required(text.match(new RegExp(`Application deadlines\\s+(12:00 midday UK time(?:\\s+on)?(?:\\s+(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?)?\\s+${WORD_DATE})\\s+Final application deadline for entry in\\s+(\\d{4})-(\\d{2,4})`, 'i')));
  const year = intakeYear(match[5], match[6]);
  const date = wordDate(match[2], match[3], match[4]);
  const state = text.match(/\bFull time\s+(Open|Closed)\b/i)?.[1].toLowerCase();
  return [makeRound('oxford-advanced-cs-2027-final', year, {
    intakeLabel: `${year}/${String(year + 1).slice(-2)} 入学季`, opensOn: null,
    openingState: state === 'closed' ? 'closed' : state === 'open' ? 'open' : 'unknown',
    openingNote: state === 'closed' ? '官方项目页显示Closed。' : state === 'open' ? '官方项目页显示Open。' : '官方开放状态未确认。',
    deadlineOn: date, deadlineAt: ukNoon(date), deadlineTimeZone: 'Europe/London', deadlineText: match[1],
    sourceNote: `自动核验MSc Advanced Computer Science ${year}/${String(year + 1).slice(-2)}官方项目截止：${match[1]}。不将奖学金或offer接受期限当作申请截止。`,
  }, url, now)];
}

function parseUq(html: string, url: string, now: Date) {
  if (!/Master of Computer Science/i.test(pageText(html))) throw new Error('programme_mismatch');
  const settings = required(html.match(/<script\b(?=[^>]*data-drupal-selector=["']drupal-settings-json["'])[^>]*>([\s\S]*?)<\/script>/i));
  const serialized = JSON.stringify(JSON.parse(settings[1]));
  const years = [...new Set([...serialized.matchAll(/\/api\/program-requirements\/5522-(\d{4})/g)].map(match => match[1]))];
  if (years.length !== 1) throw new Error('programme_year_missing');
  const year = intakeYear(years[0]);
  const yearUrl = new URL(url);
  if (yearUrl.searchParams.has('year') && yearUrl.searchParams.get('year') !== String(year)) throw new Error('requested_year_mismatch');
  yearUrl.searchParams.set('year', String(year));
  const blocks = [...html.matchAll(/<section\b(?=[^>]*data-student-type=["']international["'])[^>]*>[\s\S]*?<\/section>/gi)]
    .map(match => pageText(match[0])).filter(text => /Important dates/i.test(text));
  if (blocks.length !== 1) throw new Error('international_dates_missing');
  return [1, 2].map(semester => {
    const rule = semester === 1 ? 'previous year' : 'year of commencement';
    const match = required(blocks[0].match(new RegExp(`commence study in semester ${semester}\\s*[-–]\\s*([A-Za-z]+)\\s+(\\d{1,2})\\s+of the ${rule}`, 'i')));
    const date = wordDate(match[2], match[1], String(year - (semester === 1 ? 1 : 0)));
    return makeRound(`uq-computer-science-2027-international-semester-${semester}`, year, {
      intakeLabel: `${year} Semester ${semester}`, opensOn: null, openingState: 'unknown',
      openingNote: '官方项目页未披露具体申请开放日。', deadlineOn: date, deadlineAt: null, deadlineTimeZone: null,
      deadlineText: `${date}（${match[0]}；仅日期）`,
      sourceNote: `自动核验官方5522-${year}项目数据及data-student-type="international"的Important dates：${match[0]}。未采用domestic区块的期限。`,
    }, yearUrl.toString(), now);
  });
}

/** 解析结果必须由当前页面证明入学年，年份只用于新建ID，不能覆写原入学年。 */
export function parseMastersPage(sourceId: MastersSourceId, html: string, url: string, now = new Date()): MastersRoundInput[] {
  const source = mastersSyncSources.find(item => item.id === sourceId)!;
  allowedUrl(url, new URL(source.url).hostname);
  const parsers = { hku: parseHku, hkust: parseHkust, 'cityu-macau': parseCity, nus: parseNus, oxford: parseOxford, uq: parseUq };
  const rounds = parsers[sourceId](html, url, now);
  if (rounds.some(round => round.intakeYear < defaultMastersYear(now))) throw new Error('source_intake_outdated');
  return rounds;
}

export interface MastersSyncResult {
  checked: number; published: number; changed: number; failed: number; unchanged: number; paused: number;
  errors: Array<{ source: MastersSourceId; reason: 'fetch_failed' | 'parse_failed' | 'save_failed' }>;
}

export async function syncMastersSources(now = new Date()): Promise<MastersSyncResult> {
  const result: MastersSyncResult = { checked: 0, published: 0, changed: 0, failed: 0, unchanged: 0, paused: 0, errors: [] };
  for (const source of mastersSyncSources) {
    result.checked += 1;
    let phase: MastersSyncResult['errors'][number]['reason'] = 'fetch_failed';
    try {
      const host = new URL(source.url).hostname;
      const fetchUrl = source.id === 'uq' ? `${source.url}?year=${defaultMastersYear(now)}` : source.url;
      let page = await fetchMastersPage(fetchUrl, host);
      if (source.id === 'hku') page = await fetchMastersPage(discoverHkuApplicationUrl(page.html), host);
      phase = 'parse_failed';
      const inputs = parseMastersPage(source.id, page.html, page.url, now);
      phase = 'save_failed';
      const previous = await getMastersAutomationRounds(inputs.map(input => input.id!));
      for (const input of inputs) {
        const existing = previous.find(row => row.id === input.id);
        if (existing?.automationPaused) { result.paused += 1; continue; }
        if (existing?.status === 'draft') {
          const seed = mastersSeeds.find(row => row.id === existing.id);
          if (!seed || existing.revision !== 1 || !isDeepStrictEqual(existing.details, seed.details)) {
            result.paused += 1;
            continue;
          }
        }
        if (existing?.status === 'published' && existing.verifiedOn === input.verifiedOn
          && isDeepStrictEqual(existing.details, input.details)) { result.unchanged += 1; continue; }
        const saved = await saveMastersRound({ ...input, expectedUpdatedAt: existing?.updatedAt }, { automatic: true });
        if (!saved) { result.paused += 1; continue; }
        if (!existing || existing.status !== 'published') result.published += 1;
        else if (saved.dateVersion !== existing.dateVersion) result.changed += 1;
        else result.unchanged += 1;
      }
    } catch {
      result.failed += 1;
      result.errors.push({ source: source.id, reason: phase });
    }
  }
  return result;
}
