'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { runCancellableTask } from '@/lib/cancellable-task';
import { useAuth } from './AuthProvider';
import ReportDialog from './ReportDialog';

interface Comment {
  id: string;
  targetId: string;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  parentId: string | null;
  createdAt: string;
}

function timeAgo(
  iso: string,
  t: ReturnType<typeof useTranslations>,
  locale: string
): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return t('justNow');
  if (m < 60) return t('minutesAgo', { m });
  const h = Math.floor(m / 60);
  if (h < 24) return t('hoursAgo', { h });
  const d = Math.floor(h / 24);
  if (d < 30) return t('daysAgo', { d });
  return new Date(iso).toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-CN');
}

function Avatar({ name, url }: { name: string; url: string | null }) {
  const initial = name[0]?.toUpperCase() ?? '?';
  return url ? (
    <Image
      src={url}
      alt=""
      width={32}
      height={32}
      unoptimized
      className="h-8 w-8 shrink-0 rounded-full object-cover"
    />
  ) : (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
      {initial}
    </span>
  );
}

function CommentItem({
  comment,
  onReply,
  onReport,
  depth = 0,
  children,
}: {
  comment: Comment;
  onReply: (parentId: string, name: string) => void;
  onReport: (commentId: string) => void;
  depth?: number;
  children?: React.ReactNode;
}) {
  const t = useTranslations('Comment');
  const locale = useLocale();
  return (
    <div className={depth > 0 ? 'ml-10 border-l border-white/[0.06] pl-4' : ''}>
      <div className="flex gap-3 py-3">
        <Avatar name={comment.authorName} url={comment.authorAvatar} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-white/90">{comment.authorName}</span>
            <span className="t-footnote text-white/40">{timeAgo(comment.createdAt, t, locale)}</span>
          </div>
          <p className="mt-1 text-[0.9375rem] leading-relaxed text-white/70 whitespace-pre-wrap break-words">
            {comment.content}
          </p>
          <div className="mt-1.5 flex items-center gap-3">
            {depth === 0 && (
              <button
                type="button"
                onClick={() => onReply(comment.id, comment.authorName)}
                className="text-xs text-white/40 transition-colors hover:text-white/70"
              >
                {t('reply')}
              </button>
            )}
            <button
              type="button"
              onClick={() => onReport(comment.id)}
              className="text-xs text-white/30 transition-colors hover:text-red-400"
            >
              {t('report')}
            </button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function CommentSection({ targetId }: { targetId: string }) {
  const t = useTranslations('Comment');
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reportTarget, setReportTarget] = useState<string | null>(null);

  // targetId 变化时回到 loading：渲染期调整状态
  const [prevTargetId, setPrevTargetId] = useState(targetId);
  if (targetId !== prevTargetId) {
    setPrevTargetId(targetId);
    setLoading(true);
  }

  // 拉取评论：内联 fetch + .then()，setState 都在异步回调里
  useEffect(() => {
    return runCancellableTask(
      fetch(`/api/comments?targetId=${encodeURIComponent(targetId)}`).then((res) => res.json()),
      {
        onSuccess: (data) => setComments(data.comments ?? []),
        onError: () => {
          /* 评论加载失败不影响阅读 */
        },
        onSettled: () => setLoading(false),
      },
    );
  }, [targetId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId,
          content: content.trim(),
          parentId: replyTo?.id ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('sendFailed'));

      setComments((prev) => [...prev, data.comment]);
      setContent('');
      setReplyTo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('sendFailed'));
    } finally {
      setSubmitting(false);
    }
  }

  const topLevel = comments.filter((c) => !c.parentId);
  const replies = comments.filter((c) => c.parentId);
  const getReplies = (parentId: string) =>
    replies.filter((r) => r.parentId === parentId);

  return (
    <section className="mt-16 border-t border-white/[0.07] pt-10">
      <h2 className="t-title-3 mb-6 text-white/90">
        {t('title')}{comments.length > 0 && <span className="ml-2 text-white/40 font-normal">({comments.length})</span>}
      </h2>

      {/* 评论列表 */}
      {loading ? (
        <div className="py-8 text-center text-sm text-white/40">{t('loading')}</div>
      ) : topLevel.length === 0 ? (
        <div className="py-8 text-center text-sm text-white/40">
          {t('empty')}
        </div>
      ) : (
        <div className="divide-y divide-white/[0.05]">
          {topLevel.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              onReply={(id, name) => setReplyTo({ id, name })}
              onReport={(commentId) => setReportTarget(commentId)}
            >
              {getReplies(c.id).map((r) => (
                <CommentItem
                  key={r.id}
                  comment={r}
                  onReply={() => {}}
                  onReport={(commentId) => setReportTarget(commentId)}
                  depth={1}
                />
              ))}
            </CommentItem>
          ))}
        </div>
      )}

      {/* 发表评论 */}
      <div className="glass-card mt-8 rounded-2xl p-5">
        {user ? (
          <form onSubmit={submit}>
            {replyTo && (
              <div className="mb-2 flex items-center gap-2 text-sm text-white/50">
                <span>{t('replyTo', { name: replyTo.name })}</span>
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="text-white/30 transition-colors hover:text-white/60"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex gap-3">
              <Avatar name={user.name || user.email} url={user.avatarUrl ?? null} />
              <div className="min-w-0 flex-1">
                <textarea
                  value={content}
                  onChange={(e) => { setContent(e.target.value); setError(''); }}
                  maxLength={500}
                  rows={3}
                  placeholder={replyTo ? t('placeholderReply', { name: replyTo.name }) : t('placeholder')}
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-[0.9375rem] text-white placeholder-white/40 transition-colors focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="t-footnote text-white/30">{content.length}/500</span>
                  <div className="flex items-center gap-3">
                    {error && <span className="text-xs text-red-400">{error}</span>}
                    <button
                      type="submit"
                      disabled={!content.trim() || submitting}
                      className="rounded-lg bg-white px-4 py-1.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {submitting ? t('sending') : t('send')}
                    </button>
                  </div>
                </div>
                {/* UGC 条款提示:提交评论即视为同意 EULA 第 8 节 */}
                <p className="t-footnote mt-2 text-white/30">
                  {t.rich('ugcConsent', {
                    eula: (chunks) => (
                      <Link href="/eula" className="text-white/50 underline decoration-white/15 underline-offset-4 transition-colors hover:text-white/80">
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </div>
            </div>
          </form>
        ) : (
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-6 py-5 text-center">
            <p className="text-sm text-white/50">
              <Link href="/login" className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white">
                {t('login')}
              </Link>
              {' '}{t('loginSuffix')}
            </p>
          </div>
        )}
      </div>

      {/* 举报对话框:用户点评论旁的举报按钮时打开 */}
      {reportTarget && (
        <ReportDialog
          targetType="comment"
          targetId={reportTarget}
          onClose={() => setReportTarget(null)}
        />
      )}
    </section>
  );
}
