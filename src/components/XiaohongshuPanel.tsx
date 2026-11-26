'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAdminEditorFocus } from '@/components/admin/useAdminEditorFocus';
import { formatAdminTimestamp } from '@/lib/admin-date';
import {
  countChars,
  normalizeXhsTags,
  validateXhsNote,
  XHS_BODY_LIMIT,
  XHS_IMAGE_LIMIT,
  XHS_IMAGE_RECOMMENDED_MAX,
  XHS_IMAGE_RECOMMENDED_MIN,
  XHS_TAG_LIMIT,
  XHS_TITLE_LIMIT,
  type XhsValidationIssue,
} from '@/lib/xiaohongshu/limits';
import type {
  XiaohongshuGenerateSource,
  XiaohongshuNote,
  XiaohongshuNoteInput,
  XiaohongshuSourceKind,
  XiaohongshuStatus,
} from '@/lib/xiaohongshu/types';
import type { WechatDailyQueueItem, WechatDraftHistoryItem } from '@/lib/wechat-mp/types';

interface PostOption {
  id: string;
  title: string;
  status: string | null;
  source: 'file' | 'database';
}

interface XiaohongshuPanelProps {
  today: string;
  dailyQueue: WechatDailyQueueItem[];
  dailyQueueError: boolean;
  draftHistory: WechatDraftHistoryItem[];
  initialNotes: XiaohongshuNote[];
  notesError: boolean;
}

const inputClass = 'w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-violet-500/50';
const labelClass = 'mb-1 block text-sm text-white/70';
const primaryButton = 'min-h-11 rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition-colors enabled:hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300';
const secondaryButton = 'min-h-11 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white transition-colors enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300';
const mutedButton = 'min-h-11 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition-colors enabled:hover:bg-white/8 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-40';
const XHS_CREATOR_PUBLISH_URL = 'https://creator.xiaohongshu.com/publish/publish?source=official&target=image';

