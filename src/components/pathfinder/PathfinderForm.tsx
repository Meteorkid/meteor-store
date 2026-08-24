'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';

export const GOAL_TYPES = ['explore', 'foundation', 'project', 'competition', 'internship', 'research'] as const;
export const DIRECTIONS = ['ai', 'frontend', 'backend', 'data'] as const;
export const STAGES = ['freshman', 'sophomore', 'junior', 'senior', 'postgraduate'] as const;
export const FOUNDATIONS = ['none', 'beginner', 'intermediate', 'advanced'] as const;
export const DEVICES = ['phone-only', 'phone-and-pc', 'pc'] as const;
export const NETWORKS = ['limited-data', 'normal', 'stable'] as const;
export const CONSTRAINTS = ['fragmented-time', 'weak-foundation', 'no-mentor', 'limited-budget'] as const;

export interface PathfinderProfile {
  goal: string;
  goalType: (typeof GOAL_TYPES)[number];
  direction: (typeof DIRECTIONS)[number];
  stage: (typeof STAGES)[number];
  foundation: (typeof FOUNDATIONS)[number];
  weeklyHours: number;
  durationWeeks: number;
  device: (typeof DEVICES)[number];
  budgetCny: number;
  acceptForeignCurrencyCosts: boolean;
  network: (typeof NETWORKS)[number];
  constraints: (typeof CONSTRAINTS)[number][];
}

export interface PathfinderFormValue {
  profile: PathfinderProfile;
  preferredItemId?: string;
}

interface Props {
  preferredItemId?: string;
  preferredItemTitle?: string;
  initialDirection?: PathfinderProfile['direction'];
  initialGoalType?: PathfinderProfile['goalType'];
  loading?: boolean;
  onSubmit: (value: PathfinderFormValue) => Promise<void> | void;
}

