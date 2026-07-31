'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import AvatarUpload from './AvatarUpload';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-[0.9375rem] text-white placeholder-white/50 transition-colors focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40 disabled:opacity-50';

const labelClass = 't-footnote mb-2 block font-medium text-white/65';

type Status = 'idle' | 'saving' | 'saved' | 'error';

interface AccountFormsProps {
  initialName: string;
  initialBio: string;
  initialAvatar: string | null;
  email: string;
}

export default function AccountForms({
  initialName,
  initialBio,
  initialAvatar,
  email,
}: AccountFormsProps) {
  const { refresh } = useAuth();

  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [avatar, setAvatar] = useState<string | null>(initialAvatar);
  const [avatarDirty, setAvatarDirty] = useState(false);
  const [profileStatus, setProfileStatus] = useState<Status>('idle');
  const [profileError, setProfileError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwStatus, setPwStatus] = useState<Status>('idle');
  const [pwError, setPwError] = useState('');

  const profileDirty =
    name.trim() !== initialName.trim() ||
    bio.trim() !== initialBio.trim() ||
    avatarDirty;

  const displayName = name.trim() || email.split('@')[0];
  const initial = displayName[0]?.toUpperCase() ?? '?';

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileStatus('saving');
    setProfileError('');

    const body: Record<string, string> = {};
    if (name.trim() !== initialName.trim()) body.name = name.trim();
    if (bio.trim() !== initialBio.trim()) body.bio = bio.trim();
    if (avatarDirty) body.avatar = avatar ?? '';

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '保存失败');

      await refresh();
      setProfileStatus('saved');
      setAvatarDirty(false);
    } catch (err) {
      setProfileStatus('error');
      setProfileError(err instanceof Error ? err.message : '保存失败');
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwStatus('saving');
    setPwError('');

    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '修改失败');

      setCurrentPassword('');
      setNewPassword('');
      setPwStatus('saved');
    } catch (err) {
      setPwStatus('error');
      setPwError(err instanceof Error ? err.message : '修改失败');
    }
  }

  return (
    <div className="space-y-8">
      {/* 个人资料 */}
      <section className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
        <h2 className="t-title-3 mb-1.5 text-white/90">个人资料</h2>
        <p className="t-footnote mb-6 text-white/60">
          头像和昵称会显示在导航栏和你的投稿里。
        </p>

        <form onSubmit={saveProfile} className="space-y-6">
          <AvatarUpload
            currentUrl={avatar}
            fallbackInitial={initial}
            disabled={profileStatus === 'saving'}
            onUpload={(dataUrl) => {
              setAvatar(dataUrl);
              setAvatarDirty(true);
              setProfileStatus('idle');
            }}
            onRemove={() => {
              setAvatar(null);
              setAvatarDirty(true);
              setProfileStatus('idle');
            }}
          />

          <div>
            <label htmlFor="account-name" className={labelClass}>
              昵称
            </label>
            <input
              id="account-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setProfileStatus('idle');
              }}
              maxLength={30}
              placeholder={email.split('@')[0]}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="account-bio" className={labelClass}>
              个人简介 <span className="font-normal text-white/45">（{bio.length}/200）</span>
            </label>
            <textarea
              id="account-bio"
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                setProfileStatus('idle');
              }}
              maxLength={200}
              rows={3}
              placeholder="一句话介绍自己"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={!profileDirty || profileStatus === 'saving'}
              className="rounded-xl bg-white px-5 py-2.5 text-[0.9375rem] font-semibold text-black transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {profileStatus === 'saving' ? '保存中…' : '保存'}
            </button>
            {profileStatus === 'saved' && (
              <span className="t-footnote text-emerald-400" role="status">
                已保存
              </span>
            )}
            {profileStatus === 'error' && (
              <span className="t-footnote text-red-400" role="alert">
                {profileError}
              </span>
            )}
          </div>
        </form>
      </section>

      {/* 密码 */}
      <section className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
        <h2 className="t-title-3 mb-1.5 text-white/90">修改密码</h2>
        <p className="t-footnote mb-6 text-white/60">
          改完当前设备会保持登录，其他设备上的会话不受影响。
        </p>

        <form onSubmit={changePassword} className="space-y-4">
          <input type="text" name="username" autoComplete="username" value={email} readOnly hidden />

          <div>
            <label htmlFor="account-current-password" className={labelClass}>
              当前密码
            </label>
            <input
              id="account-current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setPwStatus('idle');
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="account-new-password" className={labelClass}>
              新密码 <span className="font-normal text-white/45">（至少 8 位）</span>
            </label>
            <input
              id="account-new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPwStatus('idle');
              }}
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={!currentPassword || newPassword.length < 8 || pwStatus === 'saving'}
              className="rounded-xl bg-white px-5 py-2.5 text-[0.9375rem] font-semibold text-black transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pwStatus === 'saving' ? '修改中…' : '修改密码'}
            </button>
            {pwStatus === 'saved' && (
              <span className="t-footnote text-emerald-400" role="status">
                已修改
              </span>
            )}
            {pwStatus === 'error' && (
              <span className="t-footnote text-red-400" role="alert">
                {pwError}
              </span>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
