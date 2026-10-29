import { isDeepStrictEqual } from 'node:util';
import { ADMISSIONS_MAX_PAGE_BYTES, ADMISSIONS_FETCH_TIMEOUT_MS, allowedAdmissionsUrl, fetchAdmissionsPage } from '@/lib/admissions/fetch';
import { cleanExternalText } from '@/lib/pathfinder/ingestion/normalize';
import { DailyDateSchema, dailyDate } from '@/lib/daily/types';
import { withMastersOpeningEvidence } from '@/lib/masters/opening-evidence';
import { defaultMastersYear, MastersRoundInputSchema, type MastersRoundDetails, type MastersRoundInput } from '@/lib/masters/types';
import { phdSeeds } from './seeds';
import { getPhdAutomationRounds, savePhdRound } from './service';

export const PHD_MAX_PAGE_BYTES = ADMISSIONS_MAX_PAGE_BYTES;
export const PHD_FETCH_TIMEOUT_MS = ADMISSIONS_FETCH_TIMEOUT_MS;
export const phdSyncSources = [
  { id: 'hku', url: 'https://www.cs.hku.hk/programmes/research-postgraduate/', evidenceUrl: 'https://gradsch.hku.hk/prospective_students/application/application_period' },
  { id: 'smu', url: 'https://computing.smu.edu.sg/phd/online-application', evidenceUrl: 'https://computing.smu.edu.sg/phd' },
  { id: 'must', url: 'https://sgs.must.edu.mo/page/id-3170.html', evidenceUrl: null },
  { id: 'oxford', url: 'https://www.ox.ac.uk/admissions/graduate/courses/dphil-computer-science', evidenceUrl: null },
  { id: 'griffith', url: 'https://www.griffith.edu.au/apply/research-study', evidenceUrl: null },
] as const;
export type PhdSourceId = (typeof phdSyncSources)[number]['id'];
const allowedHosts = [...new Set(phdSyncSources.flatMap(source => source.evidenceUrl ? [source.url, source.evidenceUrl] : [source.url])
  .map(url => new URL(url).hostname))];

export async function fetchPhdPage(raw: string, host: string): Promise<{ html: string; url: string }> {
  return fetchAdmissionsPage(raw, host, allowedHosts, 'phd');
}

function pageText(html: string): string {
  return cleanExternalText(html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' '), PHD_MAX_PAGE_BYTES);
}
function required(match: RegExpMatchArray | null): RegExpMatchArray {
  if (!match) throw new Error('evidence_missing');
  return match;
}
function intakeYear(start: string, end?: string): number {
  const year = Number(start);
  if (!Number.isInteger(year) || year < 2020 || year > 2100
    || (end && Number(end.length === 2 ? `${String(year + 1).slice(0, 2)}${end}` : end) !== year + 1)) {
    throw new Error('intake_mismatch');
  }
  return year;
}
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const WORD_DATE = '(\\d{1,2})\\s+([A-Za-z]{3,9})\\s*,?\\s*(\\d{4})';
const US_DATE = '([A-Za-z]{3,9})\\s+(\\d{1,2}),?\\s+(\\d{4})';
function wordDate(day: string, month: string, year: string): string {
  const index = MONTHS.indexOf(month.slice(0, 3).toLowerCase());
  if (index < 0) throw new Error('invalid_month');
  return DailyDateSchema.parse(`${year}-${String(index + 1).padStart(2, '0')}-${day.padStart(2, '0')}`);
}
function makeRound(templateId: string, year: number, details: Partial<MastersRoundDetails>, url: string, now: Date): MastersRoundInput {
  const template = phdSeeds.find(seed => seed.id === templateId);
  if (!template) throw new Error('unknown_programme');
  const templateYear = `-${template.intakeYear}-`;
  if (!templateId.includes(templateYear)) throw new Error('template_year_mismatch');
  const merged = { ...template.details, ...details, officialUrl: url };
  if (!merged.deadlineOn || merged.deadlineOn < `${year - 1}-01-01` || merged.deadlineOn > `${year}-12-31`
    || (merged.opensOn && merged.opensOn < `${year - 1}-01-01`)) throw new Error('deadline_intake_mismatch');
  return MastersRoundInputSchema.parse({
    ...template, id: templateId.replace(templateYear, `-${year}-`), intakeYear: year,
    status: 'published', verifiedOn: dailyDate(now), details: { ...merged, deadlineStatus: 'confirmed' },
  });
}

