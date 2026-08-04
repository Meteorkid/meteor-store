import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StudentVerificationForm from '@/components/StudentVerificationForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'StudentPage' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function StudentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'StudentPage' });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          {/* Hero */}
          <div className="mb-12">
            <span className="mb-4 inline-block text-5xl">🎓</span>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t('title')}</h1>
            <p className="mx-auto max-w-lg text-lg leading-relaxed text-gray-400">
              {t('description')}
            </p>
          </div>

          <div className="mx-auto max-w-md">
            <StudentVerificationForm />
          </div>

          <div className="mx-auto mt-6 max-w-md rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-6 text-left">
            <h2 className="mb-2 text-base font-semibold text-amber-200">{t('manualTitle')}</h2>
            <p className="text-sm leading-relaxed text-gray-300">
              {t('manualDescription')}
              <a
                href={`mailto:meteor@stu.gpnu.edu.cn?subject=${encodeURIComponent(t('emailSubject'))}`}
                className="mx-1 underline decoration-amber-300/40 underline-offset-4 hover:decoration-amber-300"
              >
                meteor@stu.gpnu.edu.cn
              </a>
              {t('manualAction')}
            </p>
          </div>

          {/* FAQ */}
          <div className="mt-16 text-left">
            <h2 className="mb-6 text-xl font-bold">{t('faq')}</h2>
            <div className="space-y-4">
              <FaqItem
                q={t('faq1Question')}
                a={t('faq1Answer')}
              />
              <FaqItem
                q={t('faq2Question')}
                a={t('faq2Answer')}
              />
              <FaqItem
                q={t('faq3Question')}
                a={t('faq3Answer')}
              />
            </div>
          </div>

          <div className="mt-12">
            <Link href="/" className="text-sm text-violet-300 transition-colors hover:text-violet-200">
              ← {t('backToHome')}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
      <p className="mb-2 font-semibold text-white">{q}</p>
      <p className="text-sm leading-relaxed text-gray-400">{a}</p>
    </div>
  );
}
