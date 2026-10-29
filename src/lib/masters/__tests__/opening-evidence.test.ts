import { describe, expect, it } from 'vitest';
import { roundFixture } from '@/components/masters/__tests__/fixtures';
import { withMastersOpeningEvidence } from '../opening-evidence';
import { MastersRoundDetailsSchema, type MastersRound, type MastersRoundInput } from '../types';

const now = new Date('2026-10-29T04:00:00Z');
function openRound(): MastersRound {
  const base = roundFixture();
  return { ...base, details: { ...base.details, opensOn: null, openingState: 'open' } };
}
function input(previous = openRound()): MastersRoundInput {
  return { id: previous.id, intakeYear: previous.intakeYear, region: previous.region,
    status: 'published', verifiedOn: '2026-10-29', details: { ...previous.details } };
}

describe('首次开放核验证据', () => {
  it('旧JSON无需新增字段，新字段只接受真实日历日或null', () => {
    const details = openRound().details;
    expect(MastersRoundDetailsSchema.parse(details)).not.toHaveProperty('firstObservedOpenOn');
    expect(MastersRoundDetailsSchema.parse({ ...details, firstObservedOpenOn: null }).firstObservedOpenOn).toBeNull();
    expect(MastersRoundDetailsSchema.parse({ ...details, firstObservedOpenOn: '2026-10-12' }).firstObservedOpenOn).toBe('2026-10-12');
    expect(MastersRoundDetailsSchema.safeParse({ ...details, firstObservedOpenOn: '2026-02-30' }).success).toBe(false);
  });

  it('首次升级取旧已发布open的核验日，后续每日核验不移动起点', () => {
    const previous = openRound();
    const saved = withMastersOpeningEvidence(input(previous), previous, now);
    expect(saved.details.firstObservedOpenOn).toBe('2026-10-12');
    expect(saved.verifiedOn).toBe('2026-10-29');
    const next = { ...input(previous), verifiedOn: '2026-10-30' };
    expect(withMastersOpeningEvidence(next, { ...previous, ...saved }, new Date('2026-10-30T04:00:00Z'))
      .details.firstObservedOpenOn).toBe('2026-10-12');
  });

  it('忽略客户端提前回填或删除，保留服务端已有首次证据', () => {
    const previous = openRound();
    previous.details.firstObservedOpenOn = '2026-10-01';
    for (const supplied of ['2020-01-01', null, undefined]) {
      const value = input(previous);
      value.details.firstObservedOpenOn = supplied;
      expect(withMastersOpeningEvidence(value, previous, now).details.firstObservedOpenOn).toBe('2026-10-01');
    }
  });

  it('新记录只从当前核验开始，不接纳客户端虚构起点', () => {
    const value = input();
    value.details.firstObservedOpenOn = '2020-01-01';
    expect(withMastersOpeningEvidence(value, undefined, now).details.firstObservedOpenOn).toBe('2026-10-29');
  });

  it.each(['unknown', 'scheduled', 'closed'] as const)('从%s再次变open时以本次核验开启新证据段', state => {
    const previous = openRound();
    previous.details.openingState = state;
    previous.details.firstObservedOpenOn = '2026-10-01';
    const value = input(previous);
    value.details.openingState = 'open';
    expect(withMastersOpeningEvidence(value, previous, now).details.firstObservedOpenOn).toBe('2026-10-29');
  });

  it('关闭时保留已证实的历史起点，不把关闭核验日当作起点', () => {
    const previous = openRound();
    previous.details.firstObservedOpenOn = '2026-10-01';
    const value = input(previous);
    value.details.openingState = 'closed';
    expect(withMastersOpeningEvidence(value, previous, now).details.firstObservedOpenOn).toBe('2026-10-01');
  });

  it('截止后仍保留已有首次证据，不用截止后的最新核验重新画起', () => {
    const previous = openRound();
    previous.verifiedOn = '2026-10-28';
    previous.details.deadlineOn = '2026-10-20';
    previous.details.firstObservedOpenOn = '2026-10-12';
    expect(withMastersOpeningEvidence(input(previous), previous, now).details.firstObservedOpenOn).toBe('2026-10-12');
    delete previous.details.firstObservedOpenOn;
    expect(withMastersOpeningEvidence(input(previous), previous, now).details).not.toHaveProperty('firstObservedOpenOn');
  });

  it.each(['unknown', 'scheduled', 'closed'] as const)('新%s记录没有首次开放证据', state => {
    const value = input();
    value.details.openingState = state;
    expect(withMastersOpeningEvidence(value, undefined, now).details).not.toHaveProperty('firstObservedOpenOn');
  });

  it('草稿、未核验、未来核验及已过截止的核验不能生成首次证据', () => {
    const value = input();
    const cases: MastersRoundInput[] = [
      { ...value, status: 'draft' }, { ...value, verifiedOn: null },
      { ...value, verifiedOn: '2026-10-30' },
      { ...value, details: { ...value.details, deadlineOn: '2026-10-28' } },
    ];
    for (const item of cases) expect(withMastersOpeningEvidence(item, undefined, now).details).not.toHaveProperty('firstObservedOpenOn');
  });

  it('旧草稿与缺核验记录的createdAt不能作为历史证据', () => {
    for (const previous of [openRound(), { ...openRound(), status: 'draft' as const }]) {
      previous.verifiedOn = null;
      previous.createdAt = '2025-01-01T00:00:00Z';
      previous.details.firstObservedOpenOn = '2025-01-01';
      expect(withMastersOpeningEvidence(input(), previous, now).details.firstObservedOpenOn).toBe('2026-10-29');
    }
  });

  it('超过旧核验日的首次证据被拒绝，回到可靠核验日', () => {
    const previous = openRound();
    previous.details.firstObservedOpenOn = '2026-10-28';
    expect(withMastersOpeningEvidence(input(previous), previous, now).details.firstObservedOpenOn).toBe('2026-10-12');
  });

  it.each(['id', 'intakeYear', 'region', 'programme', 'intakeLabel', 'applicantGroup', 'roundName', 'eventType', 'officialUrl'])(
    '%s改变时不能继承其他来源或申请范围的证据', field => {
      const previous = openRound();
      const value = input(previous);
      if (field === 'id') value.id = 'different-round';
      else if (field === 'intakeYear') value.intakeYear += 1;
      else if (field === 'region') value.region = 'singapore';
      else if (field === 'eventType') value.details.eventType = 'documents';
      else if (field === 'officialUrl') value.details.officialUrl = 'https://example.edu/new-source';
      else value.details[field as 'programme' | 'intakeLabel' | 'applicantGroup' | 'roundName'] += ' changed';
      expect(withMastersOpeningEvidence(value, previous, now).details.firstObservedOpenOn).toBe('2026-10-29');
    },
  );

  it('修改说明和截止日期保留同一轮首次证据，输入对象不被改写', () => {
    const previous = openRound();
    const value = input(previous);
    value.details.sourceNote = '核对后更正说明。';
    value.details.deadlineOn = '2027-02-01';
    const snapshot = structuredClone(value);
    expect(withMastersOpeningEvidence(value, previous, now).details.firstObservedOpenOn).toBe('2026-10-12');
    expect(value).toEqual(snapshot);
  });
});
