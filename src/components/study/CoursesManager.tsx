'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Link } from '@/i18n/navigation';
import { buildLoginHref } from '@/lib/login-return';
import { summarizeCourses } from '@/lib/study/gpa';
import { formatStudyDeadline, isDateOnly, studyDatePart, studyDaysUntil, studyRelativeDays } from '@/lib/study/format';
import type { StudyCourse, StudyCourseStatus, StudyDeadline, StudyDeadlineKind } from '@/lib/study/types';
import { coursesText } from './courses-text';

type Failure = { kind: 'login' | 'changed' | 'failed' } | null;
type CoursesCopy = typeof coursesText['zh'] | typeof coursesText['en'];

const inputClass =
  'w-full min-h-11 rounded-lg border border-white/15 bg-white/[0.04] px-3 text-base text-white outline-none transition-colors focus:border-violet-400';
const primaryButton =
  'inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50';
const secondaryButton =
  'inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-3 text-sm text-white/80 transition-colors hover:bg-white/[0.06] disabled:opacity-50';
const dangerButton =
  'inline-flex min-h-11 items-center justify-center rounded-xl border border-rose-400/30 px-3 text-sm text-rose-200 transition-colors hover:bg-rose-500/[0.12] disabled:opacity-50';

interface CourseDraft {
  id: string | null;
  term: string;
  name: string;
  credits: string;
  score: string;
  status: StudyCourseStatus;
}

interface DeadlineDraft {
  id: string | null;
  title: string;
  kind: StudyDeadlineKind;
  courseId: string;
  date: string;
  time: string;
}

async function sendStudyRequest<T>(
  path: string,
  method: 'POST' | 'PATCH' | 'DELETE',
  ownerId: string,
  body: unknown,
): Promise<{ ok: true; data: T } | { ok: false; failure: Failure }> {
  try {
    const response = await fetch(path, {
      method,
      headers: { 'Content-Type': 'application/json', 'X-Study-User': ownerId },
      body: JSON.stringify(body),
    });
    if (response.status === 401) return { ok: false, failure: { kind: 'login' } };
    if (response.status === 409) return { ok: false, failure: { kind: 'changed' } };
    if (!response.ok) return { ok: false, failure: { kind: 'failed' } };
    return { ok: true, data: (await response.json()) as T };
  } catch {
    return { ok: false, failure: { kind: 'failed' } };
  }
}

/** ISO 时刻 → 北京时间的 HH:mm；纯日期返回空串（不推测时间）。 */
function beijingTimePart(value: string): string {
  if (isDateOnly(value)) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).format(parsed);
}

function isValidCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function FailureNotice({ failure, copy }: { failure: Failure; copy: CoursesCopy }) {
  if (!failure) return null;
  return (
    <p role="alert" className="mt-3 t-footnote text-amber-200">
      {failure.kind === 'login'
        ? <Link href={buildLoginHref('/study/courses')} className="inline-flex min-h-10 items-center underline underline-offset-4">{copy.login}</Link>
        : failure.kind === 'changed'
          ? <>{copy.sessionChanged} <button type="button" onClick={() => window.location.reload()} className="inline-flex min-h-10 items-center underline underline-offset-4">{copy.refresh}</button></>
          : copy.failed}
    </p>
  );
}

