'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from '@/i18n/navigation';

type ActionError = 'login' | 'changed' | 'failed' | null;

/** 收藏、关注和提醒共用身份边界；仅用户点击时写入，不逐卡拉取状态。 */
export function usePathfinderToggle({
  initialOwnerId, initialValue, targetKey, endpoint, responseField, payload,
}: {
  initialOwnerId: string | null;
  initialValue: boolean;
  targetKey: string;
  endpoint: 'saves' | 'follows';
  responseField: 'saved' | 'following' | 'remindDeadline';
  payload: (next: boolean) => Record<string, unknown>;
}) {
  const { user, loading, refresh } = useAuth();
  const router = useRouter();
  const ownerId = loading ? null : user?.id ?? null;
  const key = JSON.stringify([ownerId, initialOwnerId, targetKey, initialValue]);
  const initialState = {
    key, value: Boolean(ownerId && ownerId === initialOwnerId && initialValue), pending: false,
    error: ownerId && ownerId !== initialOwnerId ? 'changed' as const : null as ActionError,
  };
  const [state, setState] = useState(initialState);
  const request = useRef<AbortController | null>(null);
  if (state.key !== key) setState(initialState);

  useEffect(() => () => {
    request.current?.abort();
    request.current = null;
  }, [key]);

  const toggle = async () => {
    if (loading || state.pending || request.current) return;
    if (!ownerId || state.error === 'login') {
      setState(current => ({ ...current, value: false, error: 'login' }));
      return;
    }
    if (ownerId !== initialOwnerId || state.error === 'changed') return;
    const controller = new AbortController();
    request.current = controller;
    const previous = state.value;
    const update = (change: Partial<typeof state>) => {
      if (!controller.signal.aborted) setState(current => current.key === key ? { ...current, ...change } : current);
    };
    update({ value: !previous, pending: true, error: null });
    try {
      const response = await fetch(`/api/pathfinder/${endpoint}`, {
        method: 'POST', signal: controller.signal,
        headers: { 'Content-Type': 'application/json', 'X-Pathfinder-User': ownerId },
        body: JSON.stringify(payload(!previous)),
      });
      if (response.status === 401 || response.status === 409) {
        update({ value: false, error: response.status === 401 ? 'login' : 'changed' });
        return;
      }
      if (!response.ok) throw new Error('Pathfinder action failed');
      const data = await response.json();
      if (typeof data?.[responseField] !== 'boolean') throw new Error('Invalid action response');
      update({ value: data[responseField] });
    } catch {
      update({ value: previous, error: 'failed' });
    } finally {
      if (request.current === controller) request.current = null;
      update({ pending: false });
    }
  };

  const refreshState = async () => {
    await refresh();
    router.refresh();
  };
  return { value: state.value, disabled: loading || state.pending || state.error === 'changed', error: state.error, toggle, refreshState };
}
