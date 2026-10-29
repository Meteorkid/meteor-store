import { buildAdmissionsCalendar } from '@/lib/admissions/ics';
import type { PhdRound } from './types';

export function buildPhdCalendar(rounds: PhdRound[]): string {
  return buildAdmissionsCalendar(rounds, 'phd');
}
