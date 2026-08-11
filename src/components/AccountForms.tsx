'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
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
  const t = useTranslations('AccountPage');
  const { refresh } = useAuth();
  const router = useRouter();

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

  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailStatus, setEmailStatus] = useState<Status>('idle');
  const [emailError, setEmailError] = useState('');

  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteStatus, setDeleteStatus] = useState<Status>('idle');
  const [deleteError, setDeleteError] = useState('');

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
      if (!res.ok) throw new Error(data.error || t('saveFailed'));

      await refresh();
      setProfileStatus('saved');
      setAvatarDirty(false);
    } catch (err) {
      setProfileStatus('error');
      setProfileError(err instanceof Error ? err.message : t('saveFailed'));
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
      if (!res.ok) throw new Error(data.error || t('changeFailed'));

      setCurrentPassword('');
      setNewPassword('');
      setPwStatus('saved');
    } catch (err) {
      setPwStatus('error');
      setPwError(err instanceof Error ? err.message : t('changeFailed'));
    }
  }

  async function changeEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailStatus('saving');
    setEmailError('');

    try {
      const res = await fetch('/api/auth/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail: newEmail.trim(), password: emailPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('changeFailed'));

      setNewEmail('');
      setEmailPassword('');
      setEmailStatus('saved');
      await refresh();
    } catch (err) {
      setEmailStatus('error');
      setEmailError(err instanceof Error ? err.message : t('changeFailed'));
    }
  }

  async function deleteAccount(e: React.FormEvent) {
    e.preventDefault();
    setDeleteStatus('saving');
    setDeleteError('');

    try {
      const res = await fetch('/api/auth/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: deletePassword,
          confirmation: deleteConfirmation,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('deleteFailed'));

      await refresh();
      router.replace('/');
      router.refresh();
    } catch (err) {
      setDeleteStatus('error');
      setDeleteError(err instanceof Error ? err.message : t('deleteFailed'));
    }
  }

  return (
    <div className="space-y-8">
      {/* 个人资料 */}
      <section className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
        <h2 className="t-title-3 mb-1.5 text-white/90">{t('profile')}</h2>
        <p className="t-footnote mb-6 text-white/60">
          {t('profileHint')}
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
              {t('nameLabel')}
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
              {t('bioLabel')} <span className="font-normal text-white/45">（{bio.length}/200）</span>
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
              placeholder={t('bioPlaceholder')}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={!profileDirty || profileStatus === 'saving'}
              className="rounded-xl bg-white px-5 py-2.5 text-[0.9375rem] font-semibold text-black transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {profileStatus === 'saving' ? t('saving') : t('saveButton')}
            </button>
            {profileStatus === 'saved' && (
              <span className="t-footnote text-emerald-400" role="status">
                {t('saved')}
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

      {/* 修改邮箱 */}
      <section className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
        <h2 className="t-title-3 mb-1.5 text-white/90">{t('changeEmail')}</h2>
        <p className="t-footnote mb-6 text-white/60">
          {t('changeEmailHint')}
        </p>

        <form onSubmit={changeEmail} className="space-y-4">
          <div>
            <label htmlFor="account-new-email" className={labelClass}>
              {t('newEmail')}
            </label>
            <input
              id="account-new-email"
              type="email"
              autoComplete="email"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                setEmailStatus('idle');
              }}
              placeholder="new@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="account-email-password" className={labelClass}>
              {t('currentPassword')}
            </label>
            <input
              id="account-email-password"
              type="password"
              autoComplete="current-password"
              value={emailPassword}
              onChange={(e) => {
                setEmailPassword(e.target.value);
                setEmailStatus('idle');
              }}
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={!newEmail || !emailPassword || emailStatus === 'saving'}
              className="rounded-xl bg-white px-5 py-2.5 text-[0.9375rem] font-semibold text-black transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {emailStatus === 'saving' ? t('changing') : t('changeEmail')}
            </button>
            {emailStatus === 'saved' && (
              <span className="t-footnote text-emerald-400" role="status">
                {t('emailChanged')}
              </span>
            )}
            {emailStatus === 'error' && (
              <span className="t-footnote text-red-400" role="alert">
                {emailError}
              </span>
            )}
          </div>
        </form>
      </section>

      {/* 密码 */}
      <section className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
        <h2 className="t-title-3 mb-1.5 text-white/90">{t('changePassword')}</h2>
        <p className="t-footnote mb-6 text-white/60">
          {t('passwordHint')}
        </p>

        <form onSubmit={changePassword} className="space-y-4">
          <input type="text" name="username" autoComplete="username" value={email} readOnly hidden />

          <div>
            <label htmlFor="account-current-password" className={labelClass}>
              {t('currentPassword')}
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
              {t('newPassword')} <span className="font-normal text-white/45">（{t('passwordMinLength')}）</span>
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
              {pwStatus === 'saving' ? t('changing') : t('changePassword')}
            </button>
            {pwStatus === 'saved' && (
              <span className="t-footnote text-emerald-400" role="status">
                {t('changed')}
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

      <section className="rounded-3xl border border-red-500/20 bg-red-500/[0.03] p-7 md:p-9">
        <h2 className="t-title-3 mb-1.5 text-red-300">{t('deleteAccount')}</h2>
        <p className="t-footnote mb-6 text-white/60">{t('deleteAccountHint')}</p>

        <form onSubmit={deleteAccount} className="space-y-4">
          <div>
            <label htmlFor="delete-password" className={labelClass}>{t('currentPassword')}</label>
            <input
              id="delete-password"
              type="password"
              autoComplete="current-password"
              value={deletePassword}
              onChange={(e) => {
                setDeletePassword(e.target.value);
                setDeleteStatus('idle');
              }}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="delete-confirmation" className={labelClass}>{t('deleteConfirmation')}</label>
            <input
              id="delete-confirmation"
              value={deleteConfirmation}
              onChange={(e) => {
                setDeleteConfirmation(e.target.value);
                setDeleteStatus('idle');
              }}
              placeholder="DELETE"
              autoComplete="off"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={!deletePassword || deleteConfirmation !== 'DELETE' || deleteStatus === 'saving'}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-[0.9375rem] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {deleteStatus === 'saving' ? t('deletingAccount') : t('deleteAccountButton')}
          </button>
          {deleteStatus === 'error' && (
            <p className="t-footnote text-red-400" role="alert">{deleteError}</p>
          )}
        </form>
      </section>
    </div>
  );
}
