import type { ReactNode } from 'react';
import type { Product } from '@/data/products';

const iconMap: Record<string, { svg: ReactNode; color: string }> = {
  gitee: {
    svg: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.926c0 .982.796 1.778 1.778 1.778h4.455c.982 0 1.778-.796 1.778-1.778V14.52a.593.593 0 0 0-.593-.593h-4.453a.593.593 0 0 1-.592-.593v-1.482a.593.593 0 0 1 .593-.592h6.908a.593.593 0 0 1 .593.593v4.074a4.74 4.74 0 0 1-4.74 4.741H9.777a4.74 4.74 0 0 1-4.74-4.741V9.778a4.74 4.74 0 0 1 4.74-4.74h8.445l.852-.005z" />
      </svg>
    ),
    color: 'text-red-400',
  },
  pypi: {
    svg: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.585 11.692l4.83 2.79-4.83 2.79zm-1.005.582v5.58l-4.83-2.79zm6.84 2.208l4.83-2.79v5.58zm1.005-.582l-4.83-2.79 4.83-2.79zM9 .585l4.83 2.79L9 6.165zm-1.005.582v5.58L3.165 3.957zm6.84 2.208l4.83-2.79v5.58zm1.005-.582L11.01 0l4.83 2.793zM9.585 6.277l4.83 2.79-4.83 2.79zm-1.005.582v5.58l-4.83-2.79zm6.84 2.208l4.83-2.79v5.58zm1.005-.582l-4.83-2.79 4.83-2.79z" />
      </svg>
    ),
    color: 'text-blue-400',
  },
  npm: {
    svg: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323h13.837v13.229h-3.502v-9.727h-3.502v9.727H5.13z" />
      </svg>
    ),
    color: 'text-red-500',
  },
  dmg: {
    svg: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    color: 'text-violet-400',
  },
  zip: {
    svg: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    color: 'text-green-400',
  },
  github: {
    svg: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
    color: 'text-gray-400',
  },
};

export default function DownloadSection({ product }: { product: Product }) {
  if (!product.downloads?.length) return null;

  return (
    <section className="mb-20">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Download</p>
      <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">获取 {product.name}</h2>
      <p className="mb-8 text-gray-400">国内用户推荐使用 Gitee 镜像或包管理器安装，速度更快更稳定。</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {product.downloads.map((dl, i) => {
          const iconInfo = iconMap[dl.icon] || iconMap.github;
          const isRecommended = i === 0;

          return (
            <a
              key={dl.url}
              href={dl.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex items-start gap-4 rounded-2xl border p-5 transition-all duration-200 hover:scale-[1.02] ${
                isRecommended
                  ? 'border-violet-500/30 bg-violet-500/[0.06] hover:border-violet-500/50 hover:bg-violet-500/[0.1]'
                  : 'border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]'
              }`}
            >
              {isRecommended && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                  推荐
                </span>
              )}
              <span className={`mt-0.5 shrink-0 ${iconInfo.color} transition-transform group-hover:scale-110`}>
                {iconInfo.svg}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-white">{dl.label}</p>
                {dl.note && <p className="mt-1 text-xs text-gray-500">{dl.note}</p>}
              </div>
              <svg className="ml-auto mt-1 h-4 w-4 shrink-0 text-gray-600 transition-all group-hover:translate-x-0.5 group-hover:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          );
        })}
      </div>
    </section>
  );
}
