'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  PATHFINDER_DIFFICULTIES,
  PATHFINDER_DIRECTIONS,
  PATHFINDER_ITEM_TYPES,
  PATHFINDER_REMOTE_STATUSES,
} from '@/lib/pathfinder/catalog-types';

const FILTER_KEYS = ['q', 'type', 'direction', 'difficulty', 'remote', 'deadline', 'task'] as const;

export default function PathfinderFilters({ hasDeadlines }: { hasDeadlines: boolean }) {
  const t = useTranslations('PathfinderHub.filters');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.requestAnimationFrame(() => closeRef.current?.focus());
    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !sheetRef.current) return;
      const focusable = [...sheetRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      )];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleDialogKeys);
    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleDialogKeys);
      trigger?.focus();
    };
  }, [open]);

  const replaceParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  const clear = () => {
    const params = new URLSearchParams(searchParams.toString());
    FILTER_KEYS.forEach((key) => params.delete(key));
    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  const activeCount = FILTER_KEYS.reduce(
    (count, key) => count + (searchParams.get(key) ? 1 : 0),
    0,
  );

  const renderControls = (idPrefix: string) => (
    <div className="space-y-5">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const query = formData.get('q');
          replaceParam('q', typeof query === 'string' ? query.trim().slice(0, 100) : '');
        }}
      >
        <label htmlFor={`${idPrefix}-search`} className="mb-2 block text-sm font-semibold text-white">
          {t('searchLabel')}
        </label>
        <div className="flex gap-2">
          <input
            id={`${idPrefix}-search`}
            key={`${idPrefix}-${searchParams.get('q') ?? ''}`}
            name="q"
            type="search"
            defaultValue={searchParams.get('q') ?? ''}
            maxLength={100}
            placeholder={t('searchPlaceholder')}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/60 focus:border-violet-400/60"
          />
          <button type="submit" className="rounded-xl bg-white/10 px-3 text-sm font-semibold text-white hover:bg-white/15">
            {t('search')}
          </button>
        </div>
      </form>

      <FilterSelect label={t('typeLabel')} value={searchParams.get('type') ?? ''} onChange={(value) => replaceParam('type', value)}>
        <option value="">{t('all')}</option>
        {PATHFINDER_ITEM_TYPES.map((value) => <option key={value} value={value}>{t(`types.${value}`)}</option>)}
      </FilterSelect>
      <FilterSelect label={t('directionLabel')} value={searchParams.get('direction') ?? ''} onChange={(value) => replaceParam('direction', value)}>
        <option value="">{t('all')}</option>
        {PATHFINDER_DIRECTIONS.map((value) => <option key={value} value={value}>{t(`directions.${value}`)}</option>)}
      </FilterSelect>
      <FilterSelect label={t('difficultyLabel')} value={searchParams.get('difficulty') ?? ''} onChange={(value) => replaceParam('difficulty', value)}>
        <option value="">{t('all')}</option>
        {PATHFINDER_DIFFICULTIES.map((value) => <option key={value} value={value}>{t(`difficulties.${value}`)}</option>)}
      </FilterSelect>
      <FilterSelect label={t('remoteLabel')} value={searchParams.get('remote') ?? ''} onChange={(value) => replaceParam('remote', value)}>
        <option value="">{t('all')}</option>
        {PATHFINDER_REMOTE_STATUSES.map((value) => <option key={value} value={value}>{t(`remote.${value}`)}</option>)}
      </FilterSelect>
      {hasDeadlines && (
        <FilterSelect label={t('deadlineLabel')} value={searchParams.get('deadline') ?? ''} onChange={(value) => replaceParam('deadline', value)}>
          <option value="">{t('all')}</option>
          <option value="30d">{t('deadline30')}</option>
          <option value="90d">{t('deadline90')}</option>
        </FilterSelect>
      )}

      {/*
        目录里的开源条目有两种粒度：整仓库和具体 issue。想「今天就动手」的人
        需要一个直接筛掉仓库入口的开关，否则要在列表里逐条辨认。
      */}
      <label className="flex items-start gap-3">
        <input
          id={`${idPrefix}-task`}
          type="checkbox"
          checked={searchParams.get('task') === '1'}
          onChange={(event) => replaceParam('task', event.target.checked ? '1' : '')}
          className="mt-0.5 h-4 w-4 shrink-0 accent-violet-500"
        />
        <span>
          <span className="block text-sm font-semibold text-white">{t('taskLabel')}</span>
          <span className="mt-1 block t-footnote text-white/60">{t('taskHint')}</span>
        </span>
      </label>

      <button type="button" onClick={clear} className="w-full rounded-xl border border-white/10 px-3 py-2 text-sm text-white/60 hover:border-white/20 hover:text-white/80">
        {t('clear')}
      </button>
    </div>
  );

  return (
    <>
      <div className="mb-5 flex items-center justify-between lg:hidden">
        <p className="text-sm text-white/60">{activeCount ? t('activeCount', { count: activeCount }) : t('allVisible')}</p>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white"
        >
          {t('open')}{activeCount ? ` · ${activeCount}` : ''}
        </button>
      </div>

      <aside className="hidden lg:block">
        <div className="glass sticky top-36 rounded-2xl p-5">
          <div className="mb-5">
            <p className="t-eyebrow text-violet-300">{t('eyebrow')}</p>
            <h2 className="mt-2 t-title-4 text-white">{t('title')}</h2>
          </div>
          {renderControls('pathfinder-desktop')}
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label={t('title')}>
          <button type="button" aria-label={t('close')} onClick={() => setOpen(false)} className="absolute inset-0 bg-black/75" />
          <div ref={sheetRef} className="glass-lg absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl p-5 pb-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="t-title-3 text-white">{t('title')}</h2>
              <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xl text-white" aria-label={t('close')}>×</button>
            </div>
            {renderControls('pathfinder-mobile')}
            <button type="button" onClick={() => setOpen(false)} className="mt-4 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white">
              {t('showResults')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-white">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/45 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400/60"
      >
        {children}
      </select>
    </label>
  );
}
