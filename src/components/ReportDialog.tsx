'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from './AuthProvider';

type TargetType = 'comment' | 'post';
type Reason = 'spam' | 'abuse' | 'nsfw' | 'illegal' | 'other';

interface ReportDialogProps {
  targetType: TargetType;
  targetId: string;
  /** 关闭对话框的回调 */
  onClose: () => void;
  /** 提交成功后的回调（可选） */
  onSubmitted?: () => void;
}

/**
 * UGC 举报对话框。评论与投稿共用。
 *
 * 登录校验在提交时做(不在打开时做):让未登录用户也能看到举报选项的存在,
 * 点提交时再跳转登录——和点赞/收藏的体验保持一致。
 */
export default function ReportDialog({
  targetType,
  targetId,
  onClose,
  onSubmitted,
}: ReportDialogProps) {
  const t = useTranslations('Report');
  const { user } = useAuth();
  const [reason, setReason] = useState<Reason>('spam');
  const [detail, setDetail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const reasons: { value: Reason; labelKey: string }[] = [
    { value: 'spam', labelKey: 'reasonSpam' },
    { value: 'abuse', labelKey: 'reasonAbuse' },
    { value: 'nsfw', labelKey: 'reasonNsfw' },
    { value: 'illegal', labelKey: 'reasonIllegal' },
    { value: 'other', labelKey: 'reasonOther' },
  ];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    if (!user) {
      window.location.href = '/login';
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType,
          targetId,
          reason,
          detail: detail.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('submitFailed'));

      setDone(true);
      onSubmitted?.();
      // 1.5s 后自动关闭
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('submitFailed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* 背景遮罩 */}
      <button
        type="button"
        aria-label={t('close')}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />

      {/* 对话框主体 */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0d0d10] p-6 shadow-2xl">
        {done ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="text-[0.9375rem] text-white/80">{t('submitted')}</p>
            <p className="t-footnote mt-1 text-white/50">{t('submittedHint')}</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-start justify-between">
              <h2 id="report-dialog-title" className="t-title-3 text-white">
                {targetType === 'comment' ? t('titleComment') : t('titlePost')}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('close')}
                className="-mr-2 -mt-1 rounded-md p-1 text-white/40 transition-colors hover:bg-white/5 hover:text-white/80"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="t-footnote mb-5 text-white/55">{t('hint')}</p>

            <form onSubmit={submit}>
              <fieldset className="mb-4 space-y-2">
                <legend className="t-footnote mb-2 text-white/60">{t('reasonLabel')}</legend>
                {reasons.map((r) => (
                  <label
                    key={r.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                      reason === r.value
                        ? 'border-violet-500/50 bg-violet-500/10 text-white'
                        : 'border-white/[0.07] text-white/70 hover:bg-white/[0.03]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={() => setReason(r.value)}
                      className="sr-only"
                    />
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                        reason === r.value
                          ? 'border-violet-400 bg-violet-400'
                          : 'border-white/30'
                      }`}
                      aria-hidden="true"
                    >
                      {reason === r.value && (
                        <span className="h-1.5 w-1.5 rounded-full bg-black" />
                      )}
                    </span>
                    {t(r.labelKey)}
                  </label>
                ))}
              </fieldset>

              <label className="t-footnote mb-2 block text-white/60" htmlFor="report-detail">
                {t('detailLabel')}
              </label>
              <textarea
                id="report-detail"
                value={detail}
                onChange={(e) => { setDetail(e.target.value); setError(''); }}
                maxLength={500}
                rows={3}
                placeholder={t('detailPlaceholder')}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-[0.9375rem] text-white placeholder-white/40 transition-colors focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
              />
              <div className="mt-1 text-right">
                <span className="t-footnote text-white/30">{detail.length}/500</span>
              </div>

              {error && (
                <p className="mt-3 text-xs text-red-400" role="alert">
                  {error}
                </p>
              )}

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white/60 transition-colors hover:bg-white/5 disabled:opacity-40"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.985] disabled:opacity-40"
                >
                  {submitting ? t('submitting') : t('submit')}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
