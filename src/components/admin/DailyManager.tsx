'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useLocale } from 'next-intl';
import { DailyContentSchema, dailyEditionChannels, dailyDate, type DailyEditionChannelId, type DailyContent, type DailyEdition, type DailyLinkItem, type EnglishContent } from '@/lib/daily/types';

const inputClass = 'w-full rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-violet-400';
const buttonClass = 'rounded-lg border border-white/15 px-3 py-2 text-sm text-white disabled:opacity-50';
const panelClass = 'rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5';

interface Editor {
  id?: string;
  date: string;
  channel: DailyEditionChannelId;
  title: string;
  summary: string;
  content: DailyContent;
  expectedUpdatedAt?: string;
  published: boolean;
}

function newItem(channel: Exclude<DailyEditionChannelId, 'english'>): DailyLinkItem {
  return {
    id: crypto.randomUUID(), title: '', summary: '', url: '', sourceName: '', sourceType: 'official',
    ...(channel === 'papers' ? { authors: [], preprint: true, difficulty: 'intermediate' as const } : {}),
    ...(channel === 'events' ? { phase: 'upcoming' as const } : {}),
  };
}

function emptyContent(channel: DailyEditionChannelId): DailyContent {
  return channel === 'english'
    ? {
        kind: 'english',
        vocabulary: Array.from({ length: 3 }, () => ({ term: '', meaning: '', example: '', translation: '' })),
        passage: '', passageTranslation: '',
        questions: [{ question: '', options: ['', ''], answerIndex: 0, explanation: '' }],
      }
    : { kind: channel, items: [newItem(channel)] };
}

function parseContent(content: DailyContent) {
  return DailyContentSchema.safeParse(content.kind === 'english' ? content : {
    ...content,
    items: content.items.map(item => ({ ...item, authors: item.authors?.map(author => author.trim()).filter(Boolean) })),
  });
}

function Field({ label, value, onChange, multiline = false, required = false, placeholder, maxLength = 6000, type = 'text' }: {
  label: string; value: string; onChange: (value: string) => void;
  multiline?: boolean; required?: boolean; placeholder?: string; maxLength?: number; type?: 'text' | 'url';
}) {
  const props = { className: inputClass, value, required, placeholder, maxLength, onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value) };
  return <label className="block space-y-1.5 text-sm text-white/70"><span>{label}{required ? ' *' : ''}</span>{multiline ? <textarea {...props} rows={3} /> : <input {...props} type={type} />}</label>;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly (readonly [string, string])[] }) {
  return <label className="block space-y-1.5 text-sm text-white/70"><span>{label}</span><select className={inputClass} value={value} onChange={event => onChange(event.target.value)}>{options.map(([id, text]) => <option key={id} value={id}>{text}</option>)}</select></label>;
}

