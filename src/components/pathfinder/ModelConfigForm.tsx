'use client';

import { FormEvent, useState } from 'react';
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
  TRUSTED_MODEL_PROVIDERS,
} from '@/lib/pathfinder/model-providers';

interface Props {
  initialConfig: PathfinderModelConfig | null;
}

/** 用户自带模型配置表单，仅写入 sessionStorage。 */
export default function ModelConfigForm({ initialConfig }: Props) {
  const [apiKey, setApiKey] = useState(initialConfig?.apiKey ?? '');
  const [baseUrl, setBaseUrl] = useState<string>(
    getTrustedModelProvider(initialConfig?.baseUrl ?? '')?.baseUrl
      ?? TRUSTED_MODEL_PROVIDERS[0].baseUrl,
  );
  const [model, setModel] = useState(initialConfig?.model ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(Boolean(initialConfig));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsed = PathfinderModelConfigSchema.safeParse({ apiKey, baseUrl, model });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? '配置格式不正确');
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
        <h2 className="text-xl font-semibold text-foreground">配置你的模型</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          仅支持白名单内的 OpenAI Chat Completions 兼容接口。API Key 只保存在当前浏览器会话，关闭标签页后失效；本站应用代码不会将它写入数据库、日志或 Vercel 环境变量。
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
          placeholder="粘贴你自己的 API Key"
          className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-purple-5 focus:ring-2 focus:ring-purple-5/30"
        />
      </Field>

      <Field label="模型服务商" htmlFor="pathfinder-base-url">
        <select
          id="pathfinder-base-url"
          value={baseUrl}
          onChange={(event) => setBaseUrl(event.target.value)}
          aria-describedby="pathfinder-base-url-hint"
          className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-purple-5 focus:ring-2 focus:ring-purple-5/30"
        >
          {TRUSTED_MODEL_PROVIDERS.map((provider) => (
            <option key={provider.id} value={provider.baseUrl} className="bg-gray-9 text-foreground">
              {provider.name}
            </option>
          ))}
        </select>
        <p id="pathfinder-base-url-hint" className="mt-1.5 text-xs text-muted-foreground">
          将使用 <code>{baseUrl}</code>，系统会在其后调用 <code>/chat/completions</code>。
        </p>
      </Field>

      <Field label="模型名称" htmlFor="pathfinder-model">
        <input
          id="pathfinder-model"
          type="text"
          value={model}
          onChange={(event) => setModel(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          required
          placeholder="填写服务商提供的模型 ID"
          className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-purple-5 focus:ring-2 focus:ring-purple-5/30"
        />
      </Field>

      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100/90 leading-relaxed">
        请只使用你有权使用的模型服务。点击“保存并使用”后，密钥仅在你提交生成请求时通过 HTTPS 发往本站服务端，并立刻转发给你选择的模型服务商；请勿在不可信设备上保存配置。
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {saved && !error && (
        <p role="status" className="rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2 text-sm text-green-300">
          配置已保存到当前浏览器会话。
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={handleClear}
          className="rounded-xl border border-white/15 px-4 py-3 text-sm text-foreground transition hover:bg-white/5"
        >
          清除本次配置
        </button>
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-purple-6 to-violet-6 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-6/30 transition hover:shadow-purple-6/50"
        >
          保存并使用
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