function parseTags(value: string): string[] {
  return value.split(/[,，#\n]+/).map((item) => item.trim()).filter(Boolean);
}

function statusLabel(status: XiaohongshuStatus, en: boolean): string {
  if (status === 'ready') return en ? 'Ready' : '待发';
  if (status === 'published') return en ? 'Published' : '已发布';
  return en ? 'Draft' : '草稿';
}

function statusClass(status: XiaohongshuStatus): string {
  if (status === 'published') return 'border-emerald-300/20 bg-emerald-500/10 text-emerald-200';
  if (status === 'ready') return 'border-amber-300/20 bg-amber-500/10 text-amber-200';
  return 'border-white/15 bg-white/5 text-white/60';
}

function sourceLabel(kind: XiaohongshuSourceKind, en: boolean): string {
  if (kind === 'daily') return en ? 'Daily Fresh' : '每日一新';
  if (kind === 'post') return en ? 'Site post' : '站内文章';
  return en ? 'Manual' : '手动';
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
): number {
  const chars = Array.from(text);
  let line = '';
  let currentY = y;
  let lineIndex = 0;
  for (const char of chars) {
    const next = line + char;
    if (ctx.measureText(next).width > maxWidth && line) {
      if (lineIndex >= maxLines) {
        ctx.fillText(`${line.slice(0, Math.max(1, line.length - 1))}…`, x, currentY);
        return currentY + lineHeight;
      }
      ctx.fillText(line, x, currentY);
      line = char;
      currentY += lineHeight;
      lineIndex += 1;
    } else {
      line = next;
    }
  }
  if (line && lineIndex < maxLines) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  title: string,
  body: string,
  tags: string[],
  date: string,
) {
  const width = 1080;
  const height = 1440;
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#101022');
  gradient.addColorStop(0.5, '#271337');
  gradient.addColorStop(1, '#09090f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(196, 181, 253, 0.08)';
  ctx.lineWidth = 1;
  for (let x = -height; x < width + height; x += 54) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + height, height);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(168, 85, 247, 0.14)';
  ctx.beginPath();
  ctx.arc(980, 160, 300, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.beginPath();
  ctx.arc(90, 1300, 260, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.font = '600 24px "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
  ctx.fillText('METEOR STORE · 每日一新', 82, 110);
  ctx.fillStyle = 'rgba(196, 181, 253, 0.9)';
  ctx.fillRect(82, 132, 86, 3);

  ctx.fillStyle = '#ffffff';
  const titleSize = Array.from(title).length > 34 ? 64 : 78;
  ctx.font = `700 ${titleSize}px "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`;
  const titleBottom = wrapCanvasText(ctx, title || '今天，记录一点新东西', 82, 250, 916, Math.round(titleSize * 1.22), 4);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(82, titleBottom + 22);
  ctx.lineTo(998, titleBottom + 22);
  ctx.stroke();

  const teaser = body.trim().split(/\n{2,}/)[0]?.replace(/\n/g, ' ') ?? '';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
  ctx.font = '400 28px "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
  wrapCanvasText(ctx, teaser || '把今天的一点收获，整理成可以保存的笔记。', 82, titleBottom + 92, 900, 46, 6);

  ctx.fillStyle = 'rgba(216, 180, 254, 0.9)';
  ctx.font = '500 25px "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
  const tagLine = tags.slice(0, 4).map((tag) => `#${tag}`).join('  ');
  ctx.fillText(tagLine || '#每日一新  #独立开发', 82, 1002);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
  ctx.font = '400 22px "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
  ctx.fillText(`${date} · 3:4 图文笔记`, 82, 1056);

  const bottom = ctx.createLinearGradient(0, 1170, 0, height);
  bottom.addColorStop(0, 'rgba(0, 0, 0, 0)');
  bottom.addColorStop(1, 'rgba(0, 0, 0, 0.68)');
  ctx.fillStyle = bottom;
  ctx.fillRect(0, 1170, width, height - 1170);
}

export default function XiaohongshuPanel({
  today,
  dailyQueue,
  dailyQueueError,
  draftHistory,
  initialNotes,
  notesError,
}: XiaohongshuPanelProps) {
  const en = useLocale() === 'en';
  const t = (zh: string, english: string) => (en ? english : zh);
  const [notes, setNotes] = useState<XiaohongshuNote[]>(initialNotes);
  const [sourceKind, setSourceKind] = useState<XiaohongshuSourceKind>('daily');
  const [date, setDate] = useState(today);
  const [postId, setPostId] = useState('');
  const [postOptions, setPostOptions] = useState<PostOption[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsFailed, setPostsFailed] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [sourceUrl, setSourceUrl] = useState('');
  const [status, setStatus] = useState<XiaohongshuStatus>('draft');
  const [publishedUrl, setPublishedUrl] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [busy, setBusy] = useState<'generate' | 'save' | 'delete' | 'image' | 'cover' | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const { editorRef, listRef } = useAdminEditorFocus<HTMLDivElement>(editorOpen, noteId ?? 'new');

  const tags = useMemo(() => normalizeXhsTags(parseTags(tagsText)), [tagsText]);
  const issues = validateXhsNote({ title, body, tags, images, status });
  const titleCount = countChars(title);
  const bodyCount = countChars(body);
  const publishedUrlValid = /^https:\/\/\S+$/i.test(publishedUrl.trim());

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/posts', { cache: 'no-store', signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('failed')))
        .then((data: { posts?: PostOption[] }) => {
          const published = (data.posts ?? []).filter((post) => post.source === 'database' && post.status === 'published');
          setPostOptions(published);
          setPostId((current) => current || published[0]?.id || '');
        }))
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setPostsFailed(true);
      })
      .finally(() => setPostsLoading(false));
    return () => controller.abort();
  }, []);

  function noteForDaily(day: string): XiaohongshuNote | undefined {
    return notes.find((note) => note.sourceKind === 'daily' && note.sourceRef === day);
  }

  function wechatForDaily(day: string): WechatDraftHistoryItem | undefined {
    return draftHistory.find((item) => item.sourceKey === `daily:${day}`);
  }

  function resetFields() {
    setNoteId(null);
    setUpdatedAt(null);
    setTitle('');
    setBody('');
    setTagsText('');
    setImages([]);
    setSourceUrl('');
    setStatus('draft');
    setPublishedUrl('');
    setSourceKind('manual');
    setError('');
    setNotice('');
  }

  function openNote(note: XiaohongshuNote) {
    if (!confirmReplace()) return;
    setNoteId(note.id);
    setUpdatedAt(note.updatedAt);
    setTitle(note.title);
    setBody(note.body);
    setTagsText(note.tags.join(' '));
    setImages(note.images);
    setSourceKind(note.sourceKind);
    if (note.sourceKind === 'daily' && note.sourceRef) setDate(note.sourceRef);
    if (note.sourceKind === 'post' && note.sourceRef) setPostId(note.sourceRef);
    setSourceUrl(note.sourceUrl ?? '');
    setStatus(note.status);
    setPublishedUrl(note.publishedUrl ?? '');
    setError('');
    setNotice('');
    setEditorOpen(true);
  }

  function newBlank() {
    if (!confirmReplace()) return;
    resetFields();
    setSourceKind('manual');
    setEditorOpen(true);
  }

  function confirmReplace(): boolean {
    if (!editorOpen) return true;
    if (!title.trim() && !body.trim() && images.length === 0) return true;
    return window.confirm(t(
      '当前编辑内容尚未保存，确定要替换吗？',
      'The current draft has unsaved content. Replace it?',
    ));
  }

  function currentSource(): XiaohongshuGenerateSource {
    if (sourceKind === 'daily') return { kind: 'daily', date };
    if (sourceKind === 'post') return { kind: 'post', postId };
    return { kind: 'manual' };
  }

  async function generate(sourceOverride?: XiaohongshuGenerateSource) {
    if (busy !== null) return;
    if (!confirmReplace()) return;
    const source = sourceOverride ?? currentSource();
    if (source.kind === 'daily' && !date) {
      setError(t('请选择日期', 'Choose a date'));
      return;
    }
    if (source.kind === 'post' && !postId) {
      setError(t('请选择一篇文章', 'Choose a post'));
      return;
    }
    if (source.kind === 'manual') {
      resetFields();
      setSourceKind('manual');
      setEditorOpen(true);
      return;
    }

    setBusy('generate');
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/xiaohongshu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', source }),
      });
      const data = await response.json().catch(() => ({})) as {
        draft?: XiaohongshuNoteInput;
        issues?: XhsValidationIssue[];
        errorCode?: string;
      };
      if (!response.ok || !data.draft) {
        setError(errorText(data.errorCode ?? 'generate_failed'));
        return;
      }
      setNoteId(null);
      setUpdatedAt(null);
      setTitle(data.draft.title);
      setBody(data.draft.body);
      setTagsText(data.draft.tags.join(' '));
      setImages(data.draft.images);
      setSourceKind(data.draft.sourceKind);
      setSourceUrl(data.draft.sourceUrl ?? '');
      setStatus('draft');
      setPublishedUrl('');
      if (source.kind === 'daily') setDate(source.date);
      if (source.kind === 'post') setPostId(source.postId);
      setEditorOpen(true);
      setNotice(t('已生成草稿，可以继续修改', 'Draft generated. Keep editing.'));
    } catch {
      setError(errorText('action_failed'));
    } finally {
      setBusy(null);
    }
  }

  async function saveNote(nextStatus: XiaohongshuStatus) {
    if (busy !== null) return;
    const nextIssues = validateXhsNote({ title, body, tags, images, status: nextStatus });
    if (nextIssues.some((issue) => issue.level === 'error')) {
      setError(t('请先修正红色错误，再保存或标记状态', 'Fix the red errors before saving or changing status'));
      return;
    }
    if (!title.trim() && !body.trim()) {
      setError(t('标题和正文不能都为空', 'Title and body cannot both be empty'));
      return;
    }
    if (nextStatus === 'published' && publishedUrl.trim() && !/^https:\/\/\S+$/i.test(publishedUrl.trim())) {
      setError(t('发布链接必须以 https:// 开头', 'The published link must start with https://'));
      return;
    }
    if (nextStatus === 'published' && !window.confirm(t(
      '确认已经在小红书 App 手动发布了吗？这里只记录状态和链接，不会自动发布。',
      'Have you published manually in the RedNote app? This only records status and the link; it will not publish.',
    ))) return;

    setBusy('save');
    setError('');
    setNotice('');
    try {
      const sourceRef = sourceKind === 'daily' ? date : sourceKind === 'post' ? postId : null;
      const response = await fetch('/api/admin/xiaohongshu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          ...(noteId ? { id: noteId, expectedUpdatedAt: updatedAt } : {}),
          note: {
            title: title.trim(),
            body,
            tags,
            images,
            sourceKind,
            sourceRef,
            sourceUrl: sourceUrl.trim() || null,
            status: nextStatus,
            publishedUrl: nextStatus === 'published' ? (publishedUrl.trim() || null) : null,
          },
        }),
      });
      const data = await response.json().catch(() => ({})) as {
        note?: XiaohongshuNote;
        issues?: XhsValidationIssue[];
        errorCode?: string;
      };
      if (!response.ok || !data.note) {
        setError(errorText(data.errorCode ?? 'action_failed'));
        return;
      }
      const saved = data.note;
      setNoteId(saved.id);
      setUpdatedAt(saved.updatedAt);
      setStatus(saved.status);
      setPublishedUrl(saved.publishedUrl ?? '');
      setNotes((current) => [saved, ...current.filter((item) => item.id !== saved.id)]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
      setNotice(nextStatus === 'published'
        ? t('已记录为已发布。别忘了这是手动标记。', 'Marked as published. Remember this is a manual record.')
        : t('已保存', 'Saved'));
    } catch {
      setError(errorText('action_failed'));
    } finally {
      setBusy(null);
    }
  }

  async function deleteNote() {
    if (!noteId || busy !== null) return;
    if (!window.confirm(t('确定删除这篇笔记草稿吗？', 'Delete this note draft?'))) return;
    setBusy('delete');
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/xiaohongshu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: noteId, expectedUpdatedAt: updatedAt }),
      });
      const data = await response.json().catch(() => ({})) as { errorCode?: string };
      if (!response.ok) {
        setError(errorText(data.errorCode ?? 'action_failed'));
        return;
      }
      setNotes((current) => current.filter((item) => item.id !== noteId));
      resetFields();
      setEditorOpen(false);
      setNotice(t('已删除', 'Deleted'));
    } catch {
      setError(errorText('action_failed'));
    } finally {
      setBusy(null);
    }
  }

  async function copyText(text: string, label: string, overrideNotice?: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    setNotice(overrideNotice ?? t(`${label}已复制`, `${label} copied`));
  }

  function copyAll() {
    const text = [title, body, tags.map((tag) => `#${tag}`).join(' ')].filter(Boolean).join('\n\n');
    void copyText(text, t('全部文案', 'Full copy'));
  }

  function buildPublishKit(): string {
    return [
      `标题：${title.trim()}`,
      '',
      '正文：',
      body.trim(),
      '',
      '标签：',
      tags.map((tag) => `#${tag}`).join(' '),
      '',
      '图片顺序（第一张为封面）：',
      ...images.map((url, index) => `${index + 1}. ${url}`),
      '',
      `发布页：${XHS_CREATOR_PUBLISH_URL}`,
      '',
      '说明：图片需要在发布页手动上传；发布完成后回到工作台记录笔记链接。',
    ].join('\n');
  }

  function copyPublishKit() {
    void copyText(buildPublishKit(), t('发布包', 'Publish kit'));
  }

  function exportPublishKit() {
    const filename = `${(title || 'xiaohongshu-note').replace(/[\\/:*?"<>|]/g, '').slice(0, 30) || 'xiaohongshu-note'}-发布包.txt`;
    downloadBlob(new Blob([buildPublishKit()], { type: 'text/plain;charset=utf-8' }), filename);
    setNotice(t('已下载发布包', 'Publish kit downloaded'));
  }

  function openPublishPage() {
    if (!title.trim() || !body.trim()) {
      setError(t('发布前需要标题和正文', 'A title and body are required before publishing'));
      return;
    }
    if (images.length === 0) {
      setError(t('发布前至少需要 1 张图片', 'At least one image is required before publishing'));
      return;
    }
    if (issues.some((issue) => issue.level === 'error')) {
      setError(t('请先修正红色错误，再打开发布页', 'Fix the red errors before opening the publish page'));
      return;
    }

    // 先在点击事件里同步开窗，避免 await 剪贴板后被浏览器拦截。
    window.open(XHS_CREATOR_PUBLISH_URL, '_blank', 'noopener,noreferrer');
    void copyText(
      buildPublishKit(),
      t('发布包', 'Publish kit'),
      t(
        '已打开发布页并复制发布包。上传图片后手动发布，再回来记录链接。',
        'Publish page opened and kit copied. Upload images, publish manually, then record the link here.',
      ),
    );
  }

  function exportMarkdown() {
    const filename = `${(title || 'xiaohongshu-note').replace(/[\\/:*?"<>|]/g, '').slice(0, 30) || 'xiaohongshu-note'}.md`;
    const content = [
      `# ${title || '未命名笔记'}`,
      '',
      body,
      '',
      tags.map((tag) => `#${tag}`).join(' '),
      '',
      images.map((url, index) => `${index === 0 ? '封面' : '配图'}：${url}`).join('\n'),
    ].join('\n');
    downloadBlob(new Blob([content], { type: 'text/markdown;charset=utf-8' }), filename);
    setNotice(t('已导出 Markdown', 'Markdown exported'));
  }

  async function uploadOne(file: File): Promise<string> {
    const form = new FormData();
    form.append('file', file);
    const response = await fetch('/api/blog/upload-image', { method: 'POST', body: form });
    const data = await response.json().catch(() => ({})) as { url?: string; error?: string };
    if (!response.ok || !data.url) throw new Error(data.error ?? 'upload_failed');
    return data.url;
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0 || busy !== null) return;
    setBusy('image');
    setError('');
    setNotice('');
    try {
      const urls: string[] = [];
      for (const file of files) {
        if (images.length + urls.length >= XHS_IMAGE_LIMIT) break;
        if (file.size > 5_000_000) {
          setError(t('单张图片不能超过 5MB', 'Each image must be under 5 MB'));
          continue;
        }
        if (!['image/webp', 'image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          setError(t('仅支持 WebP / JPEG / PNG / GIF', 'Only WebP / JPEG / PNG / GIF are supported'));
          continue;
        }
        urls.push(await uploadOne(file));
      }
      if (urls.length > 0) {
        setImages((current) => [...new Set([...current, ...urls])].slice(0, XHS_IMAGE_LIMIT));
        setNotice(t(`已上传 ${urls.length} 张图片`, `${urls.length} image(s) uploaded`));
      }
    } catch (err) {
      setError(err instanceof Error && err.message !== 'upload_failed'
        ? err.message
        : errorText('upload_failed'));
    } finally {
      setBusy(null);
    }
  }

  function addImageUrl() {
    const value = imageUrlInput.trim();
    if (!value) return;
    if (!value.startsWith('https://') && !value.startsWith('/')) {
      setError(t('图片地址必须是 https:// 或站内 / 路径', 'Use an https:// or site-relative / image URL'));
      return;
    }
    if (images.length >= XHS_IMAGE_LIMIT) {
      setError(t(`最多 ${XHS_IMAGE_LIMIT} 张图片`, `Up to ${XHS_IMAGE_LIMIT} images`));
      return;
    }
    if (!images.includes(value)) setImages((current) => [...current, value]);
    setImageUrlInput('');
    setError('');
  }

  function removeImage(index: number) {
    setImages((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function makeCover(index: number) {
    setImages((current) => {
      const selected = current[index];
      if (!selected || index === 0) return current;
      return [selected, ...current.filter((_, itemIndex) => itemIndex !== index)];
    });
  }

  async function generateCover() {
    if (busy !== null) return;
    if (!title.trim()) {
      setError(t('先写标题，再生成封面', 'Write a title before generating a cover'));
      return;
    }
    setBusy('cover');
    setError('');
    setNotice('');
    let blob: Blob | null = null;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1440;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas_unavailable');
      await document.fonts.ready;
      drawCover(ctx, title, body, tags, date || today);
      blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('canvas_unavailable');
      try {
        const file = new File([blob], `xiaohongshu-cover-${Date.now()}.png`, { type: 'image/png' });
        const url = await uploadOne(file);
        setImages((current) => [url, ...current.filter((item) => item !== url)].slice(0, XHS_IMAGE_LIMIT));
        setNotice(t('封面已生成并放到首图', 'Cover generated and placed first'));
      } catch (uploadError) {
        downloadBlob(blob, `xiaohongshu-cover-${Date.now()}.png`);
        setNotice(t('封面上传失败，已下载到本地；可稍后手动上传', 'Cover upload failed. Downloaded it locally; upload later.'));
        console.error('xiaohongshu cover upload failed:', uploadError);
      }
    } catch {
      setError(t('封面生成失败，请换浏览器重试', 'Cover generation failed. Try another browser.'));
    } finally {
      setBusy(null);
    }
  }

  function errorText(code: string): string {
    const map: Record<string, string> = {
      not_found: t('登录状态或管理权限已失效，请重新登录', 'Your admin session expired. Sign in again.'),
      rate_limited: t('操作过于频繁，请稍后重试', 'Too many requests. Try again shortly.'),
      invalid: t('参数格式不正确', 'Invalid parameters'),
      invalid_note: t('笔记内容超过平台限制，请先修正红色错误', 'The note exceeds platform limits. Fix the red errors.'),
      invalid_image: t('图片地址不合法', 'Invalid image URL'),
      invalid_published_url: t('发布链接必须以 https:// 开头', 'The published link must start with https://'),
      schema_missing: t('数据库表还未迁移，请先执行 pnpm db:migrate', 'The database table is missing. Run pnpm db:migrate first.'),
      conflict: t('这篇笔记已在别处更新，请刷新后再编辑', 'This note changed elsewhere. Refresh before editing.'),
      daily_empty: t('该日期没有已发布的日刊内容', 'No published Daily Fresh content for that date'),
      post_not_found: t('文章不存在或已删除', 'Post not found or deleted'),
      post_not_published: t('只能从已发布文章生成', 'Only published posts can be used'),
      upload_failed: t('图片上传失败，请确认 R2 已配置', 'Image upload failed. Check R2 configuration.'),
      action_failed: t('操作失败，请稍后重试；当前内容仍在表单里', 'The action failed. Retry; your content is still in the form.'),
    };
    return map[code] ?? map.action_failed;
  }

  return (
    <div className="space-y-6">
      {notesError && (
        <div role="alert" className="rounded-xl border border-amber-300/20 bg-amber-500/[0.06] p-4 text-sm leading-relaxed text-amber-100">
          <p className="font-medium">{t('小红书笔记表尚未就绪', 'RedNote note table is not ready')}</p>
          <p className="mt-1 text-amber-100/80">{t('先在服务器执行 pnpm db:migrate，再刷新本页。', 'Run pnpm db:migrate on the server, then refresh this page.')}</p>
        </div>
      )}

      <section className="space-y-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="t-title-3 text-white">{t('近 7 天内容台', 'Last 7 days')}</h2>
            <p className="t-footnote mt-1 text-white/60">
              {t('同一张表里看公众号草稿和小红书笔记；点日期直接生成。', 'See WeChat drafts and RedNote notes together; click a date to generate.')}
            </p>
          </div>
          <span className="rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
            {t('只整理，不自动发布', 'Organize only; no auto-publish')}
          </span>
        </div>
        {dailyQueueError ? (
          <p role="alert" className="t-footnote text-amber-200/80">{t('日刊状态读取失败，请刷新重试。', 'Could not load Daily Fresh status. Refresh and try again.')}</p>
        ) : dailyQueue.length === 0 ? (
          <p className="t-footnote text-white/50">{t('最近 7 天没有日刊记录。', 'No Daily Fresh records in the last 7 days.')}</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-7">
            {dailyQueue.map((item) => {
              const note = noteForDaily(item.date);
              const wechat = wechatForDaily(item.date);
              const isToday = item.date === today;
              return (
                <div key={item.date} className={`min-w-0 rounded-xl border p-3 ${isToday ? 'border-violet-300/30 bg-violet-500/[0.06]' : 'border-white/[0.06] bg-black/10'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white">{isToday ? t('今天', 'Today') : item.date.slice(5)}</span>
                    <span className="t-footnote text-white/50">{item.count ? t(`${item.count} 个栏目`, `${item.count} channels`) : t('无内容', 'Empty')}</span>
                  </div>
                  <p className="mt-1 truncate text-[11px] text-white/50" title={item.channels.join('、')}>
                    {item.channels.join('、') || t('还没有发布', 'Nothing published')}
                  </p>
                  <div className="mt-3 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white/45">{t('公众号', 'WeChat')}</span>
                      {wechat ? (
                        <Link href="/admin/wechat-draft" className="shrink-0 text-violet-200 underline underline-offset-2">
                          {t('草稿已建', 'Draft ready')}
                        </Link>
                      ) : (
                        <span className="text-white/35">{t('未建', 'None')}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white/45">{t('小红书', 'RedNote')}</span>
                      {note ? (
                        <span className={`shrink-0 rounded-full border px-2 py-0.5 ${statusClass(note.status)}`}>
                          {statusLabel(note.status, en)}
                        </span>
                      ) : (
                        <span className="text-white/35">{t('未建', 'None')}</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-3 min-h-10 w-full rounded-lg border border-white/15 px-2 py-2 text-xs font-medium text-white transition-colors enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={busy !== null || (!note && item.count === 0)}
                    onClick={() => {
                      if (note) openNote(note);
                      else void generate({ kind: 'daily', date: item.date });
                    }}
                  >
                    {note ? t('编辑笔记', 'Edit note') : item.count ? t('生成小红书', 'Create note') : t('无日刊', 'No edition')}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {!editorOpen && (
        <section className="rounded-xl border border-dashed border-white/15 bg-white/[0.015] p-6 text-center">
          <p className="text-sm text-white/70">{t('从上面的日刊卡片生成，或从下方笔记列表打开。', 'Generate from a Daily Fresh card above, or open a note from the list below.')}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <button type="button" className={primaryButton} onClick={() => newBlank()}>
              {t('新建空白笔记', 'New blank note')}
            </button>
            {dailyQueue.find((item) => item.date === today && item.count > 0) && (
              <button type="button" className={secondaryButton} onClick={() => void generate({ kind: 'daily', date: today })}>
                {t('生成今日日刊笔记', 'Create today’s Daily Fresh note')}
              </button>
            )}
          </div>
        </section>
      )}

      {editorOpen && (
        <form
          ref={editorRef}
          tabIndex={-1}
          onSubmit={(event) => { event.preventDefault(); void saveNote(status); }}
          className="space-y-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 outline-none"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="t-title-3 text-white">{noteId ? t('编辑笔记', 'Edit note') : t('新建笔记', 'New note')}</h2>
              <p className="t-footnote mt-1 text-white/50">
                {updatedAt ? t(`上次保存 ${formatAdminTimestamp(updatedAt, en ? 'en' : 'zh')}`, `Last saved ${formatAdminTimestamp(updatedAt, en ? 'en' : 'zh')}`) : t('尚未保存', 'Not saved yet')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full border px-3 py-1 text-xs ${statusClass(status)}`}>{statusLabel(status, en)}</span>
              {noteId && <button type="button" className={mutedButton} disabled={busy !== null} onClick={() => void deleteNote()}>{t('删除', 'Delete')}</button>}
            </div>
          </div>

          {(error || notice) && (
            <div role={error ? 'alert' : 'status'} className={`rounded-xl border p-3 text-sm leading-relaxed ${error ? 'border-red-300/20 bg-red-500/[0.06] text-red-100' : 'border-emerald-300/20 bg-emerald-500/[0.06] text-emerald-100'}`}>
              {error || notice}
            </div>
          )}

          <section className="space-y-3 rounded-xl border border-white/[0.06] bg-black/10 p-4">
            <div>
              <span className={labelClass}>{t('内容来源', 'Content source')}</span>
              <div className="flex flex-wrap gap-2">
                {(['daily', 'post', 'manual'] as const).map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => { setSourceKind(kind); if (kind === 'manual' && !noteId) resetFields(); }}
                    className={`min-h-10 rounded-lg border px-3 py-2 text-sm transition-colors ${sourceKind === kind ? 'border-violet-400/60 bg-violet-500/15 text-white' : 'border-white/10 text-white/60 hover:bg-white/5 hover:text-white'}`}
                  >
                    {sourceLabel(kind, en)}
                  </button>
                ))}
              </div>
            </div>
            {sourceKind === 'daily' && (
              <div className="flex flex-wrap items-end gap-3">
                <label className="min-w-[180px] flex-1">
                  <span className={labelClass}>{t('日刊日期（北京时间）', 'Daily date (Beijing time)')}</span>
                  <input type="date" max={today} value={date} onChange={(event) => setDate(event.target.value)} className={inputClass} />
                </label>
                <button type="button" className={secondaryButton} disabled={busy !== null} onClick={() => void generate({ kind: 'daily', date })}>
                  {busy === 'generate' ? t('生成中…', 'Generating…') : t('从日刊生成', 'Generate from edition')}
                </button>
              </div>
            )}
            {sourceKind === 'post' && (
              <div className="flex flex-wrap items-end gap-3">
                <label className="min-w-[220px] flex-1">
                  <span className={labelClass}>{t('已发布文章', 'Published post')}</span>
                  <select value={postId} onChange={(event) => setPostId(event.target.value)} className={inputClass}>
                    <option value="">{postsLoading ? t('正在读取…', 'Loading…') : postOptions.length === 0 ? t('没有可选文章', 'No posts') : t('选择一篇', 'Choose one')}</option>
                    {postOptions.map((post) => <option key={post.id} value={post.id}>{post.title}</option>)}
                  </select>
                  {postsFailed && <p className="mt-1 text-xs text-amber-300">{t('文章列表读取失败，仍可手动编辑。', 'Could not load posts; manual editing still works.')}</p>}
                </label>
                <button type="button" className={secondaryButton} disabled={busy !== null || !postId} onClick={() => void generate({ kind: 'post', postId })}>
                  {busy === 'generate' ? t('生成中…', 'Generating…') : t('从文章生成', 'Generate from post')}
                </button>
              </div>
            )}
            {sourceKind === 'manual' && (
              <p className="text-sm leading-relaxed text-white/55">
                {t('手动写一篇，或先把上面的日刊/文章转成草稿再改。', 'Write from scratch, or turn an edition/post above into a draft first.')}
              </p>
            )}
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="xhs-title" className={labelClass}>{t('标题', 'Title')}</label>
                  <span className={`t-footnote ${titleCount > XHS_TITLE_LIMIT ? 'text-red-300' : 'text-white/45'}`}>{titleCount}/{XHS_TITLE_LIMIT}</span>
                </div>
                <input id="xhs-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t('20 字以内，关键词放前面', 'Up to 20 characters; put the keyword first')} className={inputClass} />
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="xhs-body" className={labelClass}>{t('正文', 'Body')}</label>
                  <span className={`t-footnote ${bodyCount > XHS_BODY_LIMIT ? 'text-red-300' : 'text-white/45'}`}>{bodyCount}/{XHS_BODY_LIMIT}</span>
                </div>
                <textarea id="xhs-body" value={body} onChange={(event) => setBody(event.target.value)} rows={12} placeholder={t('建议 600–800 字；第一段先说结果，后面再展开。', '600–800 characters is comfortable; lead with the result.')} className={`${inputClass} resize-y leading-relaxed`} />
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="xhs-tags" className={labelClass}>{t('标签', 'Tags')}</label>
                  <span className="t-footnote text-white/45">{tags.length}/{XHS_TAG_LIMIT}</span>
                </div>
                <input id="xhs-tags" value={tagsText} onChange={(event) => setTagsText(event.target.value)} placeholder={t('用空格或逗号分隔，例如 每日一新 AI工具 独立开发', 'Separate with spaces or commas')} className={inputClass} />
                <p className="t-footnote mt-1 text-white/45">{t('保存时会自动去重、去掉开头的 #。', 'Duplicates and leading # are cleaned on save.')}</p>
              </div>

              <div>
                <label htmlFor="xhs-source-url" className={labelClass}>{t('原文链接（只作记录）', 'Source link (record only)')}</label>
                <input id="xhs-source-url" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="https://…" className={inputClass} />
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <span className={labelClass}>{t('图片', 'Images')}</span>
                    <p className="t-footnote text-white/45">{t(`第一张即封面；建议 ${XHS_IMAGE_RECOMMENDED_MIN}–${XHS_IMAGE_RECOMMENDED_MAX} 张，最多 ${XHS_IMAGE_LIMIT} 张。`, `First image is the cover; ${XHS_IMAGE_RECOMMENDED_MIN}–${XHS_IMAGE_RECOMMENDED_MAX} recommended, up to ${XHS_IMAGE_LIMIT}.`)}</p>
                  </div>
                  <span className="t-footnote text-white/45">{images.length}/{XHS_IMAGE_LIMIT}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <input ref={fileInput} type="file" accept="image/webp,image/jpeg,image/png,image/gif" multiple hidden onChange={(event) => void handleImageUpload(event)} />
                  <button type="button" className={secondaryButton} disabled={busy !== null || images.length >= XHS_IMAGE_LIMIT} onClick={() => fileInput.current?.click()}>
                    {busy === 'image' ? t('上传中…', 'Uploading…') : t('上传图片', 'Upload images')}
                  </button>
                  <button type="button" className={secondaryButton} disabled={busy !== null || !title.trim()} onClick={() => void generateCover()}>
                    {busy === 'cover' ? t('生成中…', 'Generating…') : t('生成文字封面', 'Generate text cover')}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <input value={imageUrlInput} onChange={(event) => setImageUrlInput(event.target.value)} placeholder={t('粘贴 https:// 图片地址', 'Paste an https:// image URL')} className={`${inputClass} min-w-[220px] flex-1`} />
                  <button type="button" className={secondaryButton} disabled={busy !== null} onClick={addImageUrl}>{t('添加', 'Add')}</button>
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {images.map((url, index) => (
                      <div key={`${url}-${index}`} className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/20">
                        <div className="aspect-[3/4]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={index === 0 ? t('封面图', 'Cover') : t(`配图 ${index + 1}`, `Image ${index + 1}`)} className="h-full w-full object-cover" />
                        </div>
                        {index === 0 && <span className="absolute left-1 top-1 rounded bg-violet-600/90 px-1.5 py-0.5 text-[10px] text-white">{t('封面', 'Cover')}</span>}
                        <div className="flex flex-wrap gap-1 p-1.5">
                          {index !== 0 && <button type="button" className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-white/70 hover:text-white" onClick={() => makeCover(index)}>{t('设为首图', 'Make cover')}</button>}
                          <button type="button" className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-red-200" onClick={() => removeImage(index)}>{t('移除', 'Remove')}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-black/10 p-3">
                <h3 className="text-sm font-medium text-white/80">{t('发布前检查', 'Pre-publish checks')}</h3>
                {issues.length === 0 ? (
                  <p className="mt-2 text-sm text-emerald-200">{t('没有发现明显问题，复制后到 App 里再核对一次。', 'No obvious issues. Copy and double-check in the app.')}</p>
                ) : (
                  <ul className="mt-2 space-y-1.5">
                    {issues.map((issue, index) => (
                      <li key={`${issue.field}-${index}`} className={`text-xs leading-relaxed ${issue.level === 'error' ? 'text-red-200' : 'text-amber-200'}`}>
                        <span className="mr-1 font-medium">{issue.level === 'error' ? t('错误', 'Error') : t('提醒', 'Warning')}</span>
                        {issue.message}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-[11px] leading-relaxed text-white/35">{t('字数是按字符估算的；英文、数字和 emoji 的官方计数口径可能不同，发布前以 App 显示为准。', 'Counts are estimates; English, numbers and emoji may be counted differently in the app.')}</p>
              </div>

              <section className="rounded-xl border border-violet-300/15 bg-violet-500/[0.04] p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-medium text-white/85">{t('发布助手', 'Publish assistant')}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/50">
                      {t(
                        '个人号没有官方笔记发布 API。这里把标题、正文、标签和图片顺序复制到剪贴板，并打开官方创作服务平台；上传图片和点“发布”仍由你完成。',
                        'Personal accounts have no official note-publish API. This copies the title, body, tags and image order, then opens the official creator platform. You still upload images and click publish.',
                      )}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/50">
                    {t('半自动', 'Semi-automatic')}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className={primaryButton} disabled={busy !== null} onClick={openPublishPage}>
                    {t('复制文案并打开发布页', 'Copy kit & open publish page')}
                  </button>
                  <button type="button" className={secondaryButton} disabled={busy !== null} onClick={copyPublishKit}>
                    {t('只复制发布包', 'Copy kit only')}
                  </button>
                  <button type="button" className={mutedButton} disabled={busy !== null || (!title && !body)} onClick={exportPublishKit}>
                    {t('下载 .txt', 'Download .txt')}
                  </button>
                </div>
                <div className="mt-3">
                  <label htmlFor="xhs-published-url" className={labelClass}>{t('小红书笔记链接（发布后粘贴）', 'RedNote note link (paste after publishing)')}</label>
                  <input
                    id="xhs-published-url"
                    value={publishedUrl}
                    onChange={(event) => setPublishedUrl(event.target.value)}
                    placeholder="https://www.xiaohongshu.com/explore/…"
                    className={inputClass}
                  />
                  <p className="mt-1 text-[11px] leading-relaxed text-white/40">
                    {t('保存为“已发布”时写入；只作记录，不会抓取点赞或收藏。', 'Saved with “published” status; record only, no likes or saves are fetched.')}
                  </p>
                  {status === 'published' && publishedUrlValid && (
                    <a
                      href={publishedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex text-xs text-violet-200 underline underline-offset-2 hover:text-violet-100"
                    >
                      {t('打开发布后的笔记 ↗', 'Open published note ↗')}
                    </a>
                  )}
                </div>
              </section>

              <div className="flex flex-wrap gap-2">
                <button type="button" className={primaryButton} disabled={busy !== null} onClick={() => void saveNote('draft')}>
                  {busy === 'save' ? t('保存中…', 'Saving…') : t('保存草稿', 'Save draft')}
                </button>
                <button type="button" className={secondaryButton} disabled={busy !== null} onClick={() => void saveNote('ready')}>
                  {t('保存为待发', 'Save as ready')}
                </button>
                <button type="button" className={secondaryButton} disabled={busy !== null} onClick={() => void saveNote('published')}>
                  {t('标记已发布', 'Mark published')}
                </button>
                <button type="button" className={mutedButton} disabled={busy !== null || (!title && !body && images.length === 0)} onClick={copyAll}>{t('复制全部', 'Copy all')}</button>
                <button type="button" className={mutedButton} disabled={busy !== null} onClick={exportMarkdown}>{t('导出 Markdown', 'Export Markdown')}</button>
              </div>
            </div>

            <aside className="xl:sticky xl:top-24 xl:self-start">
              <div className="mx-auto w-full max-w-[320px] rounded-[30px] border border-white/10 bg-[#08080d] p-2 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
                <div className="relative overflow-hidden rounded-[22px] bg-[#12121a]">
                  <div className="aspect-[3/4]">
                    {images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={images[0]} alt={t('小红书封面预览', 'RedNote cover preview')} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full flex-col justify-between bg-[radial-gradient(circle_at_80%_12%,rgba(168,85,247,0.3),transparent_38%),linear-gradient(145deg,#101022,#09090f)] p-5">
                        <span className="text-[10px] font-semibold tracking-[0.2em] text-violet-200/70">METEOR STORE</span>
                        <div>
                          <p className="text-[28px] font-bold leading-[1.18] text-white">{title || t('今天，记录一点新东西', 'Something new today')}</p>
                          <p className="mt-3 line-clamp-4 text-sm leading-6 text-white/60">{body || t('正文预览会出现在这里。', 'Your body preview appears here.')}</p>
                        </div>
                        <span className="text-[10px] text-white/35">{date || today}</span>
                      </div>
                    )}
                  </div>
                  <div className="px-3 pb-4 pt-3">
                    <p className="line-clamp-2 text-[15px] font-semibold leading-snug text-white">{title || t('标题预览', 'Title preview')}</p>
                    <p className="mt-1 text-[11px] text-white/45">Meteor Store · {t('独立开发 / AI 工具', 'Indie dev / AI tools')}</p>
                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-white/60">{body || t('正文预览会出现在这里。', 'Your body preview appears here.')}</p>
                    {tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {tags.slice(0, 5).map((tag) => <span key={tag} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-violet-200">#{tag}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="mx-auto mt-3 max-w-[320px] text-center text-[11px] leading-relaxed text-white/35">
                {t('3:4 竖图预览，首图就是封面；底部约 15–20% 可能被标题遮住。', '3:4 preview; the first image is the cover. The bottom 15–20% may be covered by the title.')}
              </p>
            </aside>
          </div>
        </form>
      )}

      <div ref={listRef}>
        <section className="space-y-2">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="t-title-3 text-white">{t('最近笔记', 'Recent notes')}</h2>
              <p className="t-footnote mt-1 text-white/55">{t('草稿、待发、已发布都在这里；已发布只是手动记录。', 'Drafts, ready and published notes; “published” is a manual record.')}</p>
            </div>
            <button type="button" className={secondaryButton} onClick={() => newBlank()}>{t('新建', 'New')}</button>
          </div>
          {notes.length === 0 ? (
            <p className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 text-sm text-white/50">{t('还没有笔记，从上面的日刊或文章生成一篇。', 'No notes yet. Generate one from an edition or post above.')}</p>
          ) : (
            <div className="grid gap-2 md:grid-cols-2">
              {notes.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => openNote(note)}
                  className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-left transition-colors hover:border-violet-300/30 hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">{note.title || t('未命名笔记', 'Untitled note')}</span>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] ${statusClass(note.status)}`}>{statusLabel(note.status, en)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/55">{note.body || t('还没有正文', 'No body yet')}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/40">
                    <span>{sourceLabel(note.sourceKind, en)}{note.sourceRef ? ` · ${note.sourceRef}` : ''}</span>
                    <span>{formatAdminTimestamp(note.updatedAt, en ? 'en' : 'zh')}</span>
                    <span>{t(`${note.images.length} 张图`, `${note.images.length} images`)}</span>
                    {note.publishedUrl && <span className="text-emerald-200/75">{t('已记录链接', 'Link recorded')}</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