export default function CoursesManager({
  initialCourses,
  initialDeadlines,
  userId,
  locale,
  today,
  coursesFailed = false,
  deadlinesFailed = false,
}: {
  initialCourses: StudyCourse[];
  initialDeadlines: StudyDeadline[];
  userId: string;
  locale: 'zh' | 'en';
  /** 服务端计算的北京时间日期，用于相对天数展示，避免水合不一致。 */
  today: string;
  coursesFailed?: boolean;
  deadlinesFailed?: boolean;
}) {
  const copy = coursesText[locale];
  const formId = useId();
  const [courses, setCourses] = useState(initialCourses);
  const [deadlines, setDeadlines] = useState(initialDeadlines);
  const [courseDraft, setCourseDraft] = useState<CourseDraft | null>(null);
  const [deadlineDraft, setDeadlineDraft] = useState<DeadlineDraft | null>(null);
  const [courseFormError, setCourseFormError] = useState('');
  const [deadlineFormError, setDeadlineFormError] = useState('');
  const [courseFailure, setCourseFailure] = useState<Failure>(null);
  const [deadlineFailure, setDeadlineFailure] = useState<Failure>(null);
  const [courseBusy, setCourseBusy] = useState(false);
  const [deadlineBusy, setDeadlineBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const courseFormRef = useRef<HTMLFormElement | null>(null);
  const deadlineFormRef = useRef<HTMLFormElement | null>(null);
  const noticeTimer = useRef<number | null>(null);

  useEffect(() => {
    if (courseDraft) courseFormRef.current?.scrollIntoView({ block: 'nearest' });
  }, [courseDraft]);
  useEffect(() => {
    if (deadlineDraft) deadlineFormRef.current?.scrollIntoView({ block: 'nearest' });
  }, [deadlineDraft]);
  useEffect(() => () => {
    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
  }, []);

  const showNotice = (message: string) => {
    setNotice(message);
    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(''), 4000);
  };

  const summary = summarizeCourses(courses);

  const openCreateCourse = () => {
    setCourseFormError('');
    setCourseDraft({ id: null, term: '', name: '', credits: '', score: '', status: 'in-progress' });
  };
  const openEditCourse = (course: StudyCourse) => {
    setCourseFormError('');
    setCourseDraft({
      id: course.id, term: course.term, name: course.name,
      credits: String(course.credits), score: course.score === null ? '' : String(course.score),
      status: course.status,
    });
  };

  const submitCourse = async (event: FormEvent) => {
    event.preventDefault();
    if (!courseDraft || courseBusy) return;
    const term = courseDraft.term.trim();
    const name = courseDraft.name.trim();
    const credits = Number(courseDraft.credits);
    const scoreText = courseDraft.score.trim();
    const score = scoreText === '' ? null : Number(scoreText);
    if (!term) return setCourseFormError(copy.invalidTerm);
    if (!name) return setCourseFormError(copy.invalidName);
    if (!Number.isFinite(credits) || credits < 0.5 || credits > 20 || !Number.isInteger(credits * 2)) {
      return setCourseFormError(copy.invalidCredits);
    }
    if (score !== null && (!Number.isFinite(score) || score < 0 || score > 100)) {
      return setCourseFormError(copy.invalidScore);
    }
    setCourseFormError('');
    setCourseBusy(true);
    setCourseFailure(null);
    const payload = { term, name, credits, score, status: courseDraft.status };
    const result = courseDraft.id === null
      ? await sendStudyRequest<{ course: StudyCourse }>('/api/study/courses', 'POST', userId, payload)
      : await sendStudyRequest<{ course: StudyCourse }>('/api/study/courses', 'PATCH', userId, { id: courseDraft.id, ...payload });
    setCourseBusy(false);
    if (!result.ok) return setCourseFailure(result.failure);
    const saved = result.data.course;
    setCourses(current => courseDraft.id === null
      ? [...current, saved]
      : current.map(course => (course.id === saved.id ? saved : course)));
    setCourseDraft(null);
    showNotice(copy.savedCourse);
  };

  const deleteCourse = async (course: StudyCourse) => {
    if (courseBusy || !window.confirm(copy.courseDeleteConfirm)) return;
    setCourseBusy(true);
    setCourseFailure(null);
    const result = await sendStudyRequest<{ success: boolean }>('/api/study/courses', 'DELETE', userId, { id: course.id });
    setCourseBusy(false);
    if (!result.ok) return setCourseFailure(result.failure);
    setCourses(current => current.filter(item => item.id !== course.id));
    // 服务端删除课程时把关联截止事项的 courseId 置空，本地同步这一变化
    setDeadlines(current => current.map(item => (item.courseId === course.id ? { ...item, courseId: null } : item)));
    setCourseDraft(current => (current?.id === course.id ? null : current));
    showNotice(copy.deletedCourse);
  };

  const openCreateDeadline = () => {
    setDeadlineFormError('');
    setDeadlineDraft({ id: null, title: '', kind: 'assignment', courseId: '', date: '', time: '' });
  };
  const openEditDeadline = (deadline: StudyDeadline) => {
    setDeadlineFormError('');
    setDeadlineDraft({
      id: deadline.id, title: deadline.title, kind: deadline.kind,
      courseId: deadline.courseId ?? '',
      date: studyDatePart(deadline.dueAt),
      time: beijingTimePart(deadline.dueAt),
    });
  };

  const submitDeadline = async (event: FormEvent) => {
    event.preventDefault();
    if (!deadlineDraft || deadlineBusy) return;
    const title = deadlineDraft.title.trim();
    if (!title) return setDeadlineFormError(copy.invalidDeadlineTitle);
    if (!isValidCalendarDate(deadlineDraft.date)) return setDeadlineFormError(copy.invalidDeadlineDate);
    const time = deadlineDraft.time.trim();
    if (time !== '' && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return setDeadlineFormError(copy.invalidDeadlineTime);
    setDeadlineFormError('');
    setDeadlineBusy(true);
    setDeadlineFailure(null);
    const dueAt = time === '' ? deadlineDraft.date : `${deadlineDraft.date}T${time}:00+08:00`;
    const payload = { title, kind: deadlineDraft.kind, courseId: deadlineDraft.courseId || null, dueAt };
    const result = deadlineDraft.id === null
      ? await sendStudyRequest<{ deadline: StudyDeadline }>('/api/study/deadlines', 'POST', userId, payload)
      : await sendStudyRequest<{ deadline: StudyDeadline }>('/api/study/deadlines', 'PATCH', userId, { id: deadlineDraft.id, ...payload });
    setDeadlineBusy(false);
    if (!result.ok) return setDeadlineFailure(result.failure);
    const saved = result.data.deadline;
    setDeadlines(current => deadlineDraft.id === null
      ? [...current, saved]
      : current.map(deadline => (deadline.id === saved.id ? saved : deadline)));
    setDeadlineDraft(null);
    showNotice(copy.savedDeadline);
  };

  const toggleDeadline = async (deadline: StudyDeadline) => {
    if (deadlineBusy) return;
    setDeadlineBusy(true);
    setDeadlineFailure(null);
    const status = deadline.status === 'open' ? 'done' : 'open';
    const result = await sendStudyRequest<{ deadline: StudyDeadline }>('/api/study/deadlines', 'PATCH', userId, { id: deadline.id, status });
    setDeadlineBusy(false);
    if (!result.ok) return setDeadlineFailure(result.failure);
    const saved = result.data.deadline;
    setDeadlines(current => current.map(item => (item.id === saved.id ? saved : item)));
  };

  const deleteDeadline = async (deadline: StudyDeadline) => {
    if (deadlineBusy || !window.confirm(copy.deadlineDeleteConfirm)) return;
    setDeadlineBusy(true);
    setDeadlineFailure(null);
    const result = await sendStudyRequest<{ success: boolean }>('/api/study/deadlines', 'DELETE', userId, { id: deadline.id });
    setDeadlineBusy(false);
    if (!result.ok) return setDeadlineFailure(result.failure);
    setDeadlines(current => current.filter(item => item.id !== deadline.id));
    setDeadlineDraft(current => (current?.id === deadline.id ? null : current));
    showNotice(copy.deletedDeadline);
  };

  const kindLabels: Record<StudyDeadlineKind, string> = {
    assignment: copy.deadlineKindAssignment,
    exam: copy.deadlineKindExam,
    project: copy.deadlineKindProject,
    other: copy.deadlineKindOther,
  };

  const courseGroups = (() => {
    const groups = new Map<string, StudyCourse[]>();
    for (const course of courses) {
      const list = groups.get(course.term) ?? [];
      list.push(course);
      groups.set(course.term, list);
    }
    return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  })();

  const sortedDeadlines = [...deadlines].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'open' ? -1 : 1;
    const dateCompare = studyDatePart(a.dueAt).localeCompare(studyDatePart(b.dueAt));
    return dateCompare !== 0 ? dateCompare : a.dueAt.localeCompare(b.dueAt);
  });

  return (
    <div className="space-y-8">
      {notice && <p role="status" className="rounded-xl border border-emerald-400/25 bg-emerald-500/[0.08] px-4 py-3 t-footnote text-emerald-200">{notice}</p>}

      <section aria-labelledby="study-gpa" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <h2 id="study-gpa" className="t-title-3 text-white">{copy.gpaTitle}</h2>
        <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4">
          <div>
            <dt className="t-footnote text-white/60">{copy.gpaWeighted}</dt>
            <dd className="mt-2 t-title-2 tabular-nums text-white">{summary.weightedAverage ?? '—'}</dd>
          </div>
          <div>
            <dt className="t-footnote text-white/60">{copy.gpaValue}</dt>
            <dd className="mt-2 t-title-2 tabular-nums text-white">{summary.gpa ?? '—'}</dd>
          </div>
          <div>
            <dt className="t-footnote text-white/60">{copy.gpaCredits}</dt>
            <dd className="mt-2 t-title-3 tabular-nums text-white">{summary.scoredCredits} / {summary.totalCredits}</dd>
          </div>
          <div>
            <dt className="t-footnote text-white/60">{copy.gpaCourses}</dt>
            <dd className="mt-2 t-title-3 tabular-nums text-white">{summary.scoredCount} / {summary.totalCount}</dd>
          </div>
        </dl>
        <p className="mt-4 t-footnote text-white/60">{summary.weightedAverage === null ? copy.gpaNone : copy.gpaNote}</p>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="study-courses" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="study-courses" className="t-title-3 text-white">{copy.coursesTitle}</h2>
            {!coursesFailed && (
              <button type="button" onClick={openCreateCourse} disabled={courseBusy} className={secondaryButton}>
                {copy.courseCreate}
              </button>
            )}
          </div>

          {coursesFailed ? (
            <p role="status" className="mt-4 t-footnote text-amber-200">{copy.loadFailed} <button type="button" onClick={() => window.location.reload()} className="inline-flex min-h-10 items-center underline underline-offset-4">{copy.retry}</button></p>
          ) : (
            <>
              {courseDraft && (
                <form ref={courseFormRef} onSubmit={submitCourse} className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <h3 className="t-title-4 text-white">{courseDraft.id === null ? copy.courseCreate : copy.courseEdit}</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="block space-y-1.5 text-sm text-white/70" htmlFor={`${formId}-course-term`}>
                      <span>{copy.courseTerm}</span>
                      <input id={`${formId}-course-term`} className={inputClass} value={courseDraft.term} placeholder={copy.courseTermPlaceholder} maxLength={40}
                        onChange={event => setCourseDraft({ ...courseDraft, term: event.target.value })} />
                    </label>
                    <label className="block space-y-1.5 text-sm text-white/70" htmlFor={`${formId}-course-name`}>
                      <span>{copy.courseName}</span>
                      <input id={`${formId}-course-name`} className={inputClass} value={courseDraft.name} placeholder={copy.courseNamePlaceholder} maxLength={120}
                        onChange={event => setCourseDraft({ ...courseDraft, name: event.target.value })} />
                    </label>
                    <label className="block space-y-1.5 text-sm text-white/70" htmlFor={`${formId}-course-credits`}>
                      <span>{copy.courseCredits}</span>
                      <input id={`${formId}-course-credits`} className={inputClass} type="number" inputMode="decimal" step="0.5" min="0.5" max="20"
                        value={courseDraft.credits} onChange={event => setCourseDraft({ ...courseDraft, credits: event.target.value })} />
                    </label>
                    <label className="block space-y-1.5 text-sm text-white/70" htmlFor={`${formId}-course-score`}>
                      <span>{copy.courseScore}</span>
                      <input id={`${formId}-course-score`} className={inputClass} type="number" inputMode="decimal" step="any" min="0" max="100"
                        value={courseDraft.score} placeholder={copy.courseScorePlaceholder}
                        onChange={event => setCourseDraft({ ...courseDraft, score: event.target.value })} />
                    </label>
                    <label className="block space-y-1.5 text-sm text-white/70" htmlFor={`${formId}-course-status`}>
                      <span>{copy.courseStatus}</span>
                      <select id={`${formId}-course-status`} className={inputClass} value={courseDraft.status}
                        onChange={event => setCourseDraft({ ...courseDraft, status: event.target.value as StudyCourseStatus })}>
                        <option value="in-progress">{copy.courseStatusInProgress}</option>
                        <option value="completed">{copy.courseStatusCompleted}</option>
                      </select>
                    </label>
                  </div>
                  {courseFormError && <p role="alert" className="mt-3 t-footnote text-amber-200">{courseFormError}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="submit" disabled={courseBusy} className={primaryButton}>{courseBusy ? copy.saving : copy.courseSave}</button>
                    <button type="button" onClick={() => { setCourseDraft(null); setCourseFormError(''); }} disabled={courseBusy} className={secondaryButton}>{copy.cancel}</button>
                  </div>
                </form>
              )}

              <FailureNotice failure={courseFailure} copy={copy} />

              {courses.length === 0 ? (
                <p className="mt-4 t-footnote text-white/60">{copy.courseEmpty}</p>
              ) : (
                <div className="mt-4 space-y-5">
                  {courseGroups.map(([term, termCourses]) => (
                    <div key={term}>
                      <h3 className="t-eyebrow text-white/50">{term}</h3>
                      <ul className="mt-2 divide-y divide-white/10">
                        {termCourses.map(course => (
                          <li key={course.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                            <div className="min-w-0 flex-1">
                              <p className="t-title-4 text-white">{course.name}</p>
                              <p className="mt-1 flex flex-wrap gap-x-3 t-footnote text-white/60">
                                <span>{course.credits} {copy.creditsUnit}</span>
                                <span className={course.score === null ? 'text-white/45' : 'tabular-nums text-white/80'}>
                                  {course.score === null ? copy.courseNoScore : course.score}
                                </span>
                                <span className={course.status === 'completed' ? 'text-emerald-200/80' : 'text-violet-200/80'}>
                                  {course.status === 'completed' ? copy.courseStatusCompleted : copy.courseStatusInProgress}
                                </span>
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => openEditCourse(course)} disabled={courseBusy} className={secondaryButton}>{copy.edit}</button>
                              <button type="button" onClick={() => void deleteCourse(course)} disabled={courseBusy} className={dangerButton}>{copy.remove}</button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        <section aria-labelledby="study-deadlines" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="study-deadlines" className="t-title-3 text-white">{copy.deadlinesTitle}</h2>
            {!deadlinesFailed && (
              <button type="button" onClick={openCreateDeadline} disabled={deadlineBusy} className={secondaryButton}>
                {copy.deadlineCreate}
              </button>
            )}
          </div>

          {deadlinesFailed ? (
            <p role="status" className="mt-4 t-footnote text-amber-200">{copy.loadFailed} <button type="button" onClick={() => window.location.reload()} className="inline-flex min-h-10 items-center underline underline-offset-4">{copy.retry}</button></p>
          ) : (
            <>
              {deadlineDraft && (
                <form ref={deadlineFormRef} onSubmit={submitDeadline} className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <h3 className="t-title-4 text-white">{deadlineDraft.id === null ? copy.deadlineCreate : copy.deadlineEdit}</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="block space-y-1.5 text-sm text-white/70 sm:col-span-2" htmlFor={`${formId}-deadline-title`}>
                      <span>{copy.deadlineItem}</span>
                      <input id={`${formId}-deadline-title`} className={inputClass} value={deadlineDraft.title} placeholder={copy.deadlineItemPlaceholder} maxLength={160}
                        onChange={event => setDeadlineDraft({ ...deadlineDraft, title: event.target.value })} />
                    </label>
                    <label className="block space-y-1.5 text-sm text-white/70" htmlFor={`${formId}-deadline-kind`}>
                      <span>{copy.deadlineKind}</span>
                      <select id={`${formId}-deadline-kind`} className={inputClass} value={deadlineDraft.kind}
                        onChange={event => setDeadlineDraft({ ...deadlineDraft, kind: event.target.value as StudyDeadlineKind })}>
                        {(Object.keys(kindLabels) as StudyDeadlineKind[]).map(kind => <option key={kind} value={kind}>{kindLabels[kind]}</option>)}
                      </select>
                    </label>
                    <label className="block space-y-1.5 text-sm text-white/70" htmlFor={`${formId}-deadline-course`}>
                      <span>{copy.deadlineCourse}</span>
                      <select id={`${formId}-deadline-course`} className={inputClass} value={deadlineDraft.courseId}
                        onChange={event => setDeadlineDraft({ ...deadlineDraft, courseId: event.target.value })}>
                        <option value="">{copy.deadlineNoCourse}</option>
                        {courses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
                      </select>
                    </label>
                    <label className="block space-y-1.5 text-sm text-white/70" htmlFor={`${formId}-deadline-date`}>
                      <span>{copy.deadlineDate}</span>
                      <input id={`${formId}-deadline-date`} className={inputClass} type="date" value={deadlineDraft.date}
                        onChange={event => setDeadlineDraft({ ...deadlineDraft, date: event.target.value })} />
                    </label>
                    <label className="block space-y-1.5 text-sm text-white/70" htmlFor={`${formId}-deadline-time`}>
                      <span>{copy.deadlineTime}</span>
                      <input id={`${formId}-deadline-time`} className={inputClass} type="time" value={deadlineDraft.time}
                        onChange={event => setDeadlineDraft({ ...deadlineDraft, time: event.target.value })} />
                    </label>
                  </div>
                  {deadlineFormError && <p role="alert" className="mt-3 t-footnote text-amber-200">{deadlineFormError}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="submit" disabled={deadlineBusy} className={primaryButton}>{deadlineBusy ? copy.saving : copy.deadlineSave}</button>
                    <button type="button" onClick={() => { setDeadlineDraft(null); setDeadlineFormError(''); }} disabled={deadlineBusy} className={secondaryButton}>{copy.cancel}</button>
                  </div>
                </form>
              )}

              <FailureNotice failure={deadlineFailure} copy={copy} />

              {deadlines.length === 0 ? (
                <p className="mt-4 t-footnote text-white/60">{copy.deadlineEmpty}</p>
              ) : (
                <ul className="mt-4 divide-y divide-white/10">
                  {sortedDeadlines.map(deadline => {
                    const course = courses.find(item => item.id === deadline.courseId);
                    const days = studyDaysUntil(studyDatePart(deadline.dueAt), today);
                    return (
                      <li key={deadline.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                        <div className="min-w-0 flex-1">
                          <p className={`t-title-4 ${deadline.status === 'done' ? 'text-white/50 line-through' : 'text-white'}`}>{deadline.title}</p>
                          <p className="mt-1 flex flex-wrap gap-x-3 t-footnote text-white/60">
                            <span>{kindLabels[deadline.kind]}</span>
                            <span>{formatStudyDeadline(deadline.dueAt, locale)}</span>
                            {deadline.status === 'open' && days !== null && (
                              <span className={days < 0 ? 'text-amber-200' : days <= 3 ? 'text-violet-200' : ''}>
                                {studyRelativeDays(days, locale)}
                              </span>
                            )}
                            {course && <span>{course.name}</span>}
                            {deadline.status === 'done' && <span className="text-emerald-200/80">{copy.deadlineDone}</span>}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => void toggleDeadline(deadline)} disabled={deadlineBusy} className={secondaryButton}>
                            {deadline.status === 'open' ? copy.deadlineMarkDone : copy.deadlineMarkOpen}
                          </button>
                          <button type="button" onClick={() => openEditDeadline(deadline)} disabled={deadlineBusy} className={secondaryButton}>{copy.edit}</button>
                          <button type="button" onClick={() => void deleteDeadline(deadline)} disabled={deadlineBusy} className={dangerButton}>{copy.remove}</button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
