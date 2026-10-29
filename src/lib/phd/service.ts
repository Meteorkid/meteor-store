import { createAdmissionsService } from '@/lib/admissions/service';
import { phdSeeds } from './seeds';

export type { AdmissionsNoticeSyncOptions as PhdNoticeSyncOptions } from '@/lib/admissions/service';

export const {
  listRounds: listPhdRounds,
  listAdminRounds: listAdminPhdRounds,
  getRoundsByIds: getPhdRoundsByIds,
  getAutomationRounds: getPhdAutomationRounds,
  getSummary: getPhdSummary,
  saveRound: savePhdRound,
  unpublishRound: unpublishPhdRound,
  importSeeds: importPhdSeeds,
  getWatches: getPhdWatches,
  saveWatch: savePhdWatch,
  removeWatch: removePhdWatch,
  syncNotices: syncPhdNotices,
  getNotices: getPhdNotices,
  markNoticesRead: markPhdNoticesRead,
} = createAdmissionsService('phd', phdSeeds);
