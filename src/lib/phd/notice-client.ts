'use client';

import { createAdmissionsNoticeClient } from '@/lib/admissions/notice-client';

export const {
  EMPTY_NOTICES: EMPTY_PHD_NOTICES,
  subscribeNotices: subscribePhdNotices,
  getNoticeState: getPhdNoticeState,
  ensureNotices: ensurePhdNotices,
  markRead: markPhdRead,
} = createAdmissionsNoticeClient('phd');
