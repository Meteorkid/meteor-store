'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Link } from '@/i18n/navigation';
import { dailyEditionChannels } from '@/lib/daily/channels';
import { useDailyPanel } from '@/lib/daily/panel-client';
import type { DailyPanelSettings as PanelSettings, DailyPreviewEdition, DailyPreviewItem, DailyPreviewResponse, DailyPreviewWord } from '@/lib/daily/panel-types';
import DailyPanelSettings from './DailyPanelSettings';
import { dailyPanelText, type DailyPanelCopy } from './panel-text';
import styles from './DailyNotificationPanel.module.css';

type Locale = 'zh' | 'en';
type Props = { locale: Locale; userId: string | null };
type EditorSession = { id: symbol; owner: string | null; revision: string | null; settings: PanelSettings };

export function dailyPanelHref(date: string, channel?: string) {
  return `/daily?date=${date}&view=all${channel ? `#${channel}` : ''}`;
}

function formatTime(value: string, locale: Locale, timeZone = 'Asia/Shanghai', includeTime = true) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const options: Intl.DateTimeFormatOptions = {
    timeZone, year: 'numeric', month: 'short', day: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } as const : {}),
  };
  try {
    return `${new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'zh-CN', options).format(date)}${includeTime ? ` (${timeZone})` : ''}`;
  } catch {
    // 来源时区无效时以明确的 UTC 展示，避免把浏览器时区当成活动地点。
    return `${date.toISOString().slice(0, 16).replace('T', ' ')} (UTC)`;
  }
}

function Word({ word, settings, copy }: { word: DailyPreviewWord; settings: PanelSettings; copy: DailyPanelCopy }) {
  const showExample = settings.english.example && word.example;
  const showTranslation = settings.english.translation && word.translation;
  const foldedExample = !settings.english.example && word.example;
  const foldedTranslation = !settings.english.translation && word.translation;
  return <li className={styles.item}>
    <div className={styles.word}>
      <strong className="t-title-4" lang="en">{word.term}</strong>
      {settings.english.meaning && <span className={`${styles.meaning} t-footnote`}>{word.meaning}</span>}
    </div>
    {showExample && <p className={`${styles.example} t-footnote`} lang="en">{word.example}</p>}
    {showTranslation && <p className={`${styles.translation} t-footnote`}>{word.translation}</p>}
    {(foldedExample || foldedTranslation) && <details>
      <summary className={`${styles.disclosure} t-footnote`}>{foldedExample && foldedTranslation ? copy.examples : foldedExample ? copy.exampleOnly : copy.translationOnly}</summary>
      {foldedExample && <p className={`${styles.example} t-footnote`} lang="en">{word.example}</p>}
      {foldedTranslation && <p className={`${styles.translation} t-footnote`}>{word.translation}</p>}
    </details>}
  </li>;
}

