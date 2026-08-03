'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ReportDialog from './ReportDialog';

/**
 * 投稿详情页的举报入口按钮。
 *
 * 只在读者投稿（/blog/p/[id]）显示——站主自己的文件文章有问题直接 GitHub PR,
 * 不走举报流程。
 *
 * 按钮放在文章头部元信息那一行（与「编辑」链接同一行）。
 */
export default function PostReportButton({ postId }: { postId: string }) {
  const t = useTranslations('BlogPostPage');
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-white/40 underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-red-300 hover:decoration-red-300/40"
      >
        {t('report')}
      </button>
      {open && (
        <ReportDialog
          targetType="post"
          targetId={postId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
