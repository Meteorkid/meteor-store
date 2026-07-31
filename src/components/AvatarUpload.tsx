'use client';

import { useCallback, useRef, useState } from 'react';

const SIZE = 256;
const QUALITY = 0.85;
const MAX_INPUT_BYTES = 5 * 1024 * 1024;
const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

function resizeToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_INPUT_BYTES) {
      reject(new Error('图片不要超过 5MB'));
      return;
    }
    const img = new Image();
    img.onload = () => {
      const s = Math.min(img.width, img.height);
      const sx = (img.width - s) / 2;
      const sy = (img.height - s) / 2;

      const canvas = document.createElement('canvas');
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, sx, sy, s, s, 0, 0, SIZE, SIZE);
      resolve(canvas.toDataURL('image/jpeg', QUALITY));
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      reject(new Error('无法读取此图片'));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
}

interface AvatarUploadProps {
  currentUrl?: string | null;
  fallbackInitial: string;
  /** 收到新头像时回调。
   *  R2 已启用：回调拿到的是 R2 URL（已上传完毕）。
   *  R2 未启用：回调拿到 data URL（沿用旧逻辑直接写库）。 */
  onUpload: (value: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export default function AvatarUpload({
  currentUrl,
  fallbackInitial,
  onUpload,
  onRemove,
  disabled,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const displayUrl = preview || currentUrl;

  const processFile = useCallback(
    async (file: File) => {
      setError('');
      setUploading(true);
      try {
        const dataUrl = await resizeToDataUrl(file);
        // 先把本地缩放图作为预览，让用户立刻看到
        setPreview(dataUrl);

        // 试上传到 R2：成功就拿到 URL，失败则按 data URL 降级
        // （profile 接口会根据 R2 是否配置决定接受 URL 还是 data URL）
        let value = dataUrl;
        try {
          const res = await fetch('/api/avatar/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl }),
          });
          if (res.ok) {
            const data = await res.json();
            if (typeof data?.url === 'string') {
              value = data.url;
              // 上传成功后预览切到 R2 URL，避免 base64 占内存
              setPreview(data.url);
            }
          }
          // 503 表示 R2 未配置，继续用 data URL；其他错误让上层保存时报错
        } catch {
          // 网络错误：保留 data URL 预览，等保存时再失败
        }

        onUpload(value);
      } catch (err) {
        setError(err instanceof Error ? err.message : '处理图片失败');
      } finally {
        setUploading(false);
      }
    },
    [onUpload],
  );

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) processFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onRemove();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`group relative h-24 w-24 shrink-0 overflow-hidden rounded-full transition-all ${
          dragging
            ? 'ring-2 ring-violet-400 ring-offset-2 ring-offset-black'
            : 'hover:ring-2 hover:ring-white/20 hover:ring-offset-2 hover:ring-offset-black'
        } ${disabled || uploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="头像"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-violet-600 text-3xl font-bold text-white">
            {fallbackInitial}
          </span>
        )}
        {uploading ? (
          <span className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
          </span>
        ) : (
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
              />
            </svg>
          </span>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={handleFile}
        className="hidden"
        aria-label="上传头像"
      />

      <div className="flex items-center gap-3 text-[13px]">
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          className="text-white/60 transition-colors hover:text-white"
        >
          {uploading ? '上传中…' : displayUrl ? '更换头像' : '上传头像'}
        </button>
        {displayUrl && (
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={handleRemove}
            className="text-white/40 transition-colors hover:text-red-400"
          >
            移除
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
