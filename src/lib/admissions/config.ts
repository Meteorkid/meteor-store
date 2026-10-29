export type AdmissionsKind = 'masters' | 'phd';

/** 路由和账号协议由调用页面固定选择，不接受请求体指定数据表。 */
export const admissionsConfig = {
  masters: {
    href: '/masters', apiBase: '/api/masters', adminHref: '/admin/masters',
    adminApiBase: '/api/admin/masters', ownerHeader: 'X-Masters-User',
    changedEvent: 'masters-watches-changed', eyebrow: 'MASTERS · ADMISSIONS',
    label: { zh: '硕士申请', en: 'Master’s applications' },
  },
  phd: {
    href: '/phd', apiBase: '/api/phd', adminHref: '/admin/phd',
    adminApiBase: '/api/admin/phd', ownerHeader: 'X-Phd-User',
    changedEvent: 'phd-watches-changed', eyebrow: 'PHD · ADMISSIONS',
    label: { zh: '博士申请', en: 'PhD applications' },
  },
} as const;
