'use client';

import { useState, useId } from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('PathfinderForm');
  const tEnum = useTranslations('PathfinderEnums');
  const [goal, setGoal] = useState(initialGoal);
  const [stage, setStage] = useState<(typeof STAGE_VALUES)[number]>('high-school');
  const [device, setDevice] = useState<(typeof DEVICE_VALUES)[number]>('phone-only');
  const [weeklyHours, setWeeklyHours] = useState(7);
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [budget, setBudget] = useState(0);
  const [hasMentor, setHasMentor] = useState(false);
  const [network, setNetwork] = useState<(typeof NETWORK_VALUES)[number]>('normal');
  const [constraints, setConstraints] = useState<(typeof CONSTRAINT_VALUES)[number][]>([
    'fragmented-time',
  ]);
  const [error, setError] = useState<string | null>(null);
  const idPrefix = useId();

  // enum 标识符 → 本地化显示文本
  const stageOptions = STAGE_VALUES.map((v) => ({ value: v, label: tEnum(`stage.${v}`) }));
  const deviceOptions = DEVICE_VALUES.map((v) => ({ value: v, label: tEnum(`device.${v}`) }));
  const networkOptions = NETWORK_VALUES.map((v) => ({ value: v, label: tEnum(`network.${v}`) }));
  const constraintOptions = CONSTRAINT_VALUES.map((v) => ({
    value: v,
    label: tEnum(`constraint.${v}`),
  }));

  const toggleConstraint = (c: (typeof CONSTRAINT_VALUES)[number]) => {
    setConstraints((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!goal.trim()) {
      setError(t('goalRequired'));
      return;
    }
    if (goal.length > 280) {
      setError(t('goalTooLong'));
      return;
    }
    if (constraints.length === 0) {
      setError(t('constraintRequired'));
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
    } catch (err) {
      setError(err instanceof Error ? err.message : t('submitFailed'));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card rounded-3xl p-6 sm:p-8 space-y-5"
      aria-label={t('formAriaLabel')}
      aria-busy={loading}
    >
      <div>
        <label
          htmlFor={`${idPrefix}-goal`}
          className="block text-sm font-medium mb-2 text-foreground"
        >
          {t('goalLabel')}
          <span className="text-destructive ml-1" aria-hidden="true">*</span>
        </label>
        <textarea
          id={`${idPrefix}-goal`}
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder={t('goalPlaceholder')}
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
        <Field label={t('stageLabel')} id={`${idPrefix}-stage`}>
          <Select value={stage} onChange={(v) => setStage(v as typeof stage)} id={`${idPrefix}-stage`} options={stageOptions} />
        </Field>
        <Field label={t('deviceLabel')} id={`${idPrefix}-device`}>
          <Select value={device} onChange={(v) => setDevice(v as typeof device)} id={`${idPrefix}-device`} options={deviceOptions} />
        </Field>
      </div>

      <Field label={t('weeklyHoursLabel', { hours: weeklyHours })} id={`${idPrefix}-hours`}>
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

      <Field label={t('dailyMinutesLabel', { minutes: dailyMinutes })} id={`${idPrefix}-daily-minutes`}>
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
        <legend className="block text-sm font-medium mb-3 text-foreground">{t('budgetLabel')}</legend>
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
                {amount === 0 ? t('zeroBudget') : t('budgetAmount', { amount })}
              </label>
            );
          })}
        </div>
      </fieldset>

      <Field label={t('networkLabel')} id={`${idPrefix}-network`}>
        <Select value={network} onChange={(v) => setNetwork(v as typeof network)} id={`${idPrefix}-network`} options={networkOptions} />
      </Field>

      <fieldset>
        <legend className="block text-sm font-medium mb-3 text-foreground">{t('mentorLabel')}</legend>
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
                {value ? t('mentorYes') : t('mentorNo')}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="block text-sm font-medium mb-3 text-foreground">
          {t('constraintsLabel')}
          <span className="text-destructive ml-1" aria-hidden="true">*</span>
        </legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {constraintOptions.map(({ value: c, label }) => {
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
                  aria-label={label}
                />
                {label}
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
        {loading ? t('loading') : t('submit')}
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
  options: ReadonlyArray<{ value: string; label: string }>;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-purple-5 focus:ring-2 focus:ring-purple-5/30 outline-none transition text-foreground"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-gray-9 text-foreground">
          {o.label}
        </option>
      ))}
    </select>
  );
}
