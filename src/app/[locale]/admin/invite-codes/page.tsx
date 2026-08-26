import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import InviteCodeManager from '@/components/InviteCodeManager';
import { getAdminPageSession } from '@/lib/admin-session';
import { isAdminSession } from '@/lib/admin';
import { products } from '@/data/products';
import { PASS_NAME, PASS_PRODUCT_ID, passPlans } from '@/data/pass';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AdminInviteCodesPage' });
  const session = await getAdminPageSession();
  const allowed = session && isAdminSession(session);
  return {
    title: allowed ? t('metaTitle') : t('metaNotFound'),
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-dynamic';

export default async function InviteCodesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'AdminInviteCodesPage' });
  const session = await getAdminPageSession();
  if (!session || !isAdminSession(session)) notFound();

  // 全站会员排在最前：发 Pass 是最常用的赠码场景，单品发码次之
  const productOptions = [
    {
      id: PASS_PRODUCT_ID,
      name: PASS_NAME[locale as Locale],
      plans: passPlans.map((plan) => ({
        id: plan.id,
        name: plan.name[locale as Locale],
      })),
    },
    ...products.map((p) => ({
      id: p.id,
      name: p.name[locale as Locale],
      plans: p.pricing.map((pr) => ({
        id: pr.id,
        name: pr.name[locale as Locale],
      })),
    })),
  ];

  return (
    <>
      <header className="mb-8">
        <h1 className="t-title-2">{t('title')}</h1>
        <p className="mt-2 text-sm text-gray-400">
          {t('description')}
        </p>
      </header>
      <InviteCodeManager products={productOptions} />
    </>
  );
}
