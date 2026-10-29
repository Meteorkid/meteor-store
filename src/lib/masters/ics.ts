import { buildAdmissionsCalendar } from '@/lib/admissions/ics';
import type { MastersRound } from './types';

export function buildMastersCalendar(rounds: MastersRound[]): string {
  return buildAdmissionsCalendar(rounds, 'masters');
}
