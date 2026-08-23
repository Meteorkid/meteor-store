import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

interface JournalEntry {
  idx: number;
  when: number;
  tag: string;
}

interface MigrationJournal {
  entries: JournalEntry[];
}

const drizzleDir = path.join(process.cwd(), 'drizzle');
const journal = JSON.parse(
  readFileSync(path.join(drizzleDir, 'meta', '_journal.json'), 'utf8'),
) as MigrationJournal;

describe('Drizzle migration journal', () => {
  it('登记仓库中的每一个 SQL 迁移文件', () => {
    const migrationFiles = readdirSync(drizzleDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();
    const journalFiles = journal.entries
      .map((entry) => `${entry.tag}.sql`)
      .sort();

    expect(journalFiles).toEqual(migrationFiles);
  });

  it('最新 journal 条目有对应的 schema snapshot', () => {
    const snapshotIndexes = readdirSync(path.join(drizzleDir, 'meta'))
      .map((file) => file.match(/^(\d{4})_snapshot\.json$/)?.[1])
      .filter((index): index is string => Boolean(index))
      .map(Number);
    const latestSnapshotIndex = Math.max(...snapshotIndexes);
    const latestJournalIndex = journal.entries.at(-1)?.idx;

    expect(latestSnapshotIndex).toBe(latestJournalIndex);
  });

  it('最新 snapshot 覆盖所有已登记的数据表', () => {
    const latestJournalIndex = journal.entries.at(-1)?.idx;
    const snapshotPath = path.join(
      drizzleDir,
      'meta',
      `${String(latestJournalIndex).padStart(4, '0')}_snapshot.json`,
    );
    const snapshot = JSON.parse(readFileSync(snapshotPath, 'utf8')) as {
      tables?: Record<string, unknown>;
    };
    const tableNames = Object.keys(snapshot.tables ?? {});

    expect(tableNames).toContain('public.post_favorites');
    expect(tableNames).toContain('public.reports');
    expect(tableNames).toContain('public.tollow_book_progress');
    expect(tableNames).toContain('public.tollow_practice_sessions');
    expect(tableNames).toContain('public.tollow_text_favorites');
  });
});
