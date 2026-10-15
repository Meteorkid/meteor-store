import type { MastersRound, MastersWatch } from '@/lib/masters/types';

export function roundFixture(overrides: Partial<MastersRound> = {}): MastersRound {
  return {
    id: 'school-cs-2027-round1', intakeYear: 2027, region: 'hong-kong', status: 'published',
    verifiedOn: '2026-10-12', revision: 1, dateVersion: 1, dateChangedAt: null, previousDeadlineText: null,
    createdAt: '2026-10-12T00:00:00.000Z', updatedAt: '2026-10-12T00:00:00.000Z',
    details: {
      university: 'Example University', programme: 'MSc Computer Science', subject: 'Computer Science',
      studyType: 'taught', studyMode: 'Full-time', intakeLabel: 'September 2027', applicantGroup: 'International applicants',
      roundName: 'Round 1', eventType: 'application', opensOn: '2026-10-01', openingNote: '', openingState: 'scheduled',
      deadlineStatus: 'confirmed', deadlineOn: '2026-12-01', deadlineAt: null, deadlineTimeZone: null,
      deadlineText: '1 December 2026', rolling: false, mayCloseEarly: false,
      officialUrl: 'https://example.edu/admissions', sourceNote: 'The programme page lists Round 1 dates.',
    },
    ...overrides,
  };
}

export function watchFixture(roundId = 'school-cs-2027-round1'): MastersWatch {
  return { roundId, status: 'preparing', reminders: false, updatedAt: '2026-10-14T00:00:00.000Z' };
}
