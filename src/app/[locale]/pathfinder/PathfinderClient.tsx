'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import PathfinderForm, { PathfinderFormValue } from '@/components/pathfinder/PathfinderForm';
import PathfinderPlanView from '@/components/pathfinder/PathfinderPlan';
import type { PathfinderPlan } from '@/lib/pathfinder/schema';
import type { PathfinderResource } from '@/data/pathfinder-resources';
import { PRESET_CASES, type PresetCase } from '@/data/pathfinder/preset-cases';
import { toRealityConstraints, type RealityConstraints } from '@/lib/pathfinder/contract';
import {
  clearPathfinderModelConfig,
  usePathfinderModelConfig,
} from '@/lib/pathfinder/client-config';

interface ApiOk {
  plan: PathfinderPlan;
  resources: PathfinderResource[];
  source: 'model' | 'fallback' | 'preset';
}

export default function PathfinderClient({ initialGoal }: { initialGoal?: string }) {
  const t = useTranslations('PathfinderClient');
  const modelConfig = usePathfinderModelConfig();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiOk | null>(null);
  const [realityConstraints, setRealityConstraints] = useState<RealityConstraints | null>(null);

  const handleSubmit = async (value: PathfinderFormValue) => {
    if (!modelConfig) {
      setError(t('errorNoConfig'));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pathfinder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: value, modelConfig }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || t('errorRequest', { status: res.status }));
        return;
      }
      setResult(data as ApiOk);
      setRealityConstraints(toRealityConstraints(value));
      // 滚动到结果区
      setTimeout(() => {
        document.getElementById('pathfinder-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    } catch {
      setError(t('errorNetwork'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    setResult(null);
    document.getElementById('pathfinder-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePreset = (preset: PresetCase) => {
    setError(null);
    setResult(preset.result);
    setRealityConstraints(toRealityConstraints(preset.input));
    setTimeout(() => {
      document.getElementById('today')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <>
      <section
        id="conditions"
        aria-label={t('sectionTitle')}
        className="max-w-2xl mx-auto px-4 sm:px-6"
      >
        <div className="mb-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-xl font-semibold text-foreground">{t('sectionTitle')}</h2>
            <span className="text-xs px-2 py-1 rounded-md bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
              {t('noApiKey')}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESET_CASES.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePreset(preset)}
                className="text-left rounded-2xl border border-white/10 bg-black/15 p-4 transition hover:border-purple-5/50 hover:bg-purple-6/10 focus:outline-none focus:ring-2 focus:ring-purple-5"
              >
                <span className="inline-flex rounded-md bg-yellow-500/15 px-2 py-1 text-[10px] text-yellow-300 border border-yellow-500/30">
                  {t('presetBadge')}
                </span>
                <span className="mt-3 block font-medium text-foreground">{preset.title}</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{preset.scenario}</span>
                <span className="mt-3 inline-flex rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-muted-foreground">
                  {t('presetTag')}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              {modelConfig ? t('usingConfig') : t('generateOwn')}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {modelConfig
                ? t('usingConfigDetail', { model: modelConfig.model })
                : t('configHint')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/pathfinder/settings" className="text-sm font-medium text-purple-200 transition hover:text-purple-100">
              {modelConfig ? t('editConfig') : t('setupConfig')}
            </Link>
            {modelConfig && (
              <button
                type="button"
                onClick={clearPathfinderModelConfig}
                className="text-xs text-muted-foreground transition hover:text-foreground"
              >
                {t('clear')}
              </button>
            )}
          </div>
        </div>
        <div id="pathfinder-form">
          <PathfinderForm
            initialGoal={initialGoal}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
        {loading && (
          <p
            role="status"
            aria-live="polite"
            className="text-center text-sm text-muted-foreground mt-4"
          >
            {t('loading')}
          </p>
        )}
        {error && !loading && (
          <p
            role="alert"
            className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-center"
          >
            {error}
          </p>
        )}
      </section>

      {result && realityConstraints && (
        <section
          id="pathfinder-result"
          aria-label={t('sectionTitle')}
          className="max-w-2xl mx-auto px-4 sm:px-6 mt-8"
        >
          <PathfinderPlanView
            key={`${result.source}-${result.plan.summary}`}
            plan={result.plan}
            resources={result.resources}
            source={result.source}
            realityConstraints={realityConstraints}
            onRegenerate={handleRegenerate}
          />
        </section>
      )}
    </>
  );
}
