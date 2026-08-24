import type { TollowAnalyticsSession } from './tollow-analytics';

const CSV_HEADERS = [
  '开始时间',
  '结束时间',
  '书籍',
  '练习时长（秒）',
  '输入字数',
  'WPM',
  '准确率',
  '错误数',
];

function escapeCsvCell(value: string | number): string {
  let text = String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function buildTollowSessionsCsv(sessions: TollowAnalyticsSession[]): string {
  const rows = sessions.map((session) => [
    session.startedAt,
    session.endedAt,
    session.bookTitle,
    Math.round(session.durationMs / 10) / 100,
    session.wordsTyped,
    session.wpm,
    session.accuracy,
    session.errorCount,
  ]);
  return `\uFEFF${[CSV_HEADERS, ...rows]
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\r\n')}\r\n`;
}
