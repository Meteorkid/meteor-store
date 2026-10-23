'use client';

import { useId, useState } from 'react';
import { dailyEditionChannels, type DAILY_EDITION_CHANNEL_IDS } from '@/lib/daily/channels';
import type { DailyPanelSettings as PanelSettings } from '@/lib/daily/panel-types';
import { dailyPanelText } from './panel-text';
import styles from './DailyNotificationPanel.module.css';

type ChannelId = typeof DAILY_EDITION_CHANNEL_IDS[number];
type Props = {
  locale: 'zh' | 'en';
  userId: string | null;
  settings: PanelSettings;
  defaultSettings: PanelSettings;
  saving: boolean;
  error: string | null;
  onSave: (settings: PanelSettings | null) => Promise<boolean>;
  onCancel: () => void;
  onReload: () => void;
};

export default function DailyPanelSettings({ locale, userId, settings, defaultSettings, saving, error, onSave, onCancel, onReload }: Props) {
  const copy = dailyPanelText[locale];
  const id = useId();
  const [draft, setDraft] = useState(settings);
  const [reset, setReset] = useState(false);
  const change = (update: (previous: PanelSettings) => PanelSettings) => {
    setReset(false);
    setDraft(update);
  };
  const orderedChannels = [...draft.channels, ...dailyEditionChannels.map(channel => channel.id).filter(channel => !draft.channels.includes(channel))];
  const toggleChannel = (channel: ChannelId) => change(previous => ({
    ...previous, channels: previous.channels.includes(channel)
      ? previous.channels.filter(item => item !== channel) : [...previous.channels, channel],
  }));
  const moveChannel = (channel: ChannelId, direction: -1 | 1) => change(previous => {
    const channels = [...previous.channels];
    const index = channels.indexOf(channel);
    if (index < 0 || index + direction < 0 || index + direction >= channels.length) return previous;
    [channels[index], channels[index + direction]] = [channels[index + direction], channels[index]];
    return { ...previous, channels };
  });
  const errorText = error === 'conflict' ? copy.conflict : error === 'login' ? copy.unauthorized : error === 'changed' ? copy.sessionChanged
    : error === 'storage' ? copy.storage : error ? copy.saveFailed : null;

  return <form className={styles.settings} aria-label={copy.settingsTitle} onSubmit={event => {
    event.preventDefault();
    if (!saving && !['conflict', 'login', 'changed'].includes(error ?? '')) void onSave(reset ? null : draft);
  }}>
    <p className="t-footnote text-white/70">{userId ? copy.account : copy.guest}</p>
    <p className="mt-1 t-footnote text-white/60">{copy.independent}</p>
    <fieldset disabled={saving} className={styles.fieldset}>
      <legend className={`${styles.legend} t-footnote`}>{copy.selectChannels}</legend>
      <p className="t-footnote text-white/60">{copy.selectionHelp}</p>
      <ul className={styles.channelOptions}>
        {orderedChannels.map(channelId => {
          const channel = dailyEditionChannels.find(item => item.id === channelId)!;
          const label = channel[locale];
          const selectedIndex = draft.channels.indexOf(channelId);
          const selected = selectedIndex >= 0;
          return <li key={channelId} className={styles.channelOption}>
            <label className={`${styles.check} t-footnote`}>
              <input type="checkbox" checked={selected} onChange={() => toggleChannel(channelId)} />{label}
            </label>
            <select className={`${styles.select} t-footnote`} aria-label={`${label} · ${copy.count}`}
              value={draft.itemCounts[channelId]} disabled={!selected || channelId === 'open-source'}
              onChange={event => change(previous => ({ ...previous, itemCounts: { ...previous.itemCounts, [channelId]: Number(event.target.value) } }))}>
              {(channelId === 'open-source' ? [1] : [1, 3, 5]).map(count => <option key={count} value={count}>{count}</option>)}
            </select>
            <span className={styles.moves}>
              <button type="button" className={styles.button} aria-label={`${copy.moveUp} ${label}`} disabled={!selected || selectedIndex === 0} onClick={() => moveChannel(channelId, -1)}>↑</button>
              <button type="button" className={styles.button} aria-label={`${copy.moveDown} ${label}`} disabled={!selected || selectedIndex === draft.channels.length - 1} onClick={() => moveChannel(channelId, 1)}>↓</button>
            </span>
          </li>;
        })}
      </ul>
    </fieldset>
    <fieldset disabled={saving} className={styles.fieldset}>
      <legend className={`${styles.legend} t-footnote`}>{copy.density}</legend>
      <div className={styles.actions}>{(['compact', 'detailed'] as const).map(density => <label key={density} className={`${styles.check} t-footnote`}>
        <input type="radio" name={`${id}-density`} checked={draft.density === density} onChange={() => change(previous => ({ ...previous, density }))} />{copy[density]}
      </label>)}</div>
    </fieldset>
    <fieldset disabled={saving} className={styles.fieldset}>
      <legend className={`${styles.legend} t-footnote`}>{copy.english}</legend>
      <div className={styles.checks}>{(['meaning', 'example', 'translation'] as const).map(field => <label key={field} className={`${styles.check} t-footnote`}>
        <input type="checkbox" checked={draft.english[field]} onChange={event => change(previous => ({ ...previous, english: { ...previous.english, [field]: event.target.checked } }))} />{copy[field]}
      </label>)}</div>
    </fieldset>
    <fieldset disabled={saving} className={styles.fieldset}>
      <legend className={`${styles.legend} t-footnote`}>{copy.otherFields}</legend>
      <div className={styles.checks}>{([
        ['showSummary', 'summary'], ['showSource', 'source'], ['showDates', 'dates'], ['hideEmpty', 'hideEmpty'],
      ] as const).map(([field, label]) => <label key={field} className={`${styles.check} t-footnote`}>
        <input type="checkbox" checked={draft[field]} onChange={event => change(previous => ({ ...previous, [field]: event.target.checked }))} />{copy[label]}
      </label>)}</div>
    </fieldset>
    {reset && <p className={`${styles.notice} t-footnote`} role="status">{copy.resetHint}</p>}
    {errorText && <p className={`${styles.error} t-footnote`} role="alert">{errorText}</p>}
    {['conflict', 'login', 'changed', 'failed'].includes(error ?? '') && <button type="button" className={styles.button} onClick={onReload}>{copy.reload}</button>}
    <div className={styles.settingsFooter}>
      <button type="button" disabled={saving} className={styles.button} onClick={() => { setDraft(defaultSettings); setReset(true); }}>{copy.reset}</button>
      <div className={styles.actions}>
        <button type="button" disabled={saving} className={styles.button} onClick={onCancel}>{copy.cancel}</button>
        <button type="submit" aria-disabled={saving || ['conflict', 'login', 'changed'].includes(error ?? '')} className={`${styles.button} ${styles.primary}`}>{saving ? copy.saving : copy.save}</button>
      </div>
    </div>
  </form>;
}
