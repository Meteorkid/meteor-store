import { SITE_URL } from '@/lib/constants';
import { DailyDateSchema, dailyDate, shiftDailyDate } from '@/lib/daily/types';
import { getMastersRoundState } from './dates';
import { MastersRoundDetailsSchema, type MastersRound } from './types';

function escapeText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

/** RFC 5545 按 UTF-8 八位组折行，续行的一个空格也计入 75 字节。 */
function foldLine(line: string): string {
  const lines: string[] = [];
  let current = '';
  let bytes = 0;
  for (const character of line) {
    const width = Buffer.byteLength(character, 'utf8');
    if (bytes + width > 75) {
      lines.push(current);
      current = ' ';
      bytes = 1;
    }
    current += character;
    bytes += width;
  }
  lines.push(current);
  return lines.join('\r\n');
}

function utcTimestamp(value: string | Date): string {
  return new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

/** 导出是一次快照，不是订阅；仅输出已发布且核验过的有效截止事件。 */
export function buildMastersCalendar(rounds: MastersRound[]): string {
  const now = new Date();
  const domain = new URL(SITE_URL).hostname;
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//${domain}//Masters Application Calendar//ZH`, 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  const unique = new Map<string, MastersRound>();
  for (const round of rounds) {
    const previous = unique.get(round.id);
    if (!previous || round.revision >= previous.revision) unique.set(round.id, round);
  }
  for (const round of [...unique.values()].sort((a, b) => a.id.localeCompare(b.id))) {
    const parsed = MastersRoundDetailsSchema.safeParse(round.details);
    if (!parsed.success || round.status !== 'published' || !round.verifiedOn
      || !DailyDateSchema.safeParse(round.verifiedOn).success || round.verifiedOn > dailyDate(now)
      || !Number.isSafeInteger(round.revision) || round.revision < 0
      || parsed.data.deadlineStatus !== 'confirmed' || !parsed.data.deadlineOn
      || getMastersRoundState(round, now).state === 'closed') continue;
    const deadlineOn = parsed.data.deadlineOn;
    const details = parsed.data;
    const title = `${details.university} · ${details.programme} · ${details.roundName}`;
    const description = [
      `入学季：${details.intakeLabel}`, `适用对象：${details.applicantGroup}`,
      `截止事项：${details.eventType}`, `官方日期：${details.deadlineText}`,
      details.deadlineAt ? `原始时区：${details.deadlineTimeZone}` : '官方仅公布日期，未披露截止时刻；全天事件不代表可提交至午夜。',
      details.rolling ? '采用滚动审理。' : '', details.mayCloseEarly ? '可能提前满额关闭，请尽早申请。' : '',
      details.sourceNote, `核验日期：${round.verifiedOn}`,
      '此文件为导出快照；官方改期后需重新导出，提醒是否生效取决于日历设置。',
    ].filter(Boolean).join('\n');
    lines.push('BEGIN:VEVENT', `UID:${encodeURIComponent(round.id)}@${domain}`, `SEQUENCE:${round.revision}`, `DTSTAMP:${utcTimestamp(now)}`);
    if (details.deadlineAt) {
      lines.push(`DTSTART:${utcTimestamp(details.deadlineAt)}`);
    } else {
      lines.push(`DTSTART;VALUE=DATE:${deadlineOn.replace(/-/g, '')}`,
        `DTEND;VALUE=DATE:${shiftDailyDate(deadlineOn, 1).replace(/-/g, '')}`);
    }
    lines.push(`SUMMARY:${escapeText(title)}`, `DESCRIPTION:${escapeText(description)}`, `URL:${new URL(details.officialUrl).toString()}`, 'TRANSP:TRANSPARENT');
    for (const days of [30, 7, 1]) {
      lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `TRIGGER:-P${days}D`, `DESCRIPTION:${escapeText(`${title}：截止前 ${days} 天提醒`)}`, 'END:VALARM');
    }
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return `${lines.map(foldLine).join('\r\n')}\r\n`;
}
