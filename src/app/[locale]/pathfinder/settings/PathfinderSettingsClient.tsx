'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ModelConfigForm from '@/components/pathfinder/ModelConfigForm';
import { usePathfinderModelConfig } from '@/lib/pathfinder/client-config';

export default function PathfinderSettingsClient() {
  const t = useTranslations('PathfinderSettingsPage');
  const config = usePathfinderModelConfig();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pb-24 pt-12 sm:pt-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <Link href="/pathfinder" className="text-sm text-purple-200 transition hover:text-purple-100">
            {t('backLink')}
          </Link>
          <header className="mb-8 mt-6">
            <p className="text-sm font-medium text-purple-200">{t('eyebrow')}</p>
            <h1 className="mt-2 text-3xl font-bold gradient-text sm:text-4xl">{t('title')}</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {t('description')}
            </p>
          </header>
          <ModelConfigForm key={config?.savedAt ?? 'empty'} initialConfig={config} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