function PreviewItem({ item, edition, date, settings, locale, copy }: {
  item: DailyPreviewItem; edition: DailyPreviewEdition; date: string; settings: PanelSettings; locale: Locale; copy: DailyPanelCopy;
}) {
  const role = item.roleType === 'internship' ? copy.internship : item.roleType === 'graduate' ? copy.graduate : null;
  const remote = item.remoteStatus && item.remoteStatus !== 'unknown' ? copy[item.remoteStatus] : null;
  return <li className={styles.item}>
    <Link className={`${styles.title} t-title-4`} href={dailyPanelHref(date, edition.channel)}>{item.title}</Link>
    {item.organization && <p className={`${styles.meta} t-footnote`}>{item.organization}{role ? ` · ${role}` : ''}</p>}
    {item.preprint && <p className={`${styles.meta} t-footnote`}>{copy.preprint}</p>}
    {settings.showSummary && item.summary && <p className={`${styles.summary} t-footnote`}>{item.summary}</p>}
    {settings.showDates && <>
      {(item.location || remote) && <p className={`${styles.meta} t-footnote`}>{[item.location, remote].filter(Boolean).join(' · ')}</p>}
      {item.startAt && <p className={`${styles.meta} t-footnote`}>
        {edition.channel === 'competitions' ? copy.competitionStartAt : copy.startAt}: {formatTime(item.startAt, locale, item.timeZone || 'UTC')}
      </p>}
      {edition.channel === 'events' && !item.startAt && <p className={`${styles.meta} t-footnote`}>{copy.timeUnknown}</p>}
      {item.sourcePublishedAt && <p className={`${styles.meta} t-footnote`}>{copy.sourceDate}: {formatTime(item.sourcePublishedAt, locale, 'Asia/Shanghai', false)}</p>}
      {item.verifiedAt && (edition.channel === 'internships' || edition.channel === 'open-source') && <p className={`${styles.meta} t-footnote`}>{copy.verifiedAt}: {formatTime(item.verifiedAt, locale)}</p>}
    </>}
    {settings.showSource && <p className={`${styles.meta} t-footnote`}>
      {copy.sourceLabel}: {item.url ? <a className={styles.link} href={item.url} target="_blank" rel="noopener noreferrer">{item.sourceName} ↗</a> : item.sourceName}
      {' · '}{item.sourceType === 'official' ? copy.official : copy.aggregator}
    </p>}
  </li>;
}

export function DailyPanelContent({ preview, settings, locale }: { preview: DailyPreviewResponse; settings: PanelSettings; locale: Locale }) {
  const copy = dailyPanelText[locale];
  const selected = settings.channels.map(channel => preview.editions.find(edition => edition.channel === channel)).filter((edition): edition is DailyPreviewEdition => Boolean(edition));
  const visible = settings.hideEmpty ? selected.filter(edition => edition.status === 'published' && edition.content) : selected;
  if (settings.channels.length === 0) return <p className={`${styles.notice} t-footnote`}>{copy.noChannels}</p>;
  if (visible.length === 0) return <p className={`${styles.notice} t-footnote`}>{copy.allHidden}</p>;
  return <div className={`${styles.channels} ${settings.density === 'compact' ? styles.compact : ''}`}>
    {visible.map(edition => {
      const label = dailyEditionChannels.find(channel => channel.id === edition.channel)![locale];
      const count = settings.itemCounts[edition.channel];
      return <section key={edition.channel} className={styles.channel} aria-label={label}>
        <div className={styles.channelHeader}>
          <h3 className="t-title-4"><Link className={styles.channelName} href={dailyPanelHref(preview.date, edition.channel)}>{label}</Link></h3>
          {edition.status === 'published' && <Link className={`${styles.link} t-footnote`} href={dailyPanelHref(preview.date, edition.channel)}>{copy.more} →</Link>}
        </div>
        {edition.status !== 'published' && <p className={`${edition.status === 'failed' ? styles.error : styles.notice} t-footnote`}>
          {edition.status === 'failed' ? copy.channelFailed : edition.status === 'unpublished' ? copy.unpublished : copy.empty}
        </p>}
        {edition.content && edition.status === 'published' && <ul className={styles.items}>
          {edition.content.kind === 'english'
            ? edition.content.vocabulary.slice(0, count).map((word, index) => <Word key={`${word.term}-${index}`} word={word} settings={settings} copy={copy} />)
            : edition.content.items.slice(0, count).map(item => <PreviewItem key={item.id} item={item} edition={edition} date={preview.date} settings={settings} locale={locale} copy={copy} />)}
        </ul>}
        {edition.status !== 'published' && edition.previousDate && <Link className={`${styles.footer} ${styles.link} t-footnote`} href={dailyPanelHref(edition.previousDate, edition.channel)}>
          {copy.previous} {edition.previousDate} {copy.previousSuffix} →
        </Link>}
      </section>;
    })}
  </div>;
}

