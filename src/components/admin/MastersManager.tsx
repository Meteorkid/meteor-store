'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useLocale } from 'next-intl';
import { admissionsConfig, type AdmissionsKind } from '@/lib/admissions/config';
import { dailyDate } from '@/lib/daily/types';
import { mastersRegions, MastersRoundInputSchema, type MastersRound, type MastersRoundDetails, type MastersRoundInput } from '@/lib/masters/types';

const inputClass = 'w-full rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-violet-400 disabled:opacity-60';
const buttonClass = 'min-h-10 rounded-lg border border-white/15 px-3 py-2 text-sm text-white disabled:opacity-50';
const panelClass = 'rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5';

type PendingAction = { kind: 'load'; year: number } | { kind: 'edit'; round?: MastersRound }
  | { kind: 'close' } | { kind: 'unpublish'; round: MastersRound };

function emptyRound(intakeYear: number, kind: AdmissionsKind): MastersRoundInput {
  return {
    intakeYear, region: 'hong-kong', status: 'draft', verifiedOn: null,
    details: {
      university: '', programme: '', subject: '', studyType: kind === 'phd' ? 'research' : 'taught', studyMode: '', intakeLabel: '',
      applicantGroup: '', roundName: '', eventType: 'application', opensOn: null, openingNote: '', openingState: 'unknown',
      deadlineStatus: 'unverified', deadlineOn: null, deadlineAt: null, deadlineTimeZone: null, deadlineText: '',
      rolling: false, mayCloseEarly: false, officialUrl: '', sourceNote: '',
    },
  };
}

function editableRound(round: MastersRound): MastersRoundInput {
  return { id: round.id, intakeYear: round.intakeYear, region: round.region, details: structuredClone(round.details),
    status: round.status, verifiedOn: round.verifiedOn, expectedUpdatedAt: round.updatedAt };
}

function Field({ label, value, onChange, multiline = false, required = false, type = 'text', maxLength = 300, placeholder, disabled = false, max }: {
  label: string; value: string; onChange: (value: string) => void; multiline?: boolean; required?: boolean;
  type?: 'text' | 'date' | 'url'; maxLength?: number; placeholder?: string; disabled?: boolean; max?: string;
}) {
  const props = { className: inputClass, value, required, maxLength, placeholder, disabled,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value) };
  return <label className="block space-y-1.5 text-sm text-white/70"><span>{label}{required ? ' *' : ''}</span>
    {multiline ? <textarea {...props} rows={3} /> : <input {...props} type={type} max={max} />}
  </label>;
}

function Select({ label, value, options, onChange }: {
  label: string; value: string; options: readonly (readonly [string, string])[]; onChange: (value: string) => void;
}) {
  return <label className="block space-y-1.5 text-sm text-white/70"><span>{label}</span><select className={inputClass} value={value} onChange={event => onChange(event.target.value)}>
    {options.map(([id, text]) => <option value={id} key={id}>{text}</option>)}
  </select></label>;
}

interface MastersManagerProps { initialYear: number; initialRounds: MastersRound[]; kind?: AdmissionsKind }

export default function MastersManager(props: MastersManagerProps) {
  return <MastersManagerForScope key={`${props.kind ?? 'masters'}:${props.initialYear}`} {...props} />;
}

