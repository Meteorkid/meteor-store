'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { PathfinderPlan } from '@/lib/pathfinder/schema';
import type { PathfinderResource } from '@/data/pathfinder-resources';
import type { RealityConstraints } from '@/lib/pathfinder/contract';
import RealitySimulation from './RealitySimulation';

interface Props {
  plan: PathfinderPlan;
  resources: PathfinderResource[];
  source: 'model' | 'fallback' | 'preset';
  realityConstraints: RealityConstraints;
  onRegenerate: () => void;
}

export default function PathfinderPlanView({ plan, resources, source, realityConstraints, onRegenerate }: Props) {
  const t = useTranslations('PathfinderPlan');
  const [copied, setCopied] = useState(false);

  // 生成可复制的本周行动摘要文本
  const summaryText = buildShareText(plan, t);
  const todayTask = plan.weekPlan.find((item) => item.day === 1) ?? plan.weekPlan[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 降级方案：选中 textarea
    }
  };

  return (
    <section
      aria-label={t('sectionAriaLabel')}
      className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in-up"
    >
      {/* 来源标识 */}
      <div className="flex items-center gap-2 text-xs">
        {source === 'preset' ? (
          <>
            <span className="px-2 py-1 rounded-md bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
              {t('presetBadge')}
            </span>
            <span className="px-2 py-1 rounded-md bg-white/5 text-muted-foreground border border-white/10">
              {t('presetTag')}
            </span>
          </>
        ) : source === 'fallback' ? (
          <span className="px-2 py-1 rounded-md bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
            {t('fallbackTag')}
          </span>
        ) : (
          <span className="px-2 py-1 rounded-md bg-green-500/15 text-green-300 border border-green-500/30">
            {t('aiTag')}
          </span>
        )}
      </div>

      {/* 路径说明 */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-2">{t('summaryTitle')}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {plan.summary}
        </p>
      </div>

      {/* 今天就能开始的 3 个小任务 */}
      <div id="today" className="scroll-mt-24">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="text-base font-semibold text-foreground">{t('todayTitle')}</h3>
          {todayTask && (
            <span className="text-xs px-2 py-1 rounded-md bg-green-500/15 text-green-300 border border-green-500/30">
              {t('todayStepHint', { minutes: todayTask.minutes, evidence: todayTask.evidence })}
            </span>
          )}
        </div>
        <ol className="space-y-2">
          {plan.todaySteps.map((step, i) => (
            <li
              key={i}
              className="flex gap-3 items-start text-sm text-foreground bg-black/15 rounded-xl px-4 py-3"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-6/30 border border-purple-5/40 flex items-center justify-center text-xs font-bold text-purple-200">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* 7 天行动计划 */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3">{t('weekPlanTitle')}</h3>
        <ul className="space-y-2">
          {plan.weekPlan.map((item) => (
            <li
              key={item.day}
              className="flex items-center justify-between gap-3 text-sm bg-black/15 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-6/20 border border-violet-5/30 flex items-center justify-center text-xs font-semibold text-violet-200">
                  D{item.day}
                </span>
                <span className="text-foreground truncate">{item.title}</span>
              </div>
              <div className="flex flex-wrap justify-end gap-1.5 flex-shrink-0">
                <ContractTag>{t('minutes', { minutes: item.minutes })}</ContractTag>
                <ContractTag>{item.cost === 0 ? t('free') : t('cost', { cost: item.cost })}</ContractTag>
                <ContractTag>{item.device}</ContractTag>
                <ContractTag>{item.network}</ContractTag>
                <ContractTag>{item.evidence}</ContractTag>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <RealitySimulation
        originalPlan={plan.weekPlan}
        realityConstraints={realityConstraints}
      />

      {/* 免费资源建议 */}
      {resources.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-foreground mb-3">{t('resourcesTitle')}</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resources.map((r) => (
              <li key={r.id}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-black/15 hover:bg-black/25 border border-white/10 hover:border-purple-5/40 rounded-xl p-4 transition group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-foreground group-hover:text-purple-200 transition">
                      {r.name}
                    </span>
                    {r.lowBandwidth && (
                      <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-green-500/15 text-green-300 border border-green-500/30">
                        {t('lowBandwidth')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{r.reason}</p>
                  <span className="text-[11px] text-purple-300/70 mt-2 inline-block">
                    {t('resourceKind', { kind: r.kind })}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 鼓励语 */}
      <div className="bg-purple-6/10 border border-purple-5/20 rounded-xl px-4 py-3 text-center">
        <p className="text-sm text-foreground italic">“{plan.encouragement}”</p>
      </div>

      {/* 可复制的本周行动摘要 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-foreground">{t('mySummaryTitle')}</h3>
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs px-3 py-1.5 rounded-lg bg-purple-6/20 border border-purple-5/30 text-foreground hover:bg-purple-6/30 transition"
            aria-label={t('copyAriaLabel')}
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <pre className="text-xs text-muted-foreground bg-black/20 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
          {summaryText}
        </pre>
      </div>

      <button
        type="button"
        onClick={onRegenerate}
        className="w-full py-2.5 px-4 rounded-xl bg-transparent border border-white/15 text-foreground hover:bg-white/5 transition text-sm"
      >
        {t('regenerate')}
      </button>
    </section>
  );
}

/** 构造可分享的纯文本摘要 */
function buildShareText(plan: PathfinderPlan, t: ReturnType<typeof useTranslations>): string {
  const lines: string[] = [];
  lines.push(t('shareHeader'));
  lines.push('');
  lines.push(t('shareSummaryLabel'));
  lines.push(plan.summary);
  lines.push('');
  lines.push(t('shareTodayLabel'));
  plan.todaySteps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
  lines.push('');
  lines.push(t('shareWeekPlanLabel'));
  plan.weekPlan.forEach((d) => lines.push(`Day ${d.day}：${d.title}（${t('minutes', { minutes: d.minutes })} · ${d.cost === 0 ? t('free') : t('cost', { cost: d.cost })} · ${d.device} · ${d.network} · ${d.evidence}）`));
  lines.push('');
  lines.push(t('shareEncouragementLabel'));
  lines.push(plan.encouragement);
  lines.push('');
  lines.push(t('shareFooter'));
  return lines.join('\n');
}

function ContractTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] text-muted-foreground bg-black/20 px-1.5 py-1 rounded-md whitespace-nowrap">
      {children}
    </span>
  );
}