export default function PathfinderForm({
  preferredItemId,
  preferredItemTitle,
  initialDirection = 'ai',
  initialGoalType = 'project',
  loading = false,
  onSubmit,
}: Props) {
  const t = useTranslations('PathfinderHub.planForm');
  const id = useId();
  const [goal, setGoal] = useState('');
  const [goalType, setGoalType] = useState<PathfinderProfile['goalType']>(initialGoalType);
  const [direction, setDirection] = useState<PathfinderProfile['direction']>(initialDirection);
  const [stage, setStage] = useState<PathfinderProfile['stage']>('freshman');
  const [foundation, setFoundation] = useState<PathfinderProfile['foundation']>('beginner');
  const [weeklyHours, setWeeklyHours] = useState(6);
  const [durationWeeks, setDurationWeeks] = useState(6);
  const [device, setDevice] = useState<PathfinderProfile['device']>('phone-and-pc');
  const [budgetCny, setBudgetCny] = useState(0);
  const [acceptForeignCurrencyCosts, setAcceptForeignCurrencyCosts] = useState(false);
  const [network, setNetwork] = useState<PathfinderProfile['network']>('normal');
  const [constraints, setConstraints] = useState<PathfinderProfile['constraints']>(['fragmented-time']);
  const [error, setError] = useState<string | null>(null);

  const toggleConstraint = (constraint: PathfinderProfile['constraints'][number]) => {
    setConstraints((current) =>
      current.includes(constraint)
        ? current.filter((item) => item !== constraint)
        : [...current, constraint],
    );
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const normalizedGoal = goal.trim();
    if (!normalizedGoal) {
      setError(t('goalRequired'));
      return;
    }
    if (normalizedGoal.length > 280) {
      setError(t('goalTooLong'));
      return;
    }

    await onSubmit({
      profile: {
        goal: normalizedGoal,
        goalType,
        direction,
        stage,
        foundation,
        weeklyHours,
        durationWeeks,
        device,
        budgetCny,
        acceptForeignCurrencyCosts,
        network,
        constraints,
      },
      preferredItemId,
    });
  };

  return (
    <form
      onSubmit={submit}
      aria-label={t('ariaLabel')}
      aria-busy={loading}
      className="glass-card space-y-6 rounded-3xl p-5 sm:p-8"
    >
      {preferredItemId && (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-violet-400/20 bg-violet-500/10 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">{t('preferredTitle')}</p>
            <p className="mt-1 t-footnote text-white/60">{t('preferredDescription')}</p>
          </div>
          <span className="max-w-[45%] truncate rounded-full border border-violet-300/20 px-2 py-1 text-[11px] text-violet-200">
            {preferredItemTitle ?? preferredItemId}
          </span>
        </div>
      )}

      <div>
        <label htmlFor={`${id}-goal`} className="mb-2 block text-sm font-semibold text-white">
          {t('goalLabel')}
        </label>
        <textarea
          id={`${id}-goal`}
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          rows={4}
          maxLength={280}
          required
          placeholder={t('goalPlaceholder')}
          className="w-full resize-none rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition-colors placeholder:text-white/60 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
        />
        <p className="mt-1 text-right t-footnote text-white/60">{goal.length}/280</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField id={`${id}-goal-type`} label={t('goalTypeLabel')} value={goalType} onChange={(value) => setGoalType(value as PathfinderProfile['goalType'])} options={GOAL_TYPES.map((value) => ({ value, label: t(`goalTypes.${value}`) }))} />
        <SelectField id={`${id}-direction`} label={t('directionLabel')} value={direction} onChange={(value) => setDirection(value as PathfinderProfile['direction'])} options={DIRECTIONS.map((value) => ({ value, label: t(`directions.${value}`) }))} />
        <SelectField id={`${id}-stage`} label={t('stageLabel')} value={stage} onChange={(value) => setStage(value as PathfinderProfile['stage'])} options={STAGES.map((value) => ({ value, label: t(`stages.${value}`) }))} />
        <SelectField id={`${id}-foundation`} label={t('foundationLabel')} value={foundation} onChange={(value) => setFoundation(value as PathfinderProfile['foundation'])} options={FOUNDATIONS.map((value) => ({ value, label: t(`foundations.${value}`) }))} />
        <SelectField id={`${id}-device`} label={t('deviceLabel')} value={device} onChange={(value) => setDevice(value as PathfinderProfile['device'])} options={DEVICES.map((value) => ({ value, label: t(`devices.${value}`) }))} />
        <SelectField id={`${id}-network`} label={t('networkLabel')} value={network} onChange={(value) => setNetwork(value as PathfinderProfile['network'])} options={NETWORKS.map((value) => ({ value, label: t(`networks.${value}`) }))} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <NumberField id={`${id}-weekly`} label={t('weeklyHoursLabel')} value={weeklyHours} min={1} max={30} suffix={t('hoursUnit')} onChange={setWeeklyHours} />
        <NumberField id={`${id}-duration`} label={t('durationWeeksLabel')} value={durationWeeks} min={4} max={8} suffix={t('weeksUnit')} onChange={setDurationWeeks} />
        <NumberField id={`${id}-budget`} label={t('budgetLabel')} value={budgetCny} min={0} max={10000} step={10} suffix={t('currencyUnit')} onChange={setBudgetCny} />
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white/70">
        <input
          type="checkbox"
          checked={acceptForeignCurrencyCosts}
          onChange={(event) => setAcceptForeignCurrencyCosts(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-violet-500"
        />
        <span>
          <span className="block font-semibold text-white">{t('foreignFeeLabel')}</span>
          <span className="mt-1 block t-footnote text-white/60">{t('foreignFeeDescription')}</span>
        </span>
      </label>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-white">{t('constraintsLabel')}</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {CONSTRAINTS.map((constraint) => {
            const checked = constraints.includes(constraint);
            return (
              <label
                key={constraint}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                  checked
                    ? 'border-violet-400/40 bg-violet-500/15 text-white'
                    : 'border-white/10 bg-black/20 text-white/60 hover:border-white/20 hover:text-white/80'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleConstraint(constraint)}
                  className="h-4 w-4 accent-violet-500"
                />
                {t(`constraints.${constraint}`)}
              </label>
            );
          })}
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? t('submitting') : t('submit')}
      </button>
      <p className="text-center t-footnote text-white/60">{t('privacy')}</p>
    </form>
  );
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-semibold text-white">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/45 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function NumberField({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-semibold text-white">{label}</span>
      <span className="flex items-center rounded-xl border border-white/10 bg-black/45 focus-within:border-violet-400/60 focus-within:ring-2 focus-within:ring-violet-500/20">
        <input
          id={id}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => onChange(Number(event.target.value))}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none"
        />
        <span className="pr-3 t-footnote text-white/60">{suffix}</span>
      </span>
    </label>
  );
}
