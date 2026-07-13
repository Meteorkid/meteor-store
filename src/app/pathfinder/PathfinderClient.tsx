'use client';

import { useState } from 'react';
import Link from 'next/link';
import PathfinderForm, { PathfinderFormValue } from '@/components/pathfinder/PathfinderForm';
import PathfinderPlanView from '@/components/pathfinder/PathfinderPlan';
import type { PathfinderPlan } from '@/lib/pathfinder/schema';
import type { PathfinderResource } from '@/data/pathfinder-resources';
import {
  clearPathfinderModelConfig,
  usePathfinderModelConfig,
} from '@/lib/pathfinder/client-config';

interface ApiOk {
  plan: PathfinderPlan;
  resources: PathfinderResource[];
  source: 'model' | 'fallback';
}

export default function PathfinderClient({ initialGoal }: { initialGoal?: string }) {
  const modelConfig = usePathfinderModelConfig();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiOk | null>(null);

  const handleSubmit = async (value: PathfinderFormValue) => {
    if (!modelConfig) {
      setError('请先完成模型配置，再生成你的路径。');
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
        setError(data?.error || `请求失败（${res.status}）`);
        return;
      }
      setResult(data as ApiOk);
      // 滚动到结果区
      setTimeout(() => {
        document.getElementById('pathfinder-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    } catch {
      setError('网络异常，请检查网络后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    setResult(null);
    document.getElementById('pathfinder-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section
        id="pathfinder-form"
        aria-label="填写学习条件"
        className="max-w-2xl mx-auto px-4 sm:px-6"
      >
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              {modelConfig ? '正在使用你的模型配置' : '尚未配置模型'}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {modelConfig
                ? `已选模型：${modelConfig.model}。密钥仅保存在当前浏览器会话。`
                : '配置你的 API Key、Base URL 和模型名称后即可生成路径。'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/pathfinder/settings" className="text-sm font-medium text-purple-200 transition hover:text-purple-100">
              {modelConfig ? '修改配置' : '去配置'}
            </Link>
            {modelConfig && (
              <button
                type="button"
                onClick={clearPathfinderModelConfig}
                className="text-xs text-muted-foreground transition hover:text-foreground"
              >
                清除
              </button>
            )}
          </div>
        </div>
        <PathfinderForm
          initialGoal={initialGoal}
          onSubmit={handleSubmit}
          loading={loading}
        />
        {loading && (
          <p
            role="status"
            aria-live="polite"
            className="text-center text-sm text-muted-foreground mt-4"
          >
            正在基于你的条件生成路径...
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

      {result && (
        <section
          id="pathfinder-result"
          aria-label="生成的学习路径结果"
          className="max-w-2xl mx-auto px-4 sm:px-6 mt-8"
        >
          <PathfinderPlanView
            plan={result.plan}
            resources={result.resources}
            source={result.source}
            onRegenerate={handleRegenerate}
          />
        </section>
      )}
    </>
  );
}
