'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';

interface User {
  id?: string;
  email: string;
  name?: string;
  avatarUrl?: string | null;
  emailVerified?: true;
  isStudent?: boolean;
  /** 只决定要不要显示后台入口；权限本身由服务端每次请求判定 */
  isAdmin?: boolean;
}

interface PendingEmailVerification {
  email: string;
  resendTicket: string;
  /** undefined 表示登录只检测到未验证，尚未触发新邮件。 */
  emailSent?: boolean;
}

interface AuthActionResult {
  error: string | null;
  verification?: PendingEmailVerification;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthActionResult>;
  register: (email: string, password: string, name?: string, captcha?: { token: string; x: number }) => Promise<AuthActionResult>;
  resendVerification: (resendTicket: string) => Promise<string | null>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('AuthProvider');
  const locale = useLocale();

  // 纯数据获取：不调用 setState，避免 useEffect 里调用含 setState 的函数触发规则
  const fetchUser = useCallback(async (): Promise<User | null> => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      return data.user ?? null;
    } catch {
      return null;
    }
  }, []);

  // 挂载时拉一次当前用户：setState 都在 .then() 异步回调里
  useEffect(() => {
    let cancelled = false;
    fetchUser().then((u) => {
      if (cancelled) return;
      setUser(u);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [fetchUser]);

  // 对外暴露的 refresh：事件处理器可以调用，setState 在 await 之后（异步）
  const refresh = useCallback(async () => {
    const u = await fetchUser();
    setUser(u);
    setLoading(false);
  }, [fetchUser]);

  const login = async (email: string, password: string): Promise<AuthActionResult> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, locale }),
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.code === 'EMAIL_UNVERIFIED' && typeof data.resendTicket === 'string') {
        return {
          error: null,
          verification: {
            email: email.trim().toLowerCase(),
            resendTicket: data.resendTicket,
          },
        };
      }
      return { error: data.error || t('loginFailed') };
    }
    setUser(data.user);
    return { error: null };
  };

  const register = async (email: string, password: string, name?: string, captcha?: { token: string; x: number }): Promise<AuthActionResult> => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        name,
        locale,
        ...(captcha && { captchaToken: captcha.token, captchaX: captcha.x }),
      }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || t('registerFailed') };
    if (data.verificationRequired && typeof data.resendTicket === 'string') {
      return {
        error: null,
        verification: {
          email: email.trim().toLowerCase(),
          resendTicket: data.resendTicket,
          emailSent: data.emailSent === true,
        },
      };
    }
    return { error: t('registerFailed') };
  };

  const resendVerification = async (resendTicket: string): Promise<string | null> => {
    const res = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resendTicket }),
    });
    const data = await res.json();
    return res.ok ? null : data.error || t('registerFailed');
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  return (
    <AuthContext value={{ user, loading, login, register, resendVerification, logout, refresh }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
