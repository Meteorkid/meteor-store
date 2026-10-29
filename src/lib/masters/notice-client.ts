'use client';

import { createAdmissionsNoticeClient } from '@/lib/admissions/notice-client';

export const {
  EMPTY_NOTICES: EMPTY_MASTERS_NOTICES,
  subscribeNotices: subscribeMastersNotices,
  getNoticeState: getMastersNoticeState,
  ensureNotices: ensureMastersNotices,
  markRead: markMastersRead,
} = createAdmissionsNoticeClient('masters');
