'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from './AuthProvider';

type Mode = 'login' | 'register';

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
  );
}

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { login, register, user } = useAuth();
  const router = useRouter();

  if (user) {
    return (
      <div className="w-full max-w-sm text-center">
        <span className="mb-4 inline-block text-4xl">👋</span>
        <p className="mb-2 text-lg font-semibold">已登录为 {user.name || user.email}</p>
        <p className="mb-6 text-sm text-gray-400">你可以继续浏览或前往个人中心。</p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
        >
          回到首页
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && password !== confirmPassword) {
      setError('两次密码输入不一致');
      return;
    }

    setLoading(true);

    const err = mode === 'login'
      ? await login(email, password)
      : await register(email, password, name || undefined);

    setLoading(false);

    if (err) {
      setError(err);
    } else {
      router.push('/');
    }
  };

  const inputClass = 'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-violet-500/50';

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
        <button
          type="button"
          onClick={() => { setMode('login'); setError(''); setConfirmPassword(''); }}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            mode === 'login' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
          }`}
        >
          登录
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setError(''); }}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            mode === 'register' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
          }`}
        >
          注册
        </button>
      </div>

      <h1 className="mb-2 text-2xl font-bold">
        {mode === 'login' ? '欢迎回来' : '创建账户'}
      </h1>
      <p className="mb-8 text-sm text-gray-400">
        {mode === 'login' ? '登录你的 Meteor Store 账户' : '注册后可管理订单、收藏产品'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label htmlFor="auth-name" className="mb-1.5 block text-sm font-medium text-gray-300">
              昵称 <span className="text-gray-600">(选填)</span>
            </label>
            <input
              id="auth-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="你的昵称"
              className={inputClass}
            />
          </div>
        )}

        <div>
          <label htmlFor="auth-email" className="mb-1.5 block text-sm font-medium text-gray-300">
            邮箱
          </label>
          <input
            id="auth-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="auth-password" className="mb-1.5 block text-sm font-medium text-gray-300">
            密码
          </label>
          <div className="relative">
            <input
              id="auth-password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'register' ? '至少 8 位' : '••••••••'}
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
              aria-label={showPassword ? '隐藏密码' : '显示密码'}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        {mode === 'register' && (
          <div>
            <label htmlFor="auth-confirm" className="mb-1.5 block text-sm font-medium text-gray-300">
              确认密码
            </label>
            <div className="relative">
              <input
                id="auth-confirm"
                type={showConfirm ? 'text' : 'password'}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再次输入密码"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
                aria-label={showConfirm ? '隐藏密码' : '显示密码'}
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
        >
          {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-gray-600">
        {mode === 'login' ? '还没有账户？' : '已有账户？'}
        <button
          type="button"
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setConfirmPassword(''); }}
          className="ml-1 text-violet-400 hover:text-violet-300"
        >
          {mode === 'login' ? '立即注册' : '去登录'}
        </button>
      </p>

      <div className="mt-8 border-t border-white/[0.06] pt-6">
        <p className="text-center text-xs text-gray-600">
          注册即表示同意{' '}
          <Link href="/terms" className="text-gray-400 hover:text-white">服务条款</Link>
          {' '}和{' '}
          <Link href="/privacy" className="text-gray-400 hover:text-white">隐私政策</Link>
        </p>
      </div>
    </div>
  );
}