export default function DailyManager({ initialDate, initialEditions }: { initialDate: string; initialEditions: DailyEdition[] }) {
  const en = useLocale() === 'en';
  const t = (zh: string, english: string) => en ? english : zh;
  const [date, setDate] = useState(initialDate);
  const [dateInput, setDateInput] = useState(initialDate);
  const [editions, setEditions] = useState(initialEditions);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [retiringId, setRetiringId] = useState<string | null>(null);

  const errorMessage = (code: string) => ({
    conflict: t('这期内容已被其他操作更新。请重新载入该日期后再编辑，当前输入已保留。', 'This edition changed elsewhere. Reload this date before editing again; your current input is still here.'),
    invalid: t('请核对必填项、HTTPS 链接、练习答案及带时区的日期；活动必须注明官方来源和阶段。', 'Check required fields, HTTPS links, quiz answers and dates with an offset. Events need an official source and phase.'),
    today_only: t('只能生成今天的内容；历史期刊请手工修订。', 'Only today can be generated. Edit historical editions manually.'),
    too_large: t('内容超过 128 KB，请缩短后保存。', 'Content exceeds 128 KB. Shorten it before saving.'),
    rate_limited: t('操作过于频繁，请稍后重试。', 'Too many requests. Try again shortly.'),
    not_found: t('登录状态或管理权限已失效，请重新登录。', 'Your administrator session has expired. Sign in again.'),
    origin: t('请求来源校验失败，请从本站重新打开后台。', 'Request origin check failed. Reopen the admin page on this site.'),
  }[code] ?? t('操作失败，请稍后重试。未保存的内容仍保留在表单中。', 'The request failed. Please retry; unsaved content remains in the form.'));

  async function request(method: 'POST' | 'PATCH', body: unknown): Promise<{ editions?: DailyEdition[]; edition?: DailyEdition }> {
    const response = await fetch('/api/admin/daily', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.errorCode ?? 'failed');
    return data;
  }

  async function loadDate(event?: FormEvent) {
    event?.preventDefault();
    if (editor && !window.confirm(t('重新载入会关闭当前编辑，继续吗？', 'Reloading closes the current editor. Continue?'))) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const response = await fetch(`/api/admin/daily?date=${encodeURIComponent(dateInput)}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.errorCode ?? 'load_failed');
      setDate(dateInput); setEditions(data.editions); setEditor(null); setPreview(false); setRetiringId(null);
    } catch (failure) {
      setError(errorMessage(failure instanceof Error ? failure.message : 'failed'));
    } finally { setBusy(false); }
  }

  async function generate(channel?: DailyEditionChannelId) {
    setBusy(true); setError(''); setNotice('');
    try {
      const data = await request('POST', { action: 'generate', date, channel });
      if (data.editions) {
        const updates = new Map(data.editions.map(item => [item.channel, item]));
        setEditions(current => [...current.filter(item => !updates.has(item.channel)), ...updates.values()]);
        setNotice(data.editions.some(item => item.status === 'failed')
          ? t('部分栏目采集失败，请查看状态后重试。', 'Some channels failed. Check their status before retrying.')
          : t('已更新栏目状态。英语与论文请审核后发布。', 'Channel status updated. Review English and papers before publishing.'));
      }
    } catch (failure) { setError(errorMessage(failure instanceof Error ? failure.message : 'failed')); }
    finally { setBusy(false); }
  }

  function edit(channel: DailyEditionChannelId) {
    if (editor && !window.confirm(t('切换栏目会关闭当前编辑，继续吗？', 'Switching channels closes the current editor. Continue?'))) return;
    const edition = editions.find(item => item.channel === channel);
    setEditor({
      id: edition?.id, date, channel, title: edition?.title ?? '', summary: edition?.summary ?? '',
      content: edition?.content ? structuredClone(edition.content) : emptyContent(channel),
      expectedUpdatedAt: edition?.updatedAt, published: edition?.status === 'published',
    });
    setError(''); setNotice(''); setPreview(false);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor) return;
    const content = parseContent(editor.content);
    if (!content.success) { setError(errorMessage('invalid')); return; }
    const publish = (event.nativeEvent as SubmitEvent).submitter?.getAttribute('value') === 'publish';
    setBusy(true); setError(''); setNotice('');
    try {
      const { published, ...input } = editor;
      const data = await request('PATCH', { action: 'save', ...input, content: content.data, status: publish || published ? 'published' : 'draft' });
      if (data.edition) {
        const edition = data.edition;
        setEditions(current => [...current.filter(item => item.channel !== edition.channel), edition]);
        setEditor({ ...editor, id: edition.id, title: edition.title, summary: edition.summary, content: edition.content ?? editor.content, expectedUpdatedAt: edition.updatedAt, published: edition.status === 'published' });
        setNotice(edition.status === 'published' ? t('已发布，读者现在可以看到这期内容。', 'Published. Readers can now see this edition.') : t('草稿已保存，尚未公开。', 'Draft saved. It is not public yet.'));
      }
    } catch (failure) { setError(errorMessage(failure instanceof Error ? failure.message : 'failed')); }
    finally { setBusy(false); }
  }

  async function retire(edition: DailyEdition) {
    setBusy(true); setError(''); setNotice('');
    let retired = false;
    try {
      await request('PATCH', { action: 'retire', id: edition.id, expectedUpdatedAt: edition.updatedAt });
      retired = true;
      const response = await fetch(`/api/admin/daily?date=${encodeURIComponent(date)}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('load_failed');
      const data = await response.json();
      setEditions(data.editions); setEditor(null); setPreview(false);
      setRetiringId(null);
      setNotice(t('已下架并保留为草稿。', 'Unpublished and kept as a draft.'));
    } catch (failure) {
      setError(retired
        ? t('内容已下架，但列表刷新失败。请重新载入本日期。', 'The edition was unpublished, but refreshing failed. Reload this date.')
        : errorMessage(failure instanceof Error ? failure.message : 'failed'));
    }
    finally { setBusy(false); }
  }

  function updateEnglish(patch: Partial<EnglishContent>) {
    setEditor(current => current?.content.kind === 'english' ? { ...current, content: { ...current.content, ...patch } } : current);
  }

  function updateItem(index: number, patch: Partial<DailyLinkItem>) {
    setEditor(current => current && current.content.kind !== 'english'
      ? { ...current, content: { ...current.content, items: current.content.items.map((item, i) => i === index ? { ...item, ...patch } : item) } }
      : current);
  }

  const statuses = {
    draft: t('待审核', 'Draft'), published: t('已发布', 'Published'), empty: t('无新内容', 'No new content'), failed: t('采集失败', 'Failed'),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <form onSubmit={loadDate} className="flex items-end gap-2">
          <label className="space-y-1 text-sm text-white/70"><span className="block">{t('期刊日期 · 北京时间', 'Edition date · Beijing time')}</span><input type="date" required value={dateInput} disabled={busy} onChange={event => setDateInput(event.target.value)} className={inputClass} /></label>
          <button className={buttonClass} disabled={busy}>{t('载入', 'Load')}</button>
        </form>
        <button className={buttonClass} type="button" disabled={busy || date !== dailyDate() || dateInput !== date} onClick={() => generate()}>{busy ? t('处理中…', 'Working…') : t('生成当天内容', 'Generate editions')}</button>
      </div>
      <p className="text-sm text-white/60">{t('现有草稿和已发布内容不会被重新生成覆盖。发布会按官方信息手工录入；没有新活动时可以留空。', 'Generation preserves existing drafts and published editions. Enter events from official information; an empty day is fine.')}</p>
      {dateInput !== date && <p className="text-sm text-white/70">{t('日期已更改，请先载入。下方仍为', 'Date changed. Load it first; the editions below are still for')} {date}。</p>}
      {date !== dailyDate() && <p className="text-sm text-white/60">{t('仅今天支持自动生成，历史和未来期刊可手工编辑。', 'Automatic generation is available only for today. Edit past and future editions manually.')}</p>}
      {error && <p role="alert" className="rounded-lg border border-red-400/30 p-3 text-sm text-red-200">{error}</p>}
      {notice && <p role="status" className="text-sm text-emerald-300">{notice}</p>}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {dailyEditionChannels.map(channel => {
          const edition = editions.find(item => item.channel === channel.id);
          return <section key={channel.id} className={panelClass}>
            <h2 className="t-title-4">{en ? channel.en : channel.zh}</h2>
            <p className="mt-2 text-sm text-white/70">{date} · {edition ? statuses[edition.status] : t('尚未准备', 'Not prepared')}</p>
            {edition?.error && <p className="mt-2 break-words text-xs text-red-200">{edition.error === 'content_unavailable' ? t('来源暂时不可用，请稍后重试。', 'The source is temporarily unavailable. Retry later.') : edition.error}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className={buttonClass} disabled={busy} onClick={() => edit(channel.id)}>{edition?.content ? t('编辑 / 预览', 'Edit / preview') : t('录入内容', 'Create content')}</button>
              {channel.id !== 'events' && (!edition || edition.status === 'failed' || edition.status === 'empty') && <button type="button" className={buttonClass} disabled={busy || date !== dailyDate() || dateInput !== date} onClick={() => generate(channel.id)}>{edition ? t('重试', 'Retry') : t('生成', 'Generate')}</button>}
              {edition?.status === 'published' && <button type="button" className={buttonClass} disabled={busy} onClick={() => setRetiringId(edition.id)}>{t('下架', 'Unpublish')}</button>}
            </div>
            {edition?.status === 'published' && retiringId === edition.id && <div className="mt-4 border-t border-amber-300/30 pt-4" role="alert">
              <p className="text-sm text-amber-200">{t('下架后读者将看不到这期内容，草稿会保留。', 'Readers will no longer see this edition. Its draft will be kept.')}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className={buttonClass} disabled={busy} onClick={() => setRetiringId(null)}>{t('取消下架', 'Cancel unpublishing')}</button>
                <button type="button" className={buttonClass} disabled={busy} onClick={() => retire(edition)}>{t('确认下架', 'Confirm unpublishing')}</button>
              </div>
            </div>}
          </section>;
        })}
      </div>

      {editor && <form onSubmit={save} className={`${panelClass} space-y-5`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="t-title-3">{en ? dailyEditionChannels.find(item => item.id === editor.channel)?.en : dailyEditionChannels.find(item => item.id === editor.channel)?.zh} · {editor.date}</h2>
          <button className={buttonClass} type="button" disabled={busy} onClick={() => { setEditor(null); setPreview(false); }}>{t('关闭编辑', 'Close editor')}</button>
        </div>
        <fieldset disabled={busy} className="space-y-5">
          <Field label={t('标题', 'Title')} value={editor.title} onChange={title => setEditor({ ...editor, title })} maxLength={300} required />
          <Field label={t('本期摘要', 'Edition summary')} value={editor.summary} onChange={summary => setEditor({ ...editor, summary })} multiline maxLength={2000} />

          {editor.content.kind === 'english' ? <>
            <h3 className="t-title-4">{t('词汇与表达', 'Vocabulary and expressions')}</h3>
            {editor.content.vocabulary.map((word, index) => <div key={index} className="space-y-3 rounded-lg border border-white/10 p-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {(['term', 'meaning', 'example', 'translation'] as const).map((key, fieldIndex) => <Field key={key} label={[t('词 / 表达', 'Expression'), t('释义', 'Meaning'), t('原创例句', 'Original example'), t('例句翻译', 'Example translation')][fieldIndex]} value={word[key]} required maxLength={key === 'term' ? 100 : key === 'meaning' ? 500 : 1000} onChange={value => { if (editor.content.kind === 'english') updateEnglish({ vocabulary: editor.content.vocabulary.map((item, i) => i === index ? { ...item, [key]: value } : item) }); }} />)}
              </div>
              <button type="button" className={buttonClass} disabled={editor.content.kind !== 'english' || editor.content.vocabulary.length <= 1} onClick={() => { if (editor.content.kind === 'english') updateEnglish({ vocabulary: editor.content.vocabulary.filter((_, i) => i !== index) }); }}>{t('移除表达', 'Remove expression')}</button>
            </div>)}
            <button type="button" className={buttonClass} disabled={editor.content.vocabulary.length >= 10} onClick={() => { if (editor.content.kind === 'english') updateEnglish({ vocabulary: [...editor.content.vocabulary, { term: '', meaning: '', example: '', translation: '' }] }); }}>{t('添加表达', 'Add expression')}</button>
            <Field label={t('短阅读', 'Short reading')} value={editor.content.passage} onChange={passage => updateEnglish({ passage })} multiline required />
            <Field label={t('阅读译文（选填）', 'Translation (optional)')} value={editor.content.passageTranslation ?? ''} onChange={passageTranslation => updateEnglish({ passageTranslation })} multiline />
            <h3 className="t-title-4">{t('练习与答案', 'Questions and answers')}</h3>
            {editor.content.questions.map((question, index) => <div key={index} className="space-y-3 rounded-lg border border-white/10 p-3">
              <Field label={`${t('题目', 'Question')} ${index + 1}`} value={question.question} required maxLength={1000} onChange={value => { if (editor.content.kind === 'english') updateEnglish({ questions: editor.content.questions.map((item, i) => i === index ? { ...item, question: value } : item) }); }} />
              {question.options.map((option, optionIndex) => <Field key={optionIndex} label={`${t('选项', 'Option')} ${optionIndex + 1}`} value={option} required maxLength={500} onChange={value => { if (editor.content.kind === 'english') updateEnglish({ questions: editor.content.questions.map((item, i) => i === index ? { ...item, options: item.options.map((text, j) => j === optionIndex ? value : text) } : item) }); }} />)}
              <div className="flex flex-wrap gap-2">
                <button className={buttonClass} type="button" disabled={question.options.length >= 6} onClick={() => { if (editor.content.kind === 'english') updateEnglish({ questions: editor.content.questions.map((item, i) => i === index ? { ...item, options: [...item.options, ''] } : item) }); }}>{t('添加选项', 'Add option')}</button>
                <button className={buttonClass} type="button" disabled={question.options.length <= 2} onClick={() => { if (editor.content.kind === 'english') updateEnglish({ questions: editor.content.questions.map((item, i) => i === index ? { ...item, options: item.options.slice(0, -1), answerIndex: Math.min(item.answerIndex, item.options.length - 2) } : item) }); }}>{t('移除末项', 'Remove last option')}</button>
              </div>
              <Select label={t('正确选项', 'Correct answer')} value={String(question.answerIndex)} options={question.options.map((_, i) => [String(i), `${t('选项', 'Option')} ${i + 1}`])} onChange={value => { if (editor.content.kind === 'english') updateEnglish({ questions: editor.content.questions.map((item, i) => i === index ? { ...item, answerIndex: Number(value) } : item) }); }} />
              <Field label={t('答案解析', 'Explanation')} value={question.explanation} required maxLength={2000} multiline onChange={value => { if (editor.content.kind === 'english') updateEnglish({ questions: editor.content.questions.map((item, i) => i === index ? { ...item, explanation: value } : item) }); }} />
              <button type="button" className={buttonClass} disabled={editor.content.kind !== 'english' || editor.content.questions.length <= 1} onClick={() => { if (editor.content.kind === 'english') updateEnglish({ questions: editor.content.questions.filter((_, i) => i !== index) }); }}>{t('移除练习', 'Remove question')}</button>
            </div>)}
            <button type="button" className={buttonClass} disabled={editor.content.questions.length >= 5} onClick={() => { if (editor.content.kind === 'english') updateEnglish({ questions: [...editor.content.questions, { question: '', options: ['', ''], answerIndex: 0, explanation: '' }] }); }}>{t('添加练习', 'Add question')}</button>
          </> : <>
            <p className="text-sm text-white/60">{t('时间需包含已确认的时区偏移，例如 2026-10-14T09:30:00+08:00。不确定时留空。', 'Include the confirmed time-zone offset, for example 2026-10-14T09:30:00+08:00. Leave unknown times empty.')}</p>
            {editor.content.items.map((item, index) => <div key={index} className="space-y-4 rounded-lg border border-white/10 p-4">
              <h3 className="t-title-4">{t('条目', 'Item')} {index + 1}</h3>
              <Field label={t('标题', 'Title')} value={item.title} required maxLength={300} onChange={title => updateItem(index, { title })} />
              <Field label={editor.channel === 'papers' ? t('问题、方法与阅读提示', 'Problem, method and reading guidance') : t('事实摘要', 'Factual summary')} value={item.summary} multiline required onChange={summary => updateItem(index, { summary })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={t('原文 / 官方活动链接', 'Original / official event URL')} value={item.url} required type="url" maxLength={2000} onChange={url => updateItem(index, { url })} />
                <Field label={t('来源名称', 'Source name')} value={item.sourceName} required maxLength={100} onChange={sourceName => updateItem(index, { sourceName })} />
                <Select label={t('来源身份', 'Source type')} value={item.sourceType} options={editor.channel === 'events' ? [['official', t('官方', 'Official')]] : [['official', t('官方', 'Official')], ['aggregator', t('第三方聚合', 'Third-party aggregator')]]} onChange={value => updateItem(index, { sourceType: value as DailyLinkItem['sourceType'] })} />
                <Field label={t('来源发布时间（选填）', 'Source publication time (optional)')} value={item.sourcePublishedAt ?? ''} onChange={value => updateItem(index, { sourcePublishedAt: value || undefined })} />
              </div>
              {editor.channel === 'papers' && <>
                {item.originalAbstract && <details className="rounded-lg border border-white/10 p-3 text-sm text-white/70"><summary className="cursor-pointer">{t('原始摘要（只读）', 'Original abstract (read only)')}</summary><p className="mt-3 whitespace-pre-wrap leading-relaxed">{item.originalAbstract}</p></details>}
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label={t('论文 ID', 'Paper ID')} value={item.id} required maxLength={300} onChange={id => updateItem(index, { id })} />
                  <Field label={t('版本', 'Version')} value={item.version ?? ''} maxLength={40} onChange={version => updateItem(index, { version })} />
                  <Field label={t('学科标签', 'Subject')} value={item.category ?? ''} maxLength={100} onChange={category => updateItem(index, { category })} />
                  <Select label={t('阅读难度', 'Reading level')} value={item.difficulty ?? 'intermediate'} options={[[ 'introductory', t('入门', 'Introductory') ], ['intermediate', t('进阶', 'Intermediate')], ['advanced', t('深入', 'Advanced')]]} onChange={value => updateItem(index, { difficulty: value as DailyLinkItem['difficulty'] })} />
                </div>
                <Field label={t('作者（每行一位）', 'Authors (one per line)')} value={item.authors?.join('\n') ?? ''} multiline onChange={value => updateItem(index, { authors: value.split('\n') })} />
                <Field label={t('已有代码链接（选填）', 'Existing code URL (optional)')} value={item.codeUrl ?? ''} type="url" maxLength={2000} onChange={value => updateItem(index, { codeUrl: value || undefined })} />
                <label className="flex items-center gap-2 text-sm text-white/70"><input type="checkbox" checked={item.preprint ?? false} onChange={event => updateItem(index, { preprint: event.target.checked })} />{t('预印本，未经同行评审', 'Preprint, not peer reviewed')}</label>
              </>}
              {editor.channel === 'events' && <div className="grid gap-3 sm:grid-cols-2">
                <Select label={t('活动阶段', 'Event phase')} value={item.phase ?? 'upcoming'} options={[[ 'upcoming', t('预告', 'Upcoming') ], ['live', t('正在进行', 'Live')], ['replay', t('回放', 'Replay')]]} onChange={value => updateItem(index, { phase: value as DailyLinkItem['phase'] })} />
                <Field label={t('实际开始时间（未知留空）', 'Actual start time (leave unknown empty)')} value={item.startAt ?? ''} onChange={value => updateItem(index, { startAt: value || undefined })} />
                <Field label={t('已确认的时区', 'Confirmed time zone')} value={item.timeZone ?? ''} maxLength={80} placeholder="Asia/Shanghai" required={Boolean(item.startAt)} onChange={value => updateItem(index, { timeZone: value || undefined })} />
              </div>}
              <button type="button" className={buttonClass} disabled={editor.content.kind === 'english' || editor.content.items.length <= 1} onClick={() => { if (editor.content.kind !== 'english') setEditor({ ...editor, content: { ...editor.content, items: editor.content.items.filter((_, i) => i !== index) } }); }}>{t('移除条目', 'Remove item')}</button>
            </div>)}
            <button type="button" className={buttonClass} disabled={editor.content.items.length >= (editor.channel === 'papers' ? 3 : editor.channel === 'ai' ? 5 : 10)} onClick={() => { if (editor.content.kind !== 'english') setEditor({ ...editor, content: { ...editor.content, items: [...editor.content.items, newItem(editor.content.kind)] } }); }}>{t('添加条目', 'Add item')}</button>
          </>}
        </fieldset>
        <div className="flex flex-wrap gap-3">
          <button type="button" className={buttonClass} disabled={busy} onClick={() => { if (!parseContent(editor.content).success) { setError(errorMessage('invalid')); return; } setPreview(!preview); }}>{preview ? t('收起预览', 'Hide preview') : t('预览内容', 'Preview content')}</button>
          <button type="submit" value="save" className={buttonClass} disabled={busy}>{editor.published ? t('保存已发布内容', 'Save published edition') : t('保存草稿', 'Save draft')}</button>
          {!editor.published && <button type="submit" value="publish" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={busy}>{t('审核通过并发布', 'Approve and publish')}</button>}
        </div>
        {preview && <section aria-label={t('内容预览', 'Content preview')} className="space-y-4 border-t border-white/15 pt-5">
          <p className="text-sm text-white/60">{t('管理预览 · 练习答案在此可见', 'Admin preview · answers are visible here')}</p>
          <h3 className="t-title-3">{editor.title}</h3><p className="whitespace-pre-wrap text-white/70">{editor.summary}</p>
          {editor.content.kind === 'english' ? <>
            <dl className="space-y-3">{editor.content.vocabulary.map((word, i) => <div key={i}><dt className="font-semibold">{word.term} · {word.meaning}</dt><dd className="mt-1 text-white/70">{word.example}<br />{word.translation}</dd></div>)}</dl>
            <p className="whitespace-pre-wrap leading-relaxed">{editor.content.passage}</p>
            {editor.content.passageTranslation && <p className="whitespace-pre-wrap text-white/70">{editor.content.passageTranslation}</p>}
            {editor.content.questions.map((question, index) => <div key={index} className="space-y-2"><p className="font-medium">{question.question}</p><ol className="list-inside list-decimal text-white/70">{question.options.map((option, i) => <li key={i}>{option}{i === question.answerIndex ? ' ✓' : ''}</li>)}</ol><p className="text-white/70">{question.explanation}</p></div>)}
          </> : editor.content.items.map((item, index) => <article key={index} className="space-y-2 border-t border-white/10 pt-3">
            <h4 className="font-semibold">{item.title}</h4><p className="whitespace-pre-wrap text-white/70">{item.summary}</p>
            <p className="text-sm text-white/60">{item.sourceName} · {item.sourceType === 'official' ? t('官方', 'Official') : t('第三方聚合', 'Aggregator')}{item.sourcePublishedAt ? ` · ${item.sourcePublishedAt}` : ''}</p>
            {item.authors?.length ? <p className="text-sm text-white/70">{item.authors.join(', ')} · {item.version} {item.preprint ? t('· 预印本', '· Preprint') : ''}</p> : null}
            {editor.channel === 'events' && <p className="text-sm text-white/70">{item.phase === 'replay' ? t('回放', 'Replay') : item.phase === 'live' ? t('正在进行', 'Live') : t('预告', 'Upcoming')} · {item.startAt ?? t('时间待定', 'Time to be confirmed')}{item.timeZone ? ` · ${item.timeZone}` : ''}</p>}
            {item.url.startsWith('https://') && <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-violet-300 underline">{t('查看原文 / 官方活动', 'Open original / official event')}</a>}
          </article>)}
        </section>}
      </form>}
    </div>
  );
}