function parseHku(html: string, url: string, now: Date, evidence: string) {
  const text = pageText(html);
  if (!/Department of Computer Science/i.test(text) || !/both full-time and part-time modes/i.test(text)
    || !/3-year Doctor of Philosophy\s*\(PhD\)/i.test(text) || !/4-year Doctor of Philosophy\s*\(PhD\)/i.test(text)) throw new Error('programme_mismatch');
  const year = intakeYear(required(text.match(/Timeline for\s+(\d{4})\s+Recruitment/i))[1]);
  const main = required(text.match(new RegExp(`Main-Round Recruitment\\s+The main applications for the research degrees are invited in\\s+${US_DATE}\\s+with the closing date of\\s+${US_DATE}`, 'i')));
  const clearing = required(text.match(new RegExp(`clearing round applications may be invited in April and August with closing dates of\\s+${US_DATE}\\s*\\(for September intake\\)\\s+and\\s+${US_DATE}\\s*\\(for January intake\\)`, 'i')));
  const departmentDates = [wordDate(main[5], main[4], main[6]), wordDate(clearing[2], clearing[1], clearing[3]), wordDate(clearing[5], clearing[4], clearing[6])];
  const period = pageText(evidence);
  const periodYear = required(period.match(/For\s+(\d{4})\/(\d{2,4})\s+Admission/i));
  if (intakeYear(periodYear[1], periodYear[2]) !== year || !/PhD and MPhil programmes/i.test(period)) throw new Error('intake_mismatch');
  return [
    { id: 'main', pattern: 'Main Round', templateYear: 2027, intakeYear: year, month: 9 },
    { id: 'clearing-1', pattern: '1\\s*st\\s+Clearing Round', templateYear: 2027, intakeYear: year, month: 9 },
    { id: 'clearing-2', pattern: '2\\s*nd\\s+Clearing Round', templateYear: 2028, intakeYear: year + 1, month: 1 },
  ].map((round, index) => {
    const match = required(period.match(new RegExp(`${round.pattern}\\s+${WORD_DATE}\\s*[-–—]\\s*${WORD_DATE}\\s*\\(HKT 23:59, GMT\\+8\\)`, 'i')));
    const opensOn = wordDate(match[1], match[2], match[3]);
    const deadlineOn = wordDate(match[4], match[5], match[6]);
    if (deadlineOn !== departmentDates[index] || (index === 0 && opensOn !== wordDate(main[2], main[1], main[3]))) {
      throw new Error('department_dates_mismatch');
    }
    return makeRound(`phd-hku-cs-${round.templateYear}-${round.id}`, round.intakeYear, {
      intakeLabel: `${round.intakeYear}年${round.month}月入学（${year}/${String(year + 1).slice(-2)}学年）`,
      opensOn, openingState: 'scheduled', openingNote: `研究生院明确本轮申请开放日：${opensOn}。补录须有剩余名额。`,
      deadlineOn, deadlineAt: `${deadlineOn}T23:59:00+08:00`, deadlineTimeZone: 'Asia/Hong_Kong',
      deadlineText: `${deadlineOn} 23:59 香港时间`,
      sourceNote: `自动核验计算机科学系${year}年招生说明，并与研究生院 https://gradsch.hku.hk/prospective_students/application/application_period 的${year}/${String(year + 1).slice(-2)}同轮日期交叉核对。${round.month === 1 ? `院系指定1月入学，按该学年归入${year + 1}年1月，不以招生周期起始年替代入学年。` : ''}补录以剩余名额为条件；本轮不是HKPFS向RGC提交初始申请的截止。`,
    }, url, now);
  });
}

function parseSmu(html: string, url: string, now: Date, evidence: string) {
  const text = pageText(html);
  if (!/PhD in Computer Science/i.test(pageText(evidence)) || !/PhD programme accepts application for full-time study only/i.test(text)) throw new Error('programme_scope_mismatch');
  const match = required(text.match(new RegExp(`AY(\\d{4})-(\\d{2,4}),?\\s+Term 1\\s*\\(August\\s+(\\d{4})\\)\\s+application is open from\\s+${WORD_DATE}\\s+to\\s+${WORD_DATE}`, 'i')));
  const year = intakeYear(match[1], match[2]);
  const opensOn = wordDate(match[4], match[5], match[6]);
  const deadlineOn = wordDate(match[7], match[8], match[9]);
  if (Number(match[3]) !== year || Number(match[9]) !== year || deadlineOn >= `${year}-08-01`) throw new Error('intake_mismatch');
  return [makeRound('phd-smu-cs-2027-august', year, {
    intakeLabel: `${year}年8月入学`, opensOn, openingState: 'scheduled', openingNote: `官方当期申请说明明确开放日：${opensOn}。`,
    deadlineOn, deadlineText: `${deadlineOn}（仅日期，未披露截止时刻和时区）`,
    sourceNote: `自动核验SCIS博士${year}年8月全日制申请期，开放${opensOn}、截止${deadlineOn}；同日核验 https://computing.smu.edu.sg/phd 所列PhD in Computer Science。申请须包含完整材料并缴费，不将申请日期当作独立奖学金期限。`,
  }, url, now)];
}

