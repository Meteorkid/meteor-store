import { DailyDateSchema, dailyDate } from '@/lib/daily/types';
import type { MastersRound, MastersRoundInput } from './types';

function sameEvidenceScope(input: MastersRoundInput, previous: MastersRound): boolean {
  const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');
  const fields = ['university', 'programme', 'studyType', 'studyMode', 'intakeLabel',
    'applicantGroup', 'roundName', 'eventType'] as const;
  return input.id === previous.id && input.intakeYear === previous.intakeYear
    && input.region === previous.region && input.details.officialUrl === previous.details.officialUrl
    && fields.every(field => normalize(input.details[field]) === normalize(previous.details[field]));
}

/**
 * 首次证据由保存端推导，不能从表单提供的日期或 createdAt 回填。
 * 关闭后的证据只留作历史；再次确认开放时开始新一段，不跨关闭或未知状态续接。
 */
export function withMastersOpeningEvidence(
  input: MastersRoundInput, previous?: MastersRound, now = new Date(),
): MastersRoundInput {
  const details = { ...input.details };
  delete details.firstObservedOpenOn;
  const today = dailyDate(now);
  const isVerified = (date: unknown): date is string => DailyDateSchema.safeParse(date).success
    && typeof date === 'string' && date <= today;
  if (input.status !== 'published' || !isVerified(input.verifiedOn)) return { ...input, details };

  const candidates: string[] = [];
  const sameScope = previous?.status === 'published' && sameEvidenceScope(input, previous);
  const reopening = details.openingState === 'open' && previous?.details.openingState !== 'open';
  if (sameScope && !reopening && isVerified(previous.verifiedOn)) {
    const first = previous.details.firstObservedOpenOn;
    if (isVerified(first) && first <= previous.verifiedOn
      && (!previous.details.deadlineOn || first <= previous.details.deadlineOn)) candidates.push(first);
    // 首次升级只保留这一条已发布记录真实已有的开放核验，不能追溯更早日期。
    if (previous.details.openingState === 'open'
      && (!previous.details.deadlineOn || previous.verifiedOn <= previous.details.deadlineOn)) {
      candidates.push(previous.verifiedOn);
    }
  }
  if (details.openingState === 'open' && (!details.deadlineOn || input.verifiedOn <= details.deadlineOn)) {
    candidates.push(input.verifiedOn);
  }
  if (candidates.length) details.firstObservedOpenOn = candidates.sort()[0];
  return { ...input, details };
}
