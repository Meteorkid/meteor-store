'use client';

import { useState, useId } from 'react';
import {
  STAGE_VALUES,
  DEVICE_VALUES,
  NETWORK_VALUES,
  CONSTRAINT_VALUES,
  type PathfinderInput,
} from '@/lib/pathfinder/schema';

export type PathfinderFormValue = PathfinderInput;

interface Props {
  initialGoal?: string;
  onSubmit: (value: PathfinderFormValue) => Promise<void> | void;
  loading?: boolean;
  disabled?: boolean;
}

export default function PathfinderForm({
  initialGoal = '',
  onSubmit,
  loading = false,
  disabled = false,
}: Props) {
  const [goal, setGoal] = useState(initialGoal);
  const [stage, setStage] = useState<(typeof STAGE_VALUES)[number]>('高中');
  const [device, setDevice] = useState<(typeof DEVICE_VALUES)[number]>('仅手机');
  const [weeklyHours, setWeeklyHours] = useState(7);
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [budget, setBudget] = useState(0);
  const [hasMentor, setHasMentor] = useState(false);
  const [network, setNetwork] = useState<(typeof NETWORK_VALUES)[number]>('普通网络');
  const [constraints, setConstraints] = useState<(typeof CONSTRAINT_VALUES)[number][]>([
    '时间碎片化',
  ]);
  const [error, setError] = useState<string | null>(null);
  const idPrefix = useId();

  const toggleConstraint = (c: (typeof CONSTRAINT_VALUES)[number]) => {
    setConstraints((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!goal.trim()) {
      setError('请描述你的目标');
      return;
    }
    if (goal.length > 280) {
      setError('目标描述不超过 280 字');
      return;
    }
    if (constraints.length === 0) {
      setError('至少选择一个现实限制');
      return;
    }
    try {
      await onSubmit({
        goal: goal.trim(),
        stage,
        device,
        weeklyHours,
        dailyMinutes,
        budget,
        hasMentor,
        network,
        constraints,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : '提交失败');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card rounded-3xl p-6 sm:p-8 space-y-5"
      aria-label="学习路径生成表单"
      aria-busy={loading}
    >
      <div>
        <label
          htmlFor={`${idPrefix}-goal`}
          className="block text-sm font-medium mb-2 text-foreground"
        >
          你的学习或成长目标
          <span className="text-destructive ml-1" aria-hidden="true">*</span>
        </label>
        <textarea
          id={`${idPrefix}-goal`}
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="例如：用手机完成 Python 入门，并在 4 周内做出一个小作品"
          maxLength={280}
          rows={3}
          required
          aria-required="true"
          aria-describedby={`${idPrefix}-goal-count`}
          className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-purple-5 focus:ring-2 focus:ring-purple-5/30 outline-none transition resize-none text-foreground placeholder:text-muted-foreground"
        />
        <div
          id={`${idPrefix}-goal-count`}
          className="text-xs text-muted-foreground mt-1 text-right"
          aria-live="polite"
        >
          {goal.length}/280
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="当前阶段" id={`${idPrefix}-stage`}>
          <Select value={stage} onChange={(v) => setStage(v as typeof stage)} id={`${idPrefix}-stage`} options={STAGE_VALUES as readonly string[]} />
        </Field>
        <Field label="可用设备" id={`${idPrefix}-device`}>
          <Select value={device} onChange={(v) => setDevice(v as typeof device)} id={`${idPrefix}-device`} options={DEVICE_VALUES as readonly string[]} />
        </Field>
      </div>

      <Field label={`每周可投入时间：${weeklyHours} 小时`} id={`${idPrefix}-hours`}>
        <input
          id={`${idPrefix}-hours`}
          type="range"
          min={1}
          max={20}
          step={1}
          value={weeklyHours}
          onChange={(e) => setWeeklyHours(Number(e.target.value))}
          className="w-full accent-purple-5"
          aria-valuemin={1}
          aria-valuemax={20}
          aria-valuenow={weeklyHours}
        />
      </Field>

      <Field label={`每天可投入时间：${dailyMinutes} 分钟`} id={`${idPrefix}-daily-minutes`}>
        <input
          id={`${idPrefix}-daily-minutes`}
          type="range"
          min={10}
          max={120}
          step={5}
          value={dailyMinutes}
          onChange={(e) => setDailyMinutes(Number(e.target.value))}
          className="w-full accent-purple-5"
          aria-valuemin={10}
          aria-valuemax={120}
          aria-valuenow={dailyMinutes}
        />
      </Field>

      <fieldset>
        <legend className="block text-sm font-medium mb-3 text-foreground">每月学习预算</legend>
        <div className="grid grid-cols-4 gap-2">
          {[0, 50, 100, 200].map((amount) => {
            const checked = budget === amount;
            return (
              <label
                key={amount}
                className={`cursor-pointer text-sm px-2 py-2 rounded-xl border text-center transition select-none ${
                  checked
                    ? 'bg-purple-6/30 border-purple-5 text-foreground'
                    : 'bg-black/10 border-white/10 text-muted-foreground hover:border-white/30'
                }`}
              >
                <input
                  type="radio"
                  name={`${idPrefix}-budget`}
                  value={amount}
                  checked={checked}
                  onChange={() => setBudget(amount)}
                  className="sr-only"
                />
                {amount === 0 ? '零预算' : `${amount} 元`}
              </label>
            );
          })}
        </div>
      </fieldset>

      <Field label="网络条件" id={`${idPrefix}-network`}>
        <Select value={network} onChange={(v) => setNetwork(v as typeof network)} id={`${idPrefix}-network`} options={NETWORK_VALUES as readonly string[]} />
      </Field>

      <fieldset>
        <legend className="block text-sm font-medium mb-3 text-foreground">是否有可求助的人</legend>
        <div className="grid grid-cols-2 gap-2">
          {[false, true].map((value) => {
            const checked = hasMentor === value;
            return (
              <label
                key={String(value)}
                className={`cursor-pointer text-sm px-3 py-2 rounded-xl border text-center transition select-none ${
                  checked
                    ? 'bg-purple-6/30 border-purple-5 text-foreground'
                    : 'bg-black/10 border-white/10 text-muted-foreground hover:border-white/30'
                }`}
              >
                <input
                  type="radio"
                  name={`${idPrefix}-mentor`}
                  checked={checked}
                  onChange={() => setHasMentor(value)}
                  className="sr-only"
                />
                {value ? '有，可以偶尔请教' : '暂时没有'}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="block text-sm font-medium mb-3 text-foreground">
          现实限制（可多选）
          <span className="text-destructive ml-1" aria-hidden="true">*</span>
        </legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CONSTRAINT_VALUES.map((c) => {
            const checked = constraints.includes(c);
            return (
              <label
                key={c}
                className={`cursor-pointer text-sm px-3 py-2 rounded-xl border text-center transition select-none ${
                  checked
                    ? 'bg-purple-6/30 border-purple-5 text-foreground'
                    : 'bg-black/10 border-white/10 text-muted-foreground hover:border-white/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleConstraint(c)}
                  className="sr-only"
                  aria-label={c}
                />
                {c}
              </label>
            );
          })}
        </div>
      </fieldset>

      {error && (
        <p
          role="alert"
          className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || disabled}
        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-6 to-violet-6 text-white font-semibold text-base shadow-lg shadow-purple-6/30 hover:shadow-purple-6/50 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-5 focus:ring-offset-2 focus:ring-offset-background"
      >
        {loading ? '正在生成路径...' : '按我的现实条件生成'}
      </button>
    </form>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2 text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  id,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  id: string;
  options: readonly string[];
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-purple-5 focus:ring-2 focus:ring-purple-5/30 outline-none transition text-foreground"
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-gray-9 text-foreground">
          {o}
        </option>
      ))}
    </select>
  );
}
