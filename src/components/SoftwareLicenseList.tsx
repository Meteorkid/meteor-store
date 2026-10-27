import type { SoftwareLicenseCodeView } from '@/lib/software-licenses/types';

export default function SoftwareLicenseList({ licenses, locale }: {
  licenses: SoftwareLicenseCodeView[];
  locale: string;
}) {
  const en = locale === 'en';
  const kinds = en
    ? { monthly: '1-month activation code', annual: '1-year activation code', lifetime: 'Lifetime activation code' }
    : { monthly: '一个月激活码', annual: '一年激活码', lifetime: '永久激活码' };
  const statuses = en
    ? { active: 'Active', revoked: 'Revoked', expired: 'Expired' }
    : { active: '有效', revoked: '已撤销', expired: '已到期' };
  return (
    <div className="space-y-3">
      {licenses.map(license => (
        <article key={license.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left">
          <div className="flex flex-wrap justify-between gap-2">
            <h3 className="font-medium text-white">{license.productName} · {kinds[license.kind]}</h3>
            <span className="text-sm text-white/70">{statuses[license.status]}</span>
          </div>
          <code className="mt-3 block break-all rounded-lg bg-black/30 p-3 text-sm text-emerald-300 select-all">{license.code}</code>
          <p className="mt-2 text-sm text-white/70">
            {license.expiresAt
              ? `${en ? 'Valid until' : '有效期至'} ${new Date(license.expiresAt).toLocaleString(en ? 'en-US' : 'zh-CN', { timeZone: 'Asia/Shanghai' })} (UTC+8)`
              : license.status === 'active'
                ? en ? 'Current access has no subscription expiry' : '当前权益永久有效，无需续费'
                : en ? 'No valid access period' : '当前无有效授权期限'}
          </p>
        </article>
      ))}
    </div>
  );
}
