'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useAuth } from './AuthProvider';

interface PostStatsProps {
  targetId: string; // The post slug (for file posts) or post id (for database posts)
  initialViewCount?: number;
  initialLikeCount?: number;
  initialCommentCount?: number;
  initialLiked?: boolean;
}

export default function PostStats({
  targetId,
  initialViewCount = 0,
  initialLikeCount = 0,
  initialCommentCount = 0,
  initialLiked = false,
}: PostStatsProps) {
  const locale = useLocale();
  const { user } = useAuth();

  const [viewCount, setViewCount] = useState(initialViewCount);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(initialLiked);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [likeAnimating, setLikeAnimating] = useState(false);

  // On mount, record a view and fetch fresh stats
  useEffect(() => {
    // Record view (fire-and-forget)
    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetId }),
    }).catch(() => {
      /* 不影响阅读体验 */
    });

    // Fetch fresh stats
    const fetchStats = async () => {
      try {
        const [viewsRes, likesRes, commentsRes] = await Promise.all([
          fetch(`/api/views?targetId=${encodeURIComponent(targetId)}`),
          fetch(`/api/likes?targetId=${encodeURIComponent(targetId)}`),
          fetch(`/api/comments?targetId=${encodeURIComponent(targetId)}`),
        ]);

        if (viewsRes.ok) {
          const viewsData = await viewsRes.json();
          setViewCount(viewsData.count);
        }

        if (likesRes.ok) {
          const likesData = await likesRes.json();
          setLikeCount(likesData.count);
          setLiked(likesData.liked);
        }

        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          setCommentCount(commentsData.comments?.length ?? 0);
        }
      } catch {
        /* 统计加载失败不影响阅读 */
      }
    };

    fetchStats();
  }, [targetId]);

  const handleLike = useCallback(async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    // Optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));
    setLikeAnimating(true);

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId }),
      });

      if (!res.ok) {
        // Revert on error
        setLiked(wasLiked);
        setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
        return;
      }

      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.count);
    } catch {
      // Revert on network error
      setLiked(wasLiked);
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
    } finally {
      // Keep animation visible for a moment
      setTimeout(() => setLikeAnimating(false), 300);
    }
  }, [user, targetId, liked]);

  const fmt = (n: number) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'zh-CN').format(n);

  return (
    <div className="flex items-center gap-6">
      {/* Views */}
      <div
        className="flex items-center gap-1.5 text-sm text-white/50"
        aria-label={`${fmt(viewCount)} views`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span>{fmt(viewCount)}</span>
      </div>

      {/* Likes */}
      <button
        type="button"
        onClick={handleLike}
        className={`flex items-center gap-1.5 text-sm transition-colors ${
          liked ? 'text-red-400' : 'text-white/50'
        } hover:text-red-400 cursor-pointer`}
        aria-label={liked ? 'Unlike' : 'Like'}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          className={likeAnimating ? 'scale-125' : ''}
          style={{
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span>{fmt(likeCount)}</span>
      </button>

      {/* Comments */}
      <div
        className="flex items-center gap-1.5 text-sm text-white/50"
        aria-label={`${fmt(commentCount)} comments`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>{fmt(commentCount)}</span>
      </div>
    </div>
  );
}