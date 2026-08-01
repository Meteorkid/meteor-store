'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface Comment {
  id: string;
  targetId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  parentId: string | null;
  status: string;
  reviewedAt: string | null;
  createdAt: string;
}

type FilterStatus = '' | 'pending' | 'approved' | 'rejected';
type Feedback = { type: 'success' | 'error'; message: string } | null;

const statusClass: Record<string, string> = {
  approved: 'bg-emerald-500/15 text-emerald-300',
  pending: 'bg-amber-500/15 text-amber-300',
  rejected: 'bg-red-500/15 text-red-300',
};

const statusKey: Record<string, string> = {
  approved: 'statusApproved',
  pending: 'statusPending',
  rejected: 'statusRejected',
};

function Avatar({ name, url }: { name: string; url: string | null }) {
  const initial = name[0]?.toUpperCase() ?? '?';
  return url ? (
    <img src={url} alt="" className="h-8 w-8 rounded-full object-cover shrink-0" />
  ) : (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
      {initial}
    </span>
  );
}

export default function CommentModeration() {
  const t = useTranslations('AdminCommentsPage');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [fetchError, setFetchError] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const params = filter ? `?status=${filter}` : '';
      const res = await fetch(`/api/admin/comments${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setComments(data.comments ?? []);
    } catch {
      setFetchError(true);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  function showFeedback(type: 'success' | 'error', message: string) {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  }

  async function handleApprove(commentId: string) {
    setBusyId(commentId);
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, action: 'approve' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('operationFailed'));
      showFeedback('success', t('commentApproved'));
      fetchComments();
    } catch (err) {
      showFeedback('error', err instanceof Error ? err.message : t('operationFailed'));
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(commentId: string) {
    setBusyId(commentId);
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, action: 'reject' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('operationFailed'));
      showFeedback('success', t('commentRejected'));
      fetchComments();
    } catch (err) {
      showFeedback('error', err instanceof Error ? err.message : t('operationFailed'));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(commentId: string) {
    setBusyId(commentId);
    try {
      const res = await fetch(`/api/admin/comments?id=${commentId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('operationFailed'));
      showFeedback('success', t('commentDeleted'));
      setDeleteConfirmId(null);
      fetchComments();
    } catch (err) {
      showFeedback('error', err instanceof Error ? err.message : t('operationFailed'));
    } finally {
      setBusyId(null);
    }
  }

  const tabs: { value: FilterStatus; labelKey: string }[] = [
    { value: '', labelKey: 'all' },
    { value: 'pending', labelKey: 'pending' },
    { value: 'approved', labelKey: 'approved' },
    { value: 'rejected', labelKey: 'rejected' },
  ];

  return (
    <div>
      {/* Feedback toast */}
      {feedback && (
        <div
          role="alert"
          className={`mb-6 rounded-xl px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 text-emerald-300'
              : 'bg-red-500/15 text-red-300'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2" role="tablist">
        {tabs.map((tab) => {
          const active = filter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(tab.value)}
              className={`rounded-lg px-4 py-2 text-sm transition-all ${
                active
                  ? 'bg-violet-600/20 text-violet-300 ring-1 ring-violet-600/40'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="mb-3 h-4 w-1/3 rounded bg-white/10" />
              <div className="mb-2 h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-2/3 rounded bg-white/10" />
            </div>
          ))}
        </div>
      ) : fetchError ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="t-body text-red-300">{t('operationFailed')}</p>
          <button
            type="button"
            onClick={fetchComments}
            className="mt-4 rounded-lg bg-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/20"
          >
            Retry
          </button>
        </div>
      ) : comments.length === 0 ? (
        <p className="t-body py-16 text-center text-white/60">{t('empty')}</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2.5">
                <Avatar name={comment.authorName} url={comment.authorAvatar} />
                <span className="text-sm font-medium text-white/80">{comment.authorName}</span>
                <span aria-hidden className="text-white/20">·</span>
                <time className="t-footnote tabular-nums text-white/60" dateTime={comment.createdAt}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </time>
                <span
                  className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass[comment.status] ?? 'bg-white/10 text-white/60'}`}
                >
                  {t(statusKey[comment.status] ?? 'statusApproved')}
                </span>
              </div>

              <p className="mb-4 text-[0.9375rem] leading-relaxed text-white/80">{comment.content}</p>

              <div className="flex flex-wrap gap-3 border-t border-white/[0.07] pt-4">
                {comment.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleApprove(comment.id)}
                      disabled={busyId === comment.id}
                      className="rounded-xl bg-emerald-400 px-4 py-2 text-[0.9375rem] font-semibold text-black transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.985] disabled:opacity-40"
                    >
                      {t('approve')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(comment.id)}
                      disabled={busyId === comment.id}
                      className="rounded-xl border border-red-400/30 px-4 py-2 text-[0.9375rem] font-semibold text-red-300 transition-colors duration-200 hover:bg-red-500/10 disabled:opacity-40"
                    >
                      {t('reject')}
                    </button>
                  </>
                )}
                {deleteConfirmId === comment.id ? (
                  <div className="flex items-center gap-3">
                    <span className="t-footnote text-red-300">{t('deleteConfirm')}</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(comment.id)}
                      disabled={busyId === comment.id}
                      className="rounded-xl bg-red-500 px-4 py-2 text-[0.9375rem] font-semibold text-white transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.985] disabled:opacity-40"
                    >
                      {t('delete')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      disabled={busyId === comment.id}
                      className="rounded-xl border border-white/10 px-4 py-2 text-[0.9375rem] font-semibold text-white/60 transition-colors duration-200 hover:bg-white/5 disabled:opacity-40"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(comment.id)}
                    disabled={busyId === comment.id}
                    className="rounded-xl border border-white/10 px-4 py-2 text-[0.9375rem] font-semibold text-white/40 transition-colors duration-200 hover:border-red-400/30 hover:text-red-300 disabled:opacity-40"
                  >
                    {t('delete')}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}