import { createAdmissionsService } from '@/lib/admissions/service';
import { mastersSeeds } from './seeds';

export type { AdmissionsNoticeSyncOptions as MastersNoticeSyncOptions } from '@/lib/admissions/service';

export const {
  listRounds: listMastersRounds,
  listAdminRounds: listAdminMastersRounds,
  getRoundsByIds: getMastersRoundsByIds,
  getAutomationRounds: getMastersAutomationRounds,
  getSummary: getMastersSummary,
  saveRound: saveMastersRound,
  unpublishRound: unpublishMastersRound,
  importSeeds: importMastersSeeds,
  getWatches: getMastersWatches,
  saveWatch: saveMastersWatch,
  removeWatch: removeMastersWatch,
  syncNotices: syncMastersNotices,
  getNotices: getMastersNotices,
  markNoticesRead: markMastersNoticesRead,
} = createAdmissionsService('masters', mastersSeeds);
