'use client';

import { useMemo, useState } from 'react';
import type { PathfinderPlan } from '@/lib/pathfinder/schema';
import type { PathfinderResource } from '@/data/pathfinder-resources';
import { generatePlanB } from '@/lib/pathfinder/plan-b';
import type { RealityConstraints } from '@/lib/pathfinder/contract';

interface Props {
  plan: PathfinderPlan;
  resources: PathfinderResource[];
  source: 'model' | 'fallback' | 'preset';
  realityConstraints: RealityConstraints;
  onRegenerate: () => void;
}

export default function PathfinderPlanView({ plan, resources, source, realityConstraints, onRegenerate }: Props) {
  const [copied, setCopied] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState(Math.min(10, realityConstraints.dailyMinutes));

  // 生成可复制的本周行动摘要文本
  const summaryText = buildShareText(plan);
  const todayTask = plan.weekPlan.find((item) => item.day === 1) ?? plan.weekPlan[0];
  const planB = useMemo(
    () => generatePlanB({ remainingMinutes, constraints: realityConstraints, originalPlan: plan.weekPlan }),
    [plan.weekPlan, realityConstraints, remainingMinutes],
  );

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
      aria-label="生成的学习路径"
      className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in-up"
    >
      {/* 来源标识 */}
      <div className="flex items-center gap-2 text-xs">
        {source === 'preset' ? (
          <>
            <span className="px-2 py-1 rounded-md bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
              典型场景演示
            </span>
            <span className="px-2 py-1 rounded-md bg-white/5 text-muted-foreground border border-white/10">
              静态预置 · 非实时 AI 生成
            </span>
          </>
        ) : source === 'fallback' ? (
          <span className="px-2 py-1 rounded-md bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
            基础路径模式 · 确定性结果
          </span>
        ) : (
          <span className="px-2 py-1 rounded-md bg-green-500/15 text-green-300 border border-green-500/30">
            AI 生成路径
          </span>
        )}
      </div>

      {/* 路径说明 */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-2">路径说明</h3>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {plan.summary}
        </p>
      </div>

      {/* 今天就能开始的 3 个小任务 */}
      <div id="today" className="scroll-mt-24">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="text-base font-semibold text-foreground">今天就能开始</h3>
          {todayTask && (
            <span className="text-xs px-2 py-1 rounded-md bg-green-500/15 text-green-300 border border-green-500/30">
              第一步约 {todayTask.minutes} 分钟 · {todayTask.evidence}
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
        <h3 className="text-base font-semibold text-foreground mb-3">7 天行动计划</h3>
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
                <ContractTag>{item.minutes} 分钟</ContractTag>
                <ContractTag>{item.cost === 0 ? '免费' : `${item.cost} 元`}</ContractTag>
                <ContractTag>{item.device}</ContractTag>
                <ContractTag>{item.network}</ContractTag>
                <ContractTag>{item.evidence}</ContractTag>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div id="plan-b" className="scroll-mt-24 rounded-2xl border border-purple-5/20 bg-purple-6/10 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">计划被打断时</h3>
            <p className="mt-1 text-xs text-muted-foreground">剩余时间变少时，只保留仍符合原来设备、网络和预算条件的任务。</p>
          </div>
          <span className="text-sm font-medium text-purple-200">本周只剩 {remainingMinutes} 分钟</span>
        </div>
        <input
          type="range"
          min={5}
          max={Math.max(5, realityConstraints.dailyMinutes)}
          step={5}
          value={remainingMinutes}
          onChange={(event) => setRemainingMinutes(Number(event.target.value))}
          className="mt-4 w-full accent-purple-5"
          aria-label="调整本周剩余时间"
        />
        <p className="mt-3 text-sm text-foreground/90">{planB.summary}</p>
        {planB.tasks.length > 0 && (
          <ul className="mt-3 space-y-2">
            {planB.tasks.map((item) => (
              <li key={`${item.day}-${item.title}`} className="flex items-center justify-between gap-3 rounded-xl bg-black/15 px-3 py-2 text-sm">
                <span className="text-foreground">D{item.day} · {item.title}</span>
                <ContractTag>{item.minutes} 分钟</ContractTag>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 免费资源建议 */}
      {resources.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-foreground mb-3">免费资源建议</h3>
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
                        低流量
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{r.reason}</p>
                  <span className="text-[11px] text-purple-300/70 mt-2 inline-block">
                    {r.kind} · 打开新窗口 →
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
          <h3 className="text-base font-semibold text-foreground">我的本周行动摘要</h3>
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs px-3 py-1.5 rounded-lg bg-purple-6/20 border border-purple-5/30 text-foreground hover:bg-purple-6/30 transition"
            aria-label="复制行动摘要"
          >
            {copied ? '已复制' : '复制'}
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
        调整条件后重新生成
      </button>
    </section>
  );
}

/** 构造可分享的纯文本摘要 */
function buildShareText(plan: PathfinderPlan): string {
  const lines: string[] = [];
  lines.push('📋 我的学习路径摘要');
  lines.push('');
  lines.push('【路径说明】');
  lines.push(plan.summary);
  lines.push('');
  lines.push('【今天就能开始】');
  plan.todaySteps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
  lines.push('');
  lines.push('【7 天计划】');
  plan.weekPlan.forEach((d) => lines.push(`Day ${d.day}：${d.title}（${d.minutes} 分钟 · ${d.cost === 0 ? '免费' : `${d.cost} 元`} · ${d.device} · ${d.network} · ${d.evidence}）`));
  lines.push('');
  lines.push('【鼓励】');
  lines.push(plan.encouragement);
  lines.push('');
  lines.push('—— 由 Meteor Pathfinder 星途导航生成');
  return lines.join('\n');
}

function ContractTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] text-muted-foreground bg-black/20 px-1.5 py-1 rounded-md whitespace-nowrap">
      {children}
    </span>
  );
}
