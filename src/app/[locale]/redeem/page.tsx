import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RedeemForm from '@/components/RedeemForm';
import { getSession } from '@/lib/auth';
import { buildLoginHref } from '@/lib/login-return';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'RedeemPage' });

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  };
}

export default async function RedeemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  if (!session) return redirect({ href: buildLoginHref('/redeem'), locale });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="flex min-h-[60vh] items-center justify-center px-4 py-10">
        <RedeemForm />
      </main>
      <Footer />
    </div>
  );
}
