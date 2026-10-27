'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { useAuth } from './AuthProvider';
import SoftwareLicenseList from './SoftwareLicenseList';
import type { SoftwareLicenseCodeView, SoftwareLicenseDeviceView, SoftwareLicenseKind } from '@/lib/software-licenses/types';

type LicenseData = { ownerId: string; email: string; licenses: SoftwareLicenseCodeView[]; devices: SoftwareLicenseDeviceView[] };
const controlClass = 'rounded-lg border border-white/20 bg-black px-3 py-2 text-sm text-white focus-visible:outline-2 focus-visible:outline-violet-300';
// 请求结果未知时保留幂等键；关闭账号面板再打开，不会把重试变成另一笔赠送。
const pendingGiftRequests = new Map<string, string>();

export default function SoftwareLicensePanel({ ownerId, locale, admin = false, recipient }: {
  ownerId: string;
  locale: string;
  admin?: boolean;
  recipient?: { userId: string; email: string; emailVerified: boolean };
}) {
  const en = locale === 'en';
  const { user, loading } = useAuth();
  const currentOwner = !loading && user?.id === ownerId && user.emailVerified ? ownerId : null;
  const [data, setData] = useState<LicenseData | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('');
  const recipientEmail = (recipient?.email ?? email).trim().toLowerCase();
  const recipientId = recipient?.userId;
  const [product, setProduct] = useState('both');
  const [kind, setKind] = useState<SoftwareLicenseKind>('monthly');
  const [memo, setMemo] = useState('');
  const generation = useRef({ value: 0 });
  const visible = data?.ownerId === currentOwner && (!admin || data.email === recipientEmail) ? data : null;

  const readLicenses = useCallback(async (recipient: string, signal?: AbortSignal) => {
    if (!currentOwner) return;
    const requestGeneration = ++generation.current.value;
    const url = admin ? `/api/admin/software-licenses?email=${encodeURIComponent(recipient)}` : '/api/software-licenses';
    const response = await fetch(url, { cache: 'no-store', signal: signal ?? AbortSignal.timeout(15_000), headers: { 'X-Software-License-User': currentOwner } });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || (en ? 'Could not load licenses.' : '授权读取失败，请重试。'));
    if (result.userId !== currentOwner || !Array.isArray(result.licenses) || !Array.isArray(result.devices)) {
      throw new Error(en ? 'Your account changed. Reload this page.' : '账号状态已变化，请刷新页面。');
    }
    if (requestGeneration === generation.current.value && !signal?.aborted) {
      setData({ ownerId: currentOwner, email: recipient, licenses: result.licenses, devices: result.devices });
      setError('');
      return true;
    }
    return false;
  }, [admin, currentOwner, en]);

  useEffect(() => {
    const controller = new AbortController();
    const requests = generation.current;
    if (currentOwner && (!admin || recipientId)) {
      let timedOut = false;
      const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 15_000);
      readLicenses(admin ? recipientEmail : '', controller.signal).catch(() => {
        if (!controller.signal.aborted || timedOut) setError(en ? 'Could not load licenses. Try again.' : '授权读取失败，请重试。');
      }).finally(() => clearTimeout(timeout));
      return () => { requests.value++; timedOut = false; controller.abort(); clearTimeout(timeout); };
    }
    return () => { requests.value++; controller.abort(); };
  }, [admin, currentOwner, en, readLicenses, recipientEmail, recipientId]);

  async function reload(event?: FormEvent) {
    event?.preventDefault();
    if (!currentOwner || busy) return;
    setBusy(true);
    try { await readLicenses(recipientEmail); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Request failed'); }
    finally { setBusy(false); }
  }

  async function grant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentOwner || busy) return;
    const fields = { email: recipientEmail, ...(recipientId ? { recipientUserId: recipientId } : {}), productIds: product === 'both' ? ['xnook', 'xisland'] : [product], kind, memo: memo.trim() };
    const signature = JSON.stringify([currentOwner, fields]);
    const requestId = pendingGiftRequests.get(signature) ?? crypto.randomUUID();
    pendingGiftRequests.set(signature, requestId);
    const activeGeneration = generation.current.value;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/software-licenses', {
        signal: AbortSignal.timeout(30_000),
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Software-License-User': currentOwner },
        body: JSON.stringify({ ...fields, requestId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || (en ? 'Could not issue licenses.' : '赠送失败，请重试。'));
      if (generation.current.value !== activeGeneration) return;
      // 保留幂等键直到本次结果读取成功，网络失败后的重试不会重复赠送。
      if (await readLicenses(recipientEmail)) pendingGiftRequests.delete(signature);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Request failed'); }
    finally { setBusy(false); }
  }

  async function revoke(id: string) {
    if (!currentOwner || busy || !visible) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(admin ? '/api/admin/software-licenses' : '/api/software-licenses', {
        signal: AbortSignal.timeout(30_000),
        method: 'PATCH', headers: { 'Content-Type': 'application/json', 'X-Software-License-User': currentOwner },
        body: JSON.stringify({ action: 'revoke-device', id, ...(admin ? { email: visible.email } : {}) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || (en ? 'Could not unlink device.' : '解绑失败，请重试。'));
      await readLicenses(visible.email);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Request failed'); }
    finally { setBusy(false); }
  }

  return (
    <section id={recipientId ? `software-licenses-${recipientId}` : 'software-licenses'} className="mb-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
      <h2 className="t-title-3">{admin ? (en ? 'Gift software licenses' : '赠送软件激活码') : (en ? 'Software licenses & devices' : '软件激活码与设备')}</h2>
      <p className="mt-2 mb-5 text-sm leading-relaxed text-white/70">
        {en ? 'XNook and XIsland · Up to 3 devices per product. Renewals keep the same device slots. Unlinked offline devices stop working when their current offline permit expires (up to 7 days).'
          : 'XNook 与 XIsland：每款软件最多同时激活 3 台设备，续费沿用设备名额。解绑后，离线设备将在当前离线许可到期时停止使用，最长 7 天。'}
      </p>
      {!currentOwner ? <p className="text-sm text-white/70">{en ? 'Sign in with a verified email to view licenses.' : '请使用已验证邮箱的账号登录后查看授权。'}</p> : <>
        {admin && recipient && !recipient.emailVerified && <p className="mb-4 text-sm text-amber-200">{en ? 'This account has not verified its email. The recipient must verify it before viewing codes in their account.' : '此账号尚未验证邮箱，接收人验证邮箱后才能在账户页查看激活码。'}</p>}
        {admin && <form onSubmit={grant} className="mb-6 grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-white/80">{en ? 'Recipient email' : '接收邮箱'}
            <input required type="email" maxLength={254} readOnly={!!recipient} value={recipient?.email ?? email} onChange={event => setEmail(event.target.value)} className={`${controlClass} mt-1 w-full`} />
          </label>
          <label className="text-sm text-white/80">{en ? 'Software' : '软件'}
            <select value={product} onChange={event => setProduct(event.target.value)} className={`${controlClass} mt-1 w-full`}>
              <option value="both">XNook + XIsland</option><option value="xnook">XNook</option><option value="xisland">XIsland</option>
            </select>
          </label>
          <label className="text-sm text-white/80">{en ? 'Duration' : '授权期限'}
            <select value={kind} onChange={event => setKind(event.target.value as SoftwareLicenseKind)} className={`${controlClass} mt-1 w-full`}>
              <option value="monthly">{en ? '1 month' : '一个月'}</option><option value="annual">{en ? '1 year' : '一年'}</option><option value="lifetime">{en ? 'Lifetime' : '永久'}</option>
            </select>
          </label>
          <label className="text-sm text-white/80">{en ? 'Reason (optional)' : '赠送原因（可选）'}
            <input maxLength={500} value={memo} onChange={event => setMemo(event.target.value)} className={`${controlClass} mt-1 w-full`} />
          </label>
          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <button type="submit" disabled={busy} className={`${controlClass} bg-violet-600 disabled:opacity-50`}>{en ? 'Issue gift codes' : '赠送激活码'}</button>
            <button type="button" disabled={busy || !recipientEmail} onClick={() => reload()} className={controlClass}>{en ? 'View recipient licenses' : '查看此邮箱的授权'}</button>
          </div>
        </form>}
        {!admin && <button type="button" disabled={busy} onClick={() => reload()} className={`${controlClass} mb-4`}>{en ? 'Refresh licenses' : '刷新授权'}</button>}
        {error && <p role="alert" className="mb-4 text-sm text-red-300">{error}</p>}
        {visible && <>
          {admin && <p className="mb-3 text-sm text-white/70">{visible.email}</p>}
          <SoftwareLicenseList licenses={visible.licenses} locale={locale} />
          {!visible.licenses.length && <p className="text-sm text-white/70">{en ? 'No software licenses yet.' : '暂无软件激活码。'}</p>}
          <h3 className="mt-6 mb-3 font-medium">{en ? 'Activated devices' : '已激活设备'}</h3>
          <ul className="space-y-3">{visible.devices.filter(device => device.status === 'active').map(device => (
            <li key={device.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 p-4">
              <div><p>{device.productName} · {device.deviceName}</p><p className="mt-1 text-sm text-white/70">{en ? 'Last checked' : '最近验证'}：{new Date(device.lastSeenAt).toLocaleString(en ? 'en-US' : 'zh-CN')}</p></div>
              <button type="button" disabled={busy} onClick={() => revoke(device.id)} className={controlClass}>{en ? 'Unlink device' : '解绑设备'}</button>
            </li>
          ))}</ul>
        </>}
      </>}
    </section>
  );
}
