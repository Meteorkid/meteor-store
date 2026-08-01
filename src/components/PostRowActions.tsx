'use client';

import { useState } from 'react';
import { useRouter, Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import type { PostStatus } from '@/lib/posts';

interface PostRowActionsProps {
  postId: string;
  status: PostStatus;
}

/**
 * 我的投稿列表里每条文章的操作按钮。
 *
 * - draft / rejected / published：显示「编辑」链接，跳到 /blog/submit?id=xxx 复用表单
 * - pending：显示「撤回」按钮（变回 draft 才能编辑）
 * - 所有状态：显示「删除」按钮
 *
 * 撤回和删除用 window.confirm 做二次确认——个人博客场景够用，
 * 不引入 Modal 组件增加复杂度。操作成功后 router.refresh() 让 server
 * component 重拉列表。
 */
export default function PostRowActions({ postId, status }: PostRowActionsProps) {
  const router = useRouter();
  const t = useTranslations('BlogMyPostsPage');
  const [busy, setBusy] = useState<'idle' | 'withdraw' | 'delete'>('idle');
  const [error, setError] = useState('');

  const canEdit = status !== 'pending';
  const canWithdraw = status === 'pending';

  async function withdraw() {
    if (!window.confirm(t('withdrawConfirm'))) return;
    setBusy('withdraw');
    setError('');
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'withdraw' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('actionFailed'));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('actionFailed'));
    } finally {
      setBusy('idle');
    }
  }

  async function remove() {
    if (!window.confirm(t('deleteConfirm'))) return;
    setBusy('delete');
    setError('');
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('actionFailed'));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('actionFailed'));
    } finally {
      setBusy('idle');
    }
  }

  return (
    <div className="t-footnote mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
      {canEdit && (
        <Link
          href={{ pathname: '/blog/submit', query: { id: postId } }}
          className="text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
        >
          {t('editLink')}
        </Link>
      )}
      {canWithdraw && (
        <button
          type="button"
          onClick={withdraw}
          disabled={busy !== 'idle'}
          className="text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white disabled:opacity-40"
        >
          {busy === 'withdraw' ? t('withdrawing') : t('withdrawLink')}
        </button>
      )}
      <button
        type="button"
        onClick={remove}
        disabled={busy !== 'idle'}
        className="text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white disabled:opacity-40"
      >
        {busy === 'delete' ? t('deleting') : t('deleteLink')}
      </button>
      {error && <span className="text-red-400">{error}</span>}
    </div>
  );
}