export default function DailyNotificationPanel({ locale, userId }: Props) {
  const copy = dailyPanelText[locale];
  const { loading } = useAuth();
  const panel = useDailyPanel(userId, loading);
  const customizeRef = useRef<HTMLButtonElement>(null);
  const activeEditorRef = useRef<EditorSession | null>(null);
  const [editor, setEditor] = useState<EditorSession | null>(null);
  const [previousOwner, setPreviousOwner] = useState(userId);
  if (previousOwner !== userId) {
    setPreviousOwner(userId);
    setEditor(null);
  }
  useEffect(() => () => { activeEditorRef.current = null; }, [userId]);
  const editing = editor?.owner === userId ? editor : null;
  const closeEditor = (session = editing) => {
    if (!session || activeEditorRef.current?.id !== session.id) return;
    activeEditorRef.current = null;
    setEditor(null);
    customizeRef.current?.focus();
  };
  const reloadSettings = async () => {
    const sessionChanged = panel.preferencesChanged || panel.saveError === 'changed' || panel.saveError === 'login';
    panel.clearSaveError();
    if (sessionChanged) { window.location.reload(); return; }
    closeEditor();
    await panel.reload();
  };
  return <section className={styles.panel} aria-label={copy.title}>
    <div className={styles.toolbar}>
      <h2 className="t-title-4">{copy.title}</h2>
      <div className={styles.actions}>
        {!editing && <button type="button" className={styles.button} aria-disabled={panel.contentLoading} onClick={() => { if (!panel.contentLoading) void panel.refresh(); }}>{copy.refresh}</button>}
        <button ref={customizeRef} type="button" className={styles.button} aria-disabled={!panel.preferencesReady || panel.preferencesLoading || panel.saving} aria-expanded={Boolean(editing)} onClick={() => {
          if (!panel.preferencesReady || panel.preferencesLoading || panel.saving) return;
          if (editing) closeEditor();
          else {
            panel.clearSaveError();
            const session = { id: Symbol('daily-panel-editor'), owner: userId, revision: panel.revision, settings: panel.effectiveSettings };
            activeEditorRef.current = session;
            setEditor(session);
          }
        }}>{copy.customize}</button>
      </div>
    </div>
    {editing ? <DailyPanelSettings locale={locale} userId={userId} settings={editing.settings} defaultSettings={panel.defaultSettings}
      saving={panel.saving} error={panel.saveError || (panel.preferencesChanged ? 'changed' : null)} onCancel={() => closeEditor()} onReload={() => void reloadSettings()}
      onSave={async settings => {
        const saved = await panel.save(settings, editing.revision);
        if (saved) closeEditor(editing);
        return saved;
      }} /> : <>
      {panel.preview && <p className={`${styles.date} t-footnote`}>
        <time dateTime={panel.preview.date}>{panel.preview.date}</time>
        {panel.preview.updatedAt && <span> · {copy.updated} {formatTime(panel.preview.updatedAt, locale)}</span>}
      </p>}
      {panel.preferencesLoading && <p className={`${styles.notice} t-footnote`} role="status">{copy.loadingSettings}</p>}
      {panel.preferencesFailed && !panel.preferencesChanged && <p className={`${styles.error} t-footnote`} role="alert">{copy.failedSettings} <button type="button" className={styles.button} onClick={() => void reloadSettings()}>{copy.retry}</button></p>}
      {panel.preferencesChanged && <p className={`${styles.error} t-footnote`} role="alert">{copy.sessionChanged} <button type="button" className={styles.button} onClick={() => void reloadSettings()}>{copy.reload}</button></p>}
      {panel.contentLoading && !panel.preview && <p className={`${styles.notice} t-footnote`} role="status">{copy.loading}</p>}
      {panel.contentFailed && <p className={`${styles.error} t-footnote`} role="alert">{copy.failed} <button type="button" className={styles.button} onClick={() => void panel.refresh()}>{copy.retry}</button></p>}
      {panel.preview && <DailyPanelContent preview={panel.preview} settings={panel.effectiveSettings} locale={locale} />}
      <Link className={`${styles.footer} ${styles.link} t-footnote`} href={panel.preview ? dailyPanelHref(panel.preview.date) : '/daily?view=all'}>{copy.readAll} →</Link>
    </>}
  </section>;
}
