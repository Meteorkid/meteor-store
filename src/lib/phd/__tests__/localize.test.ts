import { describe, expect, it } from 'vitest';
import { localizeMastersRound } from '@/lib/masters/localize';
import type { MastersRound } from '@/lib/masters/types';
import { phdSeeds } from '../seeds';

/** 英文页只翻译结构化字段；来源说明保留原文，由页面上的 SourceLanguageNote 说明。 */
describe('博士项目英文展示', () => {
  it('种子里的学校、项目、方向、轮次与申请说明都不留中文', () => {
    for (const seed of phdSeeds) {
      const round: MastersRound = {
        ...seed, status: 'published', verifiedOn: '2026-11-01',
        revision: 1, dateVersion: 1, dateChangedAt: null, previousDeadlineText: null,
        createdAt: '2026-11-01T00:00:00Z', updatedAt: '2026-11-01T00:00:00Z',
        id: seed.id ?? 'seed',
      };
      const en = localizeMastersRound(round, 'en').details;
      for (const value of [
        en.university, en.programme, en.subject, en.intakeLabel, en.studyMode,
        en.applicantGroup, en.roundName, en.deadlineText, en.openingNote,
      ]) {
        expect(value, `${seed.id}: ${value}`).not.toMatch(/[\u4e00-\u9fff]/);
      }
    }
  });
});
