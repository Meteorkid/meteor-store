import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthForm from '@/components/AuthForm';
import { normalizeLoginReturn } from '@/lib/login-return';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'LoginPage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ verified?: string; wechat?: string; mfa?: string; next?: string }>;
}) {
  const { locale } = await params;
  const { verified, wechat, mfa, next } = await searchParams;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto flex items-center justify-center px-4 py-16 md:py-24">
        {/* mfa=1 由微信扫码回调重定向带上：挑战票在 httpOnly cookie 里，URL 只留无害标记 */}
        <AuthForm
          verified={verified === '1'}
          wechatError={wechat ?? null}
          mfaChallenge={mfa === '1'}
          next={normalizeLoginReturn(next)}
        />
      </main>
      <Footer />
    </div>
  );
}
