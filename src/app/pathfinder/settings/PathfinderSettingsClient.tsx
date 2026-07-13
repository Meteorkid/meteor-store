'use client';

import Link from 'next/link';
import ModelConfigForm from '@/components/pathfinder/ModelConfigForm';
import { usePathfinderModelConfig } from '@/lib/pathfinder/client-config';

export default function PathfinderSettingsClient() {
  const config = usePathfinderModelConfig();

  return (
    <main className="min-h-screen pb-24 pt-12 sm:pt-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <Link href="/pathfinder" className="text-sm text-purple-200 transition hover:text-purple-100">
          ← 返回星途导航
        </Link>
        <header className="mb-8 mt-6">
          <p className="text-sm font-medium text-purple-200">你的密钥，你的选择</p>
          <h1 className="mt-2 text-3xl font-bold gradient-text sm:text-4xl">模型配置</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Pathfinder 不提供或托管模型密钥。请使用你自己的兼容模型服务，在生成时获得可控的调用权与费用归属。
          </p>
        </header>
        <ModelConfigForm key={config?.savedAt ?? 'empty'} initialConfig={config} />
      </div>
    </main>
  );
}