function MastersManagerForScope({ initialYear, initialRounds, kind = 'masters' }: MastersManagerProps) {
  const config = admissionsConfig[kind];
  const en = useLocale() === 'en';
  const t = (zh: string, english: string) => en ? english : zh;
  const [year, setYear] = useState(initialYear);
  const [yearInput, setYearInput] = useState(String(initialYear));
  const [rounds, setRounds] = useState(initialRounds);
  const [editor, setEditor] = useState<MastersRoundInput | null>(null);
  const [baseline, setBaseline] = useState('');
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const confirmationRef = useRef<HTMLDivElement>(null);
  const dirty = editor !== null && JSON.stringify(editor) !== baseline;

  useEffect(() => { if (pending) confirmationRef.current?.focus(); }, [pending]);

  const deadlineLabels = {
    confirmed: t('已核验日期', 'Confirmed'), unannounced: t('官方尚未公布', 'Not announced'), unverified: t('待核验', 'Needs verification'),
  };
  const eventLabels = {
    application: t('申请提交', 'Application submission'), documents: t('材料补交', 'Supporting documents'),
    recommendation: t('推荐信', 'References'), scholarship: t('奖学金', 'Scholarship'),
  };
  const openingLabels = {
    unknown: t('尚未确认是否开放', 'Opening not confirmed'), scheduled: t('已公布开放日', 'Opening date announced'),
    open: t('官方确认已开放', 'Confirmed open'), closed: t('已关闭 / 撤回窗口', 'Closed / withdrawn'),
  };

  function errorMessage(code: string) {
    return ({
      conflict: t('记录已被其他操作更新，当前输入仍保留。请重新载入该年份后再编辑。', 'This record changed elsewhere. Your input is preserved; reload the year before editing again.'),
      invalid: t('请核对必填项、官方链接、核验日期，以及截止日期与时区是否一致。', 'Check required fields, the official URL, verification date, deadline and time zone.'),
      too_large: t('内容超过 128 KB，请缩短后重试。', 'Content exceeds 128 KB. Shorten it and retry.'),
      rate_limited: t('操作过于频繁，请稍后重试。', 'Too many requests. Please retry shortly.'),
      not_found: t('管理会话已失效，请重新登录。', 'Your administrator session expired. Please sign in again.'),
      origin: t('请求来源校验失败，请从本站重新进入后台。', 'Origin check failed. Reopen the admin page on this site.'),
    }[code] ?? t('操作失败，未保存的输入仍保留，请稍后重试。', 'The request failed. Unsaved input is preserved; please retry.'));
  }

  function invalidMessage(message: string) {
    return ({
      'Confirmed deadlines need a calendar date': t('“已核验日期”必须填写官方截止日。', 'A confirmed deadline needs its official calendar date.'),
      'Unverified dates cannot be used as confirmed deadlines': t('尚未公布或待核验时，不可填写推测的截止日。请把参考信息写在来源说明中。', 'Do not assign a guessed deadline to an unannounced or unverified date. Keep references in the source notes.'),
      'An exact deadline needs a date and confirmed time zone': t('准确时刻必须同时有截止日和已确认的时区。', 'An exact time needs both a deadline date and a confirmed time zone.'),
      'Deadline instant does not match its local date': t('准确时刻换算到所填时区后，与截止日不一致。', 'The exact time does not fall on the deadline date in the selected time zone.'),
      'Opening date must not be after the deadline': t('开放日不能晚于截止日。', 'The opening date cannot be later than the deadline.'),
      'Publishing needs a non-future verification date': t('发布前请填写已经完成核验的日期，不能填未来日期。', 'Publishing needs the date you verified the source. It cannot be in the future.'),
      'Invalid time zone': t('时区无效，请填写如 Asia/Hong_Kong 或 Europe/London。', 'Use a valid time zone such as Asia/Hong_Kong or Europe/London.'),
      'Use an HTTPS official source': t('官方来源链接必须使用 HTTPS。', 'The official source must use HTTPS.'),
    }[message] ?? errorMessage('invalid'));
  }

  async function readRounds(targetYear: number): Promise<MastersRound[]> {
    const response = await fetch(`${config.adminApiBase}?year=${targetYear}`, { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.errorCode ?? 'load_failed');
    return data.rounds;
  }

  async function write(method: 'POST' | 'PATCH', body: unknown): Promise<{ round?: MastersRound; created?: number }> {
    const response = await fetch(config.adminApiBase, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.errorCode ?? 'failed');
    return data;
  }

  async function loadYear(targetYear: number) {
    setBusy(true); setError(''); setNotice('');
    try {
      const data = await readRounds(targetYear);
      setRounds(data); setYear(targetYear); setYearInput(String(targetYear)); setEditor(null); setPreview(false);
    } catch (failure) { setError(errorMessage(failure instanceof Error ? failure.message : 'failed')); }
    finally { setBusy(false); }
  }

  function execute(action: PendingAction) {
    setPending(null);
    if (action.kind === 'load') { void loadYear(action.year); return; }
    if (action.kind === 'unpublish') { void unpublish(action.round); return; }
    if (action.kind === 'close') { setEditor(null); setPreview(false); return; }
    const input = action.round ? editableRound(action.round) : emptyRound(year, kind);
    setEditor(input); setBaseline(JSON.stringify(input)); setPreview(false); setError(''); setNotice('');
  }

  function requestAction(action: PendingAction) {
    if (action.kind === 'unpublish' || dirty) setPending(action);
    else execute(action);
  }

  async function importSeeds() {
    setBusy(true); setError(''); setNotice('');
    let imported = false;
    try {
      const data = await write('POST', { action: 'import' });
      imported = true;
      setNotice(t(`已新增 ${data.created ?? 0} 条官方资料草稿。已有记录不会覆盖，按入学年份载入后审核。`, `Added ${data.created ?? 0} official-source drafts. Existing records were preserved. Load their intake year to review.`));
      setRounds(await readRounds(year));
    } catch (failure) {
      setError(imported ? t('草稿导入已完成，但列表刷新失败，请重新载入年份。', 'Draft import finished, but refreshing failed. Reload the year.') : errorMessage(failure instanceof Error ? failure.message : 'failed'));
    } finally { setBusy(false); }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor) return;
    const publish = (event.nativeEvent as SubmitEvent).submitter?.getAttribute('value') === 'publish';
    const input = MastersRoundInputSchema.safeParse({ ...editor, status: publish ? 'published' : editor.status });
    if (!input.success) { setError(invalidMessage(input.error.issues[0]?.message ?? 'invalid')); return; }
    setBusy(true); setError(''); setNotice('');
    try {
      const data = await write('PATCH', { action: 'save', input: input.data });
      if (!data.round) throw new Error('save_failed');
      const round = data.round;
      const next = editableRound(round);
      setRounds(current => [...current.filter(item => item.id !== round.id), round]);
      setEditor(next); setBaseline(JSON.stringify(next));
      setNotice(round.status === 'published'
        ? t('已审核发布。经核验的日期更正将按规则提示关注者。', 'Published. Verified date corrections will notify followers according to their settings.')
        : t('草稿已保存，尚未公开。', 'Draft saved. It is not public yet.'));
    } catch (failure) { setError(errorMessage(failure instanceof Error ? failure.message : 'failed')); }
    finally { setBusy(false); }
  }

  async function unpublish(round: MastersRound) {
    setBusy(true); setError(''); setNotice('');
    let saved = false;
    try {
      await write('PATCH', { action: 'unpublish', id: round.id, expectedUpdatedAt: round.updatedAt });
      saved = true;
      if (editor?.id === round.id) { setEditor(null); setPreview(false); }
      setRounds(await readRounds(year));
      setNotice(t('已下架并保留草稿，公开日历不再展示。', 'Unpublished and kept as a draft. It is no longer listed publicly.'));
    } catch (failure) {
      setError(saved ? t('已下架，但列表刷新失败，请重新载入年份。', 'Unpublished, but refreshing failed. Reload the year.') : errorMessage(failure instanceof Error ? failure.message : 'failed'));
    } finally { setBusy(false); }
  }

  function updateDetails<K extends keyof MastersRoundDetails>(key: K, value: MastersRoundDetails[K]) {
    setEditor(current => current ? { ...current, details: { ...current.details, [key]: value } } : current);
  }

  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <form onSubmit={event => { event.preventDefault(); requestAction({ kind: 'load', year: Number(yearInput) }); }} className="flex items-end gap-2">
        <label className="space-y-1 text-sm text-white/70"><span className="block">{t('入学年份', 'Intake year')}</span><input type="number" min={2020} max={2100} required disabled={busy || pending !== null} value={yearInput} onChange={event => setYearInput(event.target.value)} className={`${inputClass} max-w-36`} /></label>
        <button type="submit" className={buttonClass} disabled={busy || pending !== null}>{t('载入年份', 'Load year')}</button>
      </form>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} disabled={busy || pending !== null} onClick={importSeeds}>{t('导入首批官方草稿', 'Import official-source drafts')}</button>
        <button type="button" className={buttonClass} disabled={busy || pending !== null || yearInput !== String(year)} onClick={() => requestAction({ kind: 'edit' })}>{t('新增申请轮次', 'Add application round')}</button>
      </div>
    </div>
    <p className="text-sm text-white/60">{t('已接入的官方项目每天自动核对并发布。每条记录区分入学季、申请群体和事项；人工编辑或下架会暂停该记录的自动更新。', 'Connected official programmes are checked and published automatically each day. Editing or unpublishing a record pauses automatic updates for it.')}</p>
    {yearInput !== String(year) && <p className="text-sm text-white/70">{t(`请先载入新年份；下方仍是 ${year} 年记录。`, `Load the new year first. The records below are still for ${year}.`)}</p>}
    {error && <p role="alert" className="rounded-lg border border-red-400/30 p-3 text-sm text-red-200">{error}</p>}
    {notice && <p role="status" className="text-sm text-emerald-300">{notice}</p>}

    {pending && <div ref={confirmationRef} tabIndex={-1} role="alert" className="rounded-xl border border-amber-300/40 bg-amber-300/5 p-4 outline-none">
      <p className="text-sm text-amber-200">{pending.kind === 'unpublish'
        ? t('下架后将从公开日历移除并暂停自动发布，草稿仍保留。该记录尚未保存的编辑会关闭。', 'Unpublishing removes this record and pauses automatic publishing. Its draft is kept; unsaved edits will close.')
        : t('此操作会关闭当前未保存的编辑。继续前请确认不需要这些改动。', 'This closes the current unsaved edits. Continue only if you no longer need them.')}</p>
      <div className="mt-3 flex gap-3"><button type="button" className={buttonClass} onClick={() => setPending(null)}>{t('取消', 'Cancel')}</button><button type="button" className={buttonClass} onClick={() => execute(pending)}>{pending.kind === 'unpublish' ? t('确认下架', 'Confirm unpublishing') : t('放弃改动并继续', 'Discard and continue')}</button></div>
    </div>}

    <section aria-label={t('申请轮次列表', 'Application rounds')} className="space-y-3">
      <p className="text-sm text-white/70">{year} · {t(`共 ${rounds.length} 条，${rounds.filter(round => round.status === 'published').length} 条已发布`, `${rounds.length} records, ${rounds.filter(round => round.status === 'published').length} published`)}</p>
      {rounds.length === 0 && <p className={`${panelClass} text-sm text-white/60`}>{t('此入学年暂无记录。可手工新增，或导入后切换到对应入学年。', 'No records for this intake year. Add one manually or import drafts and load their intake year.')}</p>}
      {rounds.map(round => <article key={round.id} className={panelClass}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1"><p className="text-sm text-white/60">{mastersRegions.find(region => region.id === round.region)?.[en ? 'en' : 'zh']} · {round.details.university} · {round.status === 'published' ? t('已发布', 'Published') : t('草稿', 'Draft')}</p>
            <h2 className="mt-2 break-words t-title-4">{round.details.programme}</h2>
            <p className="mt-1 text-sm text-white/70">{round.details.intakeLabel} · {round.details.roundName} · {eventLabels[round.details.eventType]}</p>
            <p className="mt-1 text-sm text-white/60">{deadlineLabels[round.details.deadlineStatus]}{round.details.deadlineOn ? ` · ${round.details.deadlineOn}` : ''} · {t('核验', 'Verified')}: {round.verifiedOn ?? t('尚未核验', 'Not yet verified')}</p>
          </div>
          <div className="flex gap-2"><button type="button" className={buttonClass} disabled={busy || pending !== null} onClick={() => requestAction({ kind: 'edit', round })}>{t('编辑 / 预览', 'Edit / preview')}</button>{round.status === 'published' && <button type="button" className={buttonClass} disabled={busy || pending !== null} onClick={() => requestAction({ kind: 'unpublish', round })}>{t('下架', 'Unpublish')}</button>}</div>
        </div>
      </article>)}
    </section>

    {editor && <form onSubmit={save} className={`${panelClass} space-y-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="t-title-3">{editor.id ? t('编辑申请轮次', 'Edit application round') : t('新增申请轮次', 'New application round')} · {editor.intakeYear}</h2><button type="button" className={buttonClass} disabled={busy || pending !== null} onClick={() => requestAction({ kind: 'close' })}>{t('关闭编辑', 'Close editor')}</button></div>
      <fieldset disabled={busy || pending !== null} className="space-y-5">
        <legend className="sr-only">{t('申请轮次信息', 'Application round details')}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label={t('地区', 'Region')} value={editor.region} options={mastersRegions.map(region => [region.id, en ? region.en : region.zh])} onChange={value => setEditor({ ...editor, region: value as MastersRoundInput['region'] })} />
          <label className="block space-y-1.5 text-sm text-white/70"><span>{t('入学年份（切换年份后可新建）', 'Intake year (load another year to add it)')}</span><input className={inputClass} value={editor.intakeYear} readOnly /></label>
          <Field label={t('学校', 'University')} value={editor.details.university} required onChange={value => updateDetails('university', value)} />
          <Field label={t('具体专业 / 项目', 'Specific programme')} value={editor.details.programme} required onChange={value => updateDetails('programme', value)} />
          <Field label={t('专业方向', 'Subject area')} value={editor.details.subject} required maxLength={100} onChange={value => updateDetails('subject', value)} />
          <Select label={t('培养类型', 'Study type')} value={editor.details.studyType} options={kind === 'phd' ? [['research', t('研究型', 'Research')]] : [[ 'taught', t('授课型', 'Taught') ], ['research', t('研究型', 'Research')]]} onChange={value => updateDetails('studyType', value as MastersRoundDetails['studyType'])} />
          <Field label={t('修读方式 / 学制', 'Study mode / duration')} value={editor.details.studyMode} required maxLength={100} onChange={value => updateDetails('studyMode', value)} />
          <Field label={t('入学季', 'Intake / term')} value={editor.details.intakeLabel} required maxLength={100} placeholder={t('如：2027 年秋季', 'For example: Autumn 2027')} onChange={value => updateDetails('intakeLabel', value)} />
          <Field label={t('适用申请人群体', 'Eligible applicant group')} value={editor.details.applicantGroup} required placeholder={t('明确国际 / 本地等适用范围', 'Specify international / domestic or other scope')} onChange={value => updateDetails('applicantGroup', value)} />
          <Field label={t('轮次名称', 'Application round')} value={editor.details.roundName} required maxLength={100} onChange={value => updateDetails('roundName', value)} />
          <Select label={t('截止事项', 'Deadline type')} value={editor.details.eventType} options={Object.entries(eventLabels)} onChange={value => updateDetails('eventType', value as MastersRoundDetails['eventType'])} />
        </div>

        <section className="space-y-4 border-t border-white/10 pt-5"><h3 className="t-title-4">{t('开放状态', 'Application opening')}</h3>
          <div className="grid gap-4 sm:grid-cols-2"><Select label={t('是否开放', 'Opening status')} value={editor.details.openingState} options={Object.entries(openingLabels)} onChange={value => updateDetails('openingState', value as MastersRoundDetails['openingState'])} />
            <Field label={t('官方开放日期（未披露留空）', 'Official opening date (blank if undisclosed)')} value={editor.details.opensOn ?? ''} type="date" onChange={value => updateDetails('opensOn', value || null)} /></div>
          <Field label={t('开放信息说明', 'Opening notes')} value={editor.details.openingNote} multiline maxLength={500} onChange={value => updateDetails('openingNote', value)} />
        </section>

        <section className="space-y-4 border-t border-white/10 pt-5"><h3 className="t-title-4">{t('截止日期与精度', 'Deadline and precision')}</h3>
          <p className="text-sm text-white/60">{t('官方只给日期就只填日期；没有时刻时不要补成 23:59。未公布或待核验的参考信息写进说明，不填推测日期。', 'Keep date-only deadlines date-only. Do not invent 23:59. Put unannounced or unverified references in the notes instead of assigning a guessed date.')}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label={t('截止信息状态', 'Deadline verification status')} value={editor.details.deadlineStatus} options={Object.entries(deadlineLabels)} onChange={value => setEditor({ ...editor, details: { ...editor.details,
              deadlineStatus: value as MastersRoundDetails['deadlineStatus'], deadlineOn: value === 'confirmed' ? editor.details.deadlineOn : null, deadlineAt: value === 'confirmed' ? editor.details.deadlineAt : null,
            } })} />
            <Field label={t('官方截止日', 'Official deadline date')} value={editor.details.deadlineOn ?? ''} type="date" required={editor.details.deadlineStatus === 'confirmed'} disabled={editor.details.deadlineStatus !== 'confirmed'} onChange={value => updateDetails('deadlineOn', value || null)} />
            <Field label={t('准确时刻（选填，含时区偏移）', 'Exact time (optional, include offset)')} value={editor.details.deadlineAt ?? ''} maxLength={60} disabled={editor.details.deadlineStatus !== 'confirmed'} placeholder="2027-01-06T12:00:00+00:00" onChange={value => updateDetails('deadlineAt', value || null)} />
            <Field label={t('官方确认时区（未披露留空）', 'Confirmed time zone (blank if undisclosed)')} value={editor.details.deadlineTimeZone ?? ''} maxLength={80} required={Boolean(editor.details.deadlineAt)} placeholder="Europe/London" onChange={value => updateDetails('deadlineTimeZone', value || null)} />
          </div>
          <Field label={t('官方日期原文 / 精度说明', 'Official date wording / precision notes')} value={editor.details.deadlineText} multiline maxLength={500} onChange={value => updateDetails('deadlineText', value)} />
          <div className="flex flex-wrap gap-5 text-sm text-white/70"><label className="flex items-center gap-2"><input type="checkbox" checked={editor.details.rolling} onChange={event => updateDetails('rolling', event.target.checked)} />{t('滚动审理（可与分轮截止并存）', 'Rolling admissions (can have round deadlines)')}</label><label className="flex items-center gap-2"><input type="checkbox" checked={editor.details.mayCloseEarly} onChange={event => updateDetails('mayCloseEarly', event.target.checked)} />{t('官方说明可能提前关闭', 'Official source says it may close early')}</label></div>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-5"><h3 className="t-title-4">{t('官方依据与核验', 'Official source and verification')}</h3>
          <Field label={t('官方项目 / 招生页面', 'Official programme / admissions URL')} value={editor.details.officialUrl} required type="url" maxLength={2000} onChange={value => updateDetails('officialUrl', value)} />
          <Field label={t('来源依据与适用范围说明', 'Source evidence and applicability')} value={editor.details.sourceNote} required multiline maxLength={2000} onChange={value => updateDetails('sourceNote', value)} />
          <Field label={t('实际核验日期（发布必填）', 'Actual verification date (required to publish)')} value={editor.verifiedOn ?? ''} type="date" max={dailyDate()} onChange={value => setEditor({ ...editor, verifiedOn: value || null })} />
          {editor.status === 'published' && <p className="text-sm text-amber-200">{t('正在编辑已发布记录。请核对来源后保存，更正后的日期会更新版本并提示关注者。', 'You are editing a published record. Verify its source before saving; date corrections update its version and notify followers.')}</p>}
        </section>
      </fieldset>
      <div className="flex flex-wrap gap-3">
        <button type="button" className={buttonClass} disabled={busy || pending !== null} onClick={() => {
          const parsed = MastersRoundInputSchema.safeParse({ ...editor, status: 'draft' });
          if (!parsed.success) { setError(invalidMessage(parsed.error.issues[0]?.message ?? 'invalid')); return; }
          setPreview(value => !value);
        }}>{preview ? t('收起预览', 'Hide preview') : t('预览记录', 'Preview record')}</button>
        <button type="submit" value="save" className={buttonClass} disabled={busy || pending !== null}>{editor.status === 'published' ? t('保存已发布更正', 'Save published corrections') : t('保存草稿', 'Save draft')}</button>
        {editor.status === 'draft' && <button type="submit" value="publish" className="min-h-10 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={busy || pending !== null}>{t('手动发布', 'Publish manually')}</button>}
      </div>

      {preview && <section className="space-y-3 border-t border-white/15 pt-5" aria-label={t('申请记录预览', 'Application preview')}>
        <p className="text-sm text-white/60">{t('预览，不代表已经公开', 'Preview — this does not publish the record')}</p>
        <h3 className="t-title-3">{editor.details.university} · {editor.details.programme}</h3>
        <p className="text-white/70">{editor.intakeYear} · {editor.details.intakeLabel} · {editor.details.roundName} · {eventLabels[editor.details.eventType]}</p>
        <p className="text-sm text-white/70">{editor.details.studyType === 'taught' ? t('授课型', 'Taught') : t('研究型', 'Research')} · {editor.details.studyMode}</p>
        <p className="text-sm text-white/70">{t('申请人群体', 'Applicant group')}: {editor.details.applicantGroup}</p>
        <p className="text-sm text-white/70">{openingLabels[editor.details.openingState]}{editor.details.opensOn ? ` · ${editor.details.opensOn}` : ''}</p>
        <p className="whitespace-pre-wrap text-sm text-white/60">{editor.details.openingNote}</p>
        <p className="font-medium">{deadlineLabels[editor.details.deadlineStatus]}{editor.details.deadlineOn ? ` · ${editor.details.deadlineOn}` : ''}</p>
        {editor.details.deadlineAt ? <p className="text-sm text-white/70">{editor.details.deadlineAt} · {editor.details.deadlineTimeZone}</p> : <p className="text-sm text-white/60">{t('未公布具体截止时刻', 'Exact deadline time not announced')}{editor.details.deadlineTimeZone ? ` · ${editor.details.deadlineTimeZone}` : ''}</p>}
        <p className="whitespace-pre-wrap text-sm text-white/70">{editor.details.deadlineText}</p>
        {editor.details.rolling && <p className="text-sm text-amber-200">{t('滚动审理', 'Rolling admissions')}</p>}
        {editor.details.mayCloseEarly && <p className="text-sm text-amber-200">{t('可能提前关闭，请尽早提交', 'May close early; apply as soon as possible')}</p>}
        <p className="text-sm text-white/60">{t('最后核验', 'Last verified')}: {editor.verifiedOn ?? t('尚未核验', 'Not yet verified')}</p>
        <p className="whitespace-pre-wrap text-sm text-white/70">{editor.details.sourceNote}</p>
        {editor.details.officialUrl.startsWith('https://') && <a href={editor.details.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-violet-300 underline">{t('核对官方来源', 'Check official source')}</a>}
      </section>}
    </form>}
  </div>;
}
