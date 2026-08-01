'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  PathfinderModelConfig,
  PathfinderModelConfigSchema,
} from '@/lib/pathfinder/schema';
import {
  clearPathfinderModelConfig,
  savePathfinderModelConfig,
} from '@/lib/pathfinder/client-config';
import {
  getTrustedModelProvider,
  MODEL_PROVIDER_GROUPS,
  TRUSTED_MODEL_PROVIDERS,
} from '@/lib/pathfinder/model-providers';

interface Props {
  initialConfig: PathfinderModelConfig | null;
}

/** 用户自带模型配置表单，仅写入 sessionStorage。 */
export default function ModelConfigForm({ initialConfig }: Props) {
  const t = useTranslations('PathfinderSettingsPage');
  const [apiKey, setApiKey] = useState(initialConfig?.apiKey ?? '');
  const [baseUrl, setBaseUrl] = useState<string>(
    getTrustedModelProvider(initialConfig?.baseUrl ?? '')?.baseUrl
      ?? TRUSTED_MODEL_PROVIDERS[0].baseUrl,
  );
  const [model, setModel] = useState(initialConfig?.model ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(Boolean(initialConfig));
  const selectedProvider = getTrustedModelProvider(baseUrl) ?? TRUSTED_MODEL_PROVIDERS[0];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsed = PathfinderModelConfigSchema.safeParse({ apiKey, baseUrl, model });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t('configInvalid'));
      return;
    }

    savePathfinderModelConfig(parsed.data);
    setSaved(true);
  };

  const handleClear = () => {
    clearPathfinderModelConfig();
    setApiKey('');
    setBaseUrl(TRUSTED_MODEL_PROVIDERS[0].baseUrl);
    setModel('');
    setSaved(false);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-8 space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground">{t('formTitle')}</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {t('formDescription')}
        </p>
      </div>

      <Field label="API Key" htmlFor="pathfinder-api-key">
        <input
          id="pathfinder-api-key"
          type="password"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          required
          placeholder={t('apiKeyPlaceholder')}
          className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-purple-5 focus:ring-2 focus:ring-purple-5/30"
        />
      </Field>

      <Field label={t('providerLabel')} htmlFor="pathfinder-base-url">
        <select
          id="pathfinder-base-url"
          value={baseUrl}
          onChange={(event) => setBaseUrl(event.target.value)}
          aria-describedby="pathfinder-base-url-hint"
          className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-purple-5 focus:ring-2 focus:ring-purple-5/30"
        >
          {MODEL_PROVIDER_GROUPS.map((group) => (
            <optgroup key={group} label={group}>
              {TRUSTED_MODEL_PROVIDERS
                .filter((provider) => provider.group === group)
                .map((provider) => (
                  <option key={provider.id} value={provider.baseUrl} className="bg-gray-9 text-foreground">
                    {provider.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        <p id="pathfinder-base-url-hint" className="mt-1.5 text-xs text-muted-foreground">
          {t('providerHint', { baseUrl })}{' '}
          <a
            href={selectedProvider.docsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-purple-3 underline-offset-2 hover:underline"
          >
            {t('providerDocs', { name: selectedProvider.name })}
          </a>
        </p>
      </Field>

      <Field label={t('modelLabel')} htmlFor="pathfinder-model">
        <input
          id="pathfinder-model"
          type="text"
          value={model}
          onChange={(event) => setModel(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          required
          placeholder={t('modelPlaceholder')}
          className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-purple-5 focus:ring-2 focus:ring-purple-5/30"
        />
      </Field>

      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100/90 leading-relaxed">
        {t('warning')}
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {saved && !error && (
        <p role="status" className="rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2 text-sm text-green-300">
          {t('saved')}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={handleClear}
          className="rounded-xl border border-white/15 px-4 py-3 text-sm text-foreground transition hover:bg-white/5"
        >
          {t('clear')}
        </button>
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-purple-6 to-violet-6 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-6/30 transition hover:shadow-purple-6/50"
        >
          {t('save')}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
