import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RedeemForm from '@/components/RedeemForm';
import { getSession } from '@/lib/auth';

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
  };
}

export default async function RedeemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const session = await getSession();
  if (!session) redirect('/login');

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
