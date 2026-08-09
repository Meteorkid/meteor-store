'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from './AuthProvider';
import { runCancellableTask } from '@/lib/cancellable-task';

interface PostStatsProps {
  targetId: string; // The post slug (for file posts) or post id (for database posts)
  initialViewCount?: number;
  initialLikeCount?: number;
  initialCommentCount?: number;
  initialLiked?: boolean;
  initialFavoriteCount?: number;
  initialFavorited?: boolean;
}

export default function PostStats({
  targetId,
  initialViewCount = 0,
  initialLikeCount = 0,
  initialCommentCount = 0,
  initialLiked = false,
  initialFavoriteCount = 0,
  initialFavorited = false,
}: PostStatsProps) {
  const locale = useLocale();
  const t = useTranslations('PostStats');
  const { user } = useAuth();

  const [viewCount, setViewCount] = useState(initialViewCount);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(initialLiked);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(initialFavoriteCount);
  const [favorited, setFavorited] = useState(initialFavorited);
  const [favoriteAnimating, setFavoriteAnimating] = useState(false);

  // 挂载时一次请求：记录一次浏览并拿全 4 项计数 + 当前用户 liked/favorited 状态。
  // 合并 POST /api/views 与 GET /api/post-stats 为单次 POST，减少 1 次 RTT。
  useEffect(() => {
    return runCancellableTask(
      fetch('/api/post-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) =>
          data
            ? {
                viewCount: data.viewCount ?? 0,
                likeCount: data.likeCount ?? 0,
                liked: data.liked ?? false,
                commentCount: data.commentCount ?? 0,
                favoriteCount: data.favoriteCount ?? 0,
                favorited: data.favorited ?? false,
              }
            : null,
        ),
      {
        onSuccess: (stats) => {
          if (!stats) return;
          setViewCount(stats.viewCount);
          setLikeCount(stats.likeCount);
          setLiked(stats.liked);
          setCommentCount(stats.commentCount);
          setFavoriteCount(stats.favoriteCount);
          setFavorited(stats.favorited);
        },
        onError: () => {
          /* 统计加载失败不影响阅读 */
        },
        onSettled: () => {
          /* 无额外清理 */
        },
      },
    );
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

  const handleFavorite = useCallback(async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    // Optimistic update
    const wasFavorited = favorited;
    setFavorited(!wasFavorited);
    setFavoriteCount((prev) => (wasFavorited ? prev - 1 : prev + 1));
    setFavoriteAnimating(true);

    try {
      const res = await fetch('/api/blog/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId }),
      });

      if (!res.ok) {
        setFavorited(wasFavorited);
        setFavoriteCount((prev) => (wasFavorited ? prev + 1 : prev - 1));
        return;
      }

      const data = await res.json();
      setFavorited(data.favorited);
      setFavoriteCount(data.count);
    } catch {
      setFavorited(wasFavorited);
      setFavoriteCount((prev) => (wasFavorited ? prev + 1 : prev - 1));
    } finally {
      setTimeout(() => setFavoriteAnimating(false), 300);
    }
  }, [user, targetId, favorited]);

  const fmt = (n: number) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'zh-CN').format(n);

  return (
    <div className="flex items-center gap-6">
      {/* Views */}
      <div
        className="flex items-center gap-1.5 text-sm text-white/50"
        aria-label={`${fmt(viewCount)} ${t('views')}`}
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
        aria-label={liked ? t('unlike') : t('like')}
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

      {/* Favorites */}
      <button
        type="button"
        onClick={handleFavorite}
        className={`flex items-center gap-1.5 text-sm transition-colors ${
          favorited ? 'text-amber-300' : 'text-white/50'
        } hover:text-amber-300 cursor-pointer`}
        aria-label={favorited ? t('unfavorite') : t('favorite')}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={favorited ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          className={favoriteAnimating ? 'scale-125' : ''}
          style={{
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        <span>{fmt(favoriteCount)}</span>
      </button>

      {/* Comments */}
      <div
        className="flex items-center gap-1.5 text-sm text-white/50"
        aria-label={`${fmt(commentCount)} ${t('comments')}`}
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