function parseMust(html: string, url: string, now: Date) {
  const text = pageText(html);
  const cycle = required(text.match(/(\d{4})\/(\d{4})\s*碩士及博士學位課程/));
  const year = intakeYear(cycle[1], cycle[2]);
  if (!/截止日\s*18:00/.test(text) || !/招生日程均為北京時間/.test(text) || !/名額已滿之課程隨時截止/.test(text)) throw new Error('deadline_context_missing');
  // 只讀腳本中的資料字面量，不執行腳本；註解中的舊輪次和SPECIALS不屬於本輪證據。
  const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1]
    .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, ''));
  const arrays = scripts.flatMap(script => [...script.matchAll(/\bvar\s+ROUNDS\s*=\s*(\[[\s\S]*?\])\s*;/g)]);
  if (arrays.length !== 1) throw new Error('application_table_ambiguous');
  const rounds = [...arrays[0][1].matchAll(/\{[^{}]*\}/g)].map(match => match[0])
    .filter(value => /\btitle:\s*['"]普通入學（第一輪）['"]/.test(value));
  if (rounds.length !== 1) throw new Error('application_round_missing');
  const opensOn = DailyDateSchema.parse(required(rounds[0].match(/\bstart:\s*['"]([^'"]+)['"]/))[1]);
  const deadlineOn = DailyDateSchema.parse(required(rounds[0].match(/\bend:\s*['"]([^'"]+)['"]/))[1]);
  return [makeRound('phd-must-research-2027-general-1', year, {
    intakeLabel: `${year}/${year + 1} 入学季`, opensOn, openingState: 'scheduled',
    openingNote: `官方普通入学第一轮开放日：${opensOn}；额满可提前截止。`,
    deadlineOn, deadlineAt: `${deadlineOn}T18:00:00+08:00`, deadlineTimeZone: 'Asia/Shanghai',
    deadlineText: `${deadlineOn} 18:00 北京时间`,
    sourceNote: `自动核验${year}/${year + 1}研究生院普通入学第一轮资料：${opensOn}至${deadlineOn}，截止日18:00北京时间。仅适用校级普通博士申请；不采用注释中的旧轮次、特殊课程区块或页面其他旧年说明。名额已满可提前截止。`,
  }, url, now)];
}

function ukNoon(date: string): string {
  const target = Date.parse(`${date}T12:00:00Z`);
  const hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', hourCycle: 'h23' }).format(new Date(target)));
  return new Date(target - (hour - 12) * 3_600_000).toISOString().replace('.000Z', 'Z');
}
function parseOxford(html: string, url: string, now: Date) {
  const text = pageText(html);
  if (!/DPhil in Computer Science/i.test(text)) throw new Error('programme_mismatch');
  const cycle = required(text.match(/Upcoming application deadline for\s+(\d{4})-(\d{2,4})\s+entry/i));
  const year = intakeYear(cycle[1], cycle[2]);
  const table = required(text.match(/Application deadlines\s+([\s\S]+?)After the final application deadline/i))[1];
  const matches = [...table.matchAll(new RegExp(`12:00 midday UK time\\s+(?:on\\s+)?(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\\s+${WORD_DATE}\\s+(Final application deadline to be considered for Oxford scholarships|Expected to be the final application deadline)`, 'gi'))];
  if (matches.length !== 2 || new Set(matches.map(match => match[4].toLowerCase())).size !== 2) throw new Error('deadline_table_ambiguous');
  const state = text.match(/Full time\s+(Open|Closed)\b/i)?.[1].toLowerCase();
  return matches.map(match => {
    const scholarship = /scholarships/i.test(match[4]);
    const deadlineOn = wordDate(match[1], match[2], match[3]);
    return makeRound(`phd-oxford-cs-2027-${scholarship ? 'scholarship' : 'final'}`, year, {
      intakeLabel: `${year}/${String(year + 1).slice(-2)} 入学季`, openingState: state === 'open' ? 'open' : state === 'closed' ? 'closed' : 'unknown',
      openingNote: state ? `官方项目当前显示${state === 'open' ? 'Open' : 'Closed'}；未披露具体开放日。` : '官方开放状态未确认。',
      deadlineOn, deadlineAt: ukNoon(deadlineOn), deadlineTimeZone: 'Europe/London', deadlineText: `${deadlineOn} 英国时间12:00`,
      sourceNote: `自动核验DPhil Computer Science ${year}/${String(year + 1).slice(-2)}项目页：${scholarship ? 'Oxford奖学金考虑截止' : '预计最终申请截止'}为${deadlineOn}英国时间中午。两种期限分别记录；部分奖学金另需申请，最终日期后有名额时项目可能继续开放或重新开放。`,
    }, url, now);
  });
}

function parseGriffith(html: string, url: string, now: Date) {
  const text = pageText(html);
  if (!/Griffith offers multiple admission pathways to a PhD(?:\s*\(Doctor of Philosophy\))?\s+or other doctoral degrees/i.test(text)) throw new Error('programme_mismatch');
  const cycle = required(text.match(/(\d{4})\s+scholarship application dates/i));
  const year = intakeYear(cycle[1]);
  const international = required(text.match(/Open merit international scholarships\s+([\s\S]+?)Project-specific scholarships/i))[1];
  const round = required(international.match(/Round 2: International Griffith Pathway applicants who have completed or are completing a Honours, Masters or Graduate Diploma at Griffith University with a minimum 40 credit point research component in the last ten years can apply for our April and July (\d{4}) intakes\. Applications open (\d{1,2})\s+([A-Za-z]{3,9}) and close (\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})/i));
  if ([round[1], round[6]].some(value => Number(value) !== year)) throw new Error('intake_mismatch');
  const deadlineOn = wordDate(round[4], round[5], round[6]);
  return [makeRound('phd-griffith-research-2027-international-scholarship-2', year, {
    intakeLabel: `${year}年4月或7月入学`, opensOn: null, openingState: 'unknown',
    openingNote: `国际Pathway段写明${round[2]} ${round[3]}开放但省略年份，未将国内申请者的开放日期套入本记录。`,
    deadlineOn, deadlineText: `${deadlineOn}（奖学金轮次；仅日期，未披露时刻和时区）`,
    sourceNote: `自动核验${year}国际研究奖学金第二轮，截止${deadlineOn}。仅International Griffith Pathway，要求近十年在Griffith完成或正在完成指定学位且有至少40学分研究内容；不适用于所有国际生，不是普通博士录取截止。`,
  }, url, now)];
}

/** 每个项目必须由当期页面证明年份；补充证据缺失或院系/校级日期冲突时不发布。 */
export function parsePhdPage(sourceId: PhdSourceId, html: string, url: string, now = new Date(), evidence = ''): MastersRoundInput[] {
  const source = phdSyncSources.find(item => item.id === sourceId)!;
  const safe = allowedAdmissionsUrl(url, new URL(source.url).hostname, allowedHosts);
  if (safe.pathname.replace(/\/$/, '') !== new URL(source.url).pathname.replace(/\/$/, '')) throw new Error('programme_url_mismatch');
  const parsers = { hku: parseHku, smu: parseSmu, must: parseMust, oxford: parseOxford, griffith: parseGriffith };
  const rounds = parsers[sourceId](html, url, now, evidence).filter(round => round.intakeYear >= defaultMastersYear(now));
  if (!rounds.length) throw new Error('source_intake_outdated');
  return rounds;
}

export interface PhdSyncResult {
  checked: number; published: number; changed: number; failed: number; unchanged: number; paused: number;
  errors: Array<{ source: PhdSourceId; reason: 'fetch_failed' | 'parse_failed' | 'save_failed' }>;
}
export async function syncPhdSources(now = new Date()): Promise<PhdSyncResult> {
  const result: PhdSyncResult = { checked: 0, published: 0, changed: 0, failed: 0, unchanged: 0, paused: 0, errors: [] };
  for (const source of phdSyncSources) {
    result.checked += 1;
    let phase: PhdSyncResult['errors'][number]['reason'] = 'fetch_failed';
    try {
      const page = await fetchPhdPage(source.url, new URL(source.url).hostname);
      const evidence = source.evidenceUrl ? await fetchPhdPage(source.evidenceUrl, new URL(source.evidenceUrl).hostname) : null;
      phase = 'parse_failed';
      const inputs = parsePhdPage(source.id, page.html, page.url, now, evidence?.html);
      phase = 'save_failed';
      const previous = await getPhdAutomationRounds(inputs.map(input => input.id!));
      for (const parsed of inputs) {
        const existing = previous.find(row => row.id === parsed.id);
        if (existing?.automationPaused) { result.paused += 1; continue; }
        if (existing?.status === 'draft') {
          const seed = phdSeeds.find(row => row.id === existing.id);
          if (!seed || existing.revision !== 1 || !isDeepStrictEqual(existing.details, seed.details)) { result.paused += 1; continue; }
        }
        const input = withMastersOpeningEvidence(parsed, existing, now);
        if (existing?.status === 'published' && existing.verifiedOn === input.verifiedOn
          && isDeepStrictEqual(existing.details, input.details)) { result.unchanged += 1; continue; }
        const saved = await savePhdRound({ ...input, expectedUpdatedAt: existing?.updatedAt }, { automatic: true });
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
