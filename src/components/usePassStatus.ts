'use client';

import { useEffect, useState } from 'react';
import type { PassPlanId } from '@/data/pass';
import { useAuth } from './AuthProvider';

export interface PassStatus {
  hasPass: boolean;
  currentPlan: PassPlanId | null;
  expiresAt: string | null;
}

type PassState = {
  ownerId: string;
  status: PassStatus | null;
  error: 'failed' | 'changed' | null;
};

/** 会员状态只属于发起查询的账号；读取失败不能等同于未购买。 */
export function usePassStatus() {
  const { user, loading: authLoading } = useAuth();
  const ownerId = user?.id ?? null;
  const [state, setState] = useState<PassState | null>(null);
  const [attempt, setAttempt] = useState(0);
  const current = state?.ownerId === ownerId ? state : null;
  if (state && state.ownerId !== ownerId) setState(null);

  useEffect(() => {
    if (authLoading || !ownerId) return;
    const requestOwner = ownerId;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      setState({ ownerId: requestOwner, status: null, error: 'failed' });
    }, 15_000);
    async function readStatus() {
      try {
        const response = await fetch('/api/pass/status', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error('Pass status unavailable');
        const data = await response.json();
        if (controller.signal.aborted) return;
        if (data?.userId !== requestOwner) {
          setState({ ownerId: requestOwner, status: null, error: 'changed' });
          return;
        }
        const validPlan = ['monthly', 'annual', 'lifetime'].includes(data.currentPlan);
        if (typeof data.hasPass !== 'boolean'
            || (data.hasPass ? !validPlan : data.currentPlan !== null)
            || (data.expiresAt !== null && (typeof data.expiresAt !== 'string' || !Number.isFinite(Date.parse(data.expiresAt))))) {
          throw new Error('Invalid Pass status');
        }
        setState({ ownerId: requestOwner, status: { hasPass: data.hasPass, currentPlan: data.currentPlan, expiresAt: data.expiresAt }, error: null });
      } catch {
        if (!controller.signal.aborted) setState({ ownerId: requestOwner, status: null, error: 'failed' });
      } finally {
        clearTimeout(timeout);
      }
    }
    void readStatus();
    return () => { controller.abort(); clearTimeout(timeout); };
  }, [authLoading, ownerId, attempt]);

  const error = user && !ownerId ? 'changed' : current?.error ?? null;
  const loading = authLoading || Boolean(ownerId && !current);
  const retry = () => {
    if (error === 'changed') { window.location.reload(); return; }
    setState(null);
    setAttempt(value => value + 1);
  };
  return { status: !authLoading && ownerId ? current?.status ?? null : null, loading, error, retry };
}
