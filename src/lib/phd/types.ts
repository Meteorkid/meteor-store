import { MastersRoundDetailsSchema, MastersRoundInputSchema } from '@/lib/masters/types';

export const PhdRoundDetailsSchema = MastersRoundDetailsSchema.refine(details => details.studyType === 'research', {
  path: ['studyType'], message: 'PhD applications must use research study type',
});
export const PhdRoundInputSchema = MastersRoundInputSchema.refine(input => input.details.studyType === 'research', {
  path: ['details', 'studyType'], message: 'PhD rounds must use research study type',
});

export {
  MastersWatchInputSchema as PhdWatchInputSchema,
  defaultMastersYear as defaultPhdYear,
  mastersRegions as phdRegions,
} from '@/lib/masters/types';
export type {
  MastersRound as PhdRound, MastersRoundInput as PhdRoundInput,
  MastersRoundDetails as PhdRoundDetails, MastersWatch as PhdWatch,
  MastersWatchInput as PhdWatchInput, MastersNotice as PhdNotice,
  MastersSummary as PhdSummary,
} from '@/lib/masters/types';
