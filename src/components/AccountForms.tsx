'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-[0.9375rem] text-white placeholder-white/50 transition-colors focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40 disabled:opacity-50';

const labelClass = 't-footnote mb-2 block font-medium text-white/65';

type Status = 'idle' | 'saving' | 'saved' | 'error';

interface AccountFormsProps {
  initialName: string;
  email: string;
}

export default function AccountForms({ initialName, email }: AccountFormsProps) {
  const { refresh } = useAuth();

  const [name, setName] = useState(initialName);
  const [nameStatus, setNameStatus] = useState<Status>('idle');
  const [nameError, setNameError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwStatus, setPwStatus] = useState<Status>('idle');
  const [pwError, setPwError] = useState('');

  const nameDirty = name.trim() !== initialName.trim();

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setNameStatus('saving');
    setNameError('');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '保存失败');

      // 导航栏的头像与昵称来自会话，刷新一下让它跟着变
      await refresh();
      setNameStatus('saved');
    } catch (err) {
      setNameStatus('error');
      setNameError(err instanceof Error ? err.message : '保存失败');
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
      {/* 昵称 */}
      <section className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
        <h2 className="t-title-3 mb-1.5 text-white/90">昵称</h2>
        <p className="t-footnote mb-6 text-white/60">
          显示在导航栏和评论里。留空的话会用邮箱前缀。
        </p>

        <form onSubmit={saveName} className="space-y-4">
          <div>
            <label htmlFor="account-name" className={labelClass}>
              昵称
            </label>
            <input
              id="account-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameStatus('idle');
              }}
              maxLength={30}
              placeholder={email.split('@')[0]}
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={!nameDirty || nameStatus === 'saving'}
              className="rounded-xl bg-white px-5 py-2.5 text-[0.9375rem] font-semibold text-black transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {nameStatus === 'saving' ? '保存中…' : '保存'}
            </button>
            {nameStatus === 'saved' && (
              <span className="t-footnote text-emerald-400" role="status">
                已保存
              </span>
            )}
            {nameStatus === 'error' && (
              <span className="t-footnote text-red-400" role="alert">
                {nameError}
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
          {/* 给密码管理器一个可读的账号上下文 */}
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
