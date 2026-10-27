'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface CommerceOrder {
  id: string;
  productId: string;
  planName: string;
  email: string;
  amountCny: number;
  status: string;
  deliveryStatus: string;
  alipayTradeNo: string | null;
  paidAt: string | null;
  createdAt: string;
  refundStatus?: string | null;
  outRefundNo?: string | null;
}

interface CommerceLicense {
  id: string;
  orderId: string;
  productId: string;
  planName: string;
  email: string;
  key: string;
  status: string;
  createdAt: string;
}

export default function CommerceManager({
  initialOrders,
  initialLicenses,
}: {
  initialOrders: CommerceOrder[];
  initialLicenses: CommerceLicense[];
}) {
  const t = useTranslations('AdminCommercePage');
  const [orders, setOrders] = useState(initialOrders);
  const [licenses, setLicenses] = useState(initialLicenses);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const unresolvedRefund = (status?: string | null) => Boolean(status && ['REQUESTING', 'PROCESSING', 'ABNORMAL', 'UNKNOWN', 'MANUAL_REVIEW'].includes(status));
  const paymentLabels: Record<string, string> = {
    paid: t('status_paid'),
    pending: t('status_pending'),
    failed: t('status_failed'),
    refunded: t('status_refunded'),
  };
  const deliveryLabels: Record<string, string> = {
    emailed: t('delivery_emailed'),
    processing: t('delivery_processing'),
    pending: t('delivery_pending'),
    failed: t('delivery_failed'),
  };
  const licenseLabels: Record<string, string> = {
    active: t('license_active'),
    revoked: t('license_revoked'),
  };
  const refundLabels: Record<string, string> = {
    REQUESTING: t('refund_REQUESTING'), PROCESSING: t('refund_PROCESSING'), UNKNOWN: t('refund_UNKNOWN'),
    ABNORMAL: t('refund_ABNORMAL'), SUCCESS: t('refund_SUCCESS'), CLOSED: t('refund_CLOSED'),
    REJECTED: t('refund_REJECTED'), MANUAL_REVIEW: t('refund_MANUAL_REVIEW'),
  };

  const patch = async (body: Record<string, unknown>) => {
    const response = await fetch('/api/admin/commerce', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30_000),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || t('operationFailed'));
    return data;
  };

  const retryDelivery = async (orderId: string) => {
    setBusy(`order:${orderId}`);
    setError('');
    try {
      await patch({ action: 'retry-delivery', orderId });
      setOrders((current) => current.map((order) => (
        order.id === orderId ? { ...order, deliveryStatus: 'emailed' } : order
      )));
    } catch (operationError) {
      setError(operationError instanceof Error ? operationError.message : t('operationFailed'));
    } finally {
      setBusy('');
    }
  };

  const changeLicenseStatus = async (licenseId: string, status: 'active' | 'revoked') => {
    setBusy(`license:${licenseId}`);
    setError('');
    try {
      await patch({ action: 'set-license-status', licenseId, status });
      setLicenses((current) => current.map((license) => (
        license.id === licenseId ? { ...license, status } : license
      )));
    } catch (operationError) {
      setError(operationError instanceof Error ? operationError.message : t('operationFailed'));
    } finally {
      setBusy('');
    }
  };

  const refundOrder = async (orderId: string) => {
    const current = orders.find(order => order.id === orderId);
    if (!unresolvedRefund(current?.refundStatus) && !window.confirm(t('refundConfirm'))) return;
    setBusy(`refund:${orderId}`);
    setError('');
    setNotice('');
    try {
      const result = await patch({ action: 'refund-order', orderId });
      setOrders((current) => current.map((order) => (
        order.id === orderId ? { ...order, status: result.status === 'refunded' ? 'refunded' : order.status,
          refundStatus: result.status === 'refunded' ? 'SUCCESS' : 'PROCESSING' } : order
      )));
      if (result.status === 'refunded') setLicenses(current => current.map(license => license.orderId === orderId ? { ...license, status: 'revoked' } : license));
      else setNotice(t('refundProcessingNotice'));
      const refreshed = await fetch('/api/admin/commerce', { cache: 'no-store', signal: AbortSignal.timeout(15_000) });
      if (!refreshed.ok) throw new Error(t('operationFailed'));
      const data = await refreshed.json();
      setOrders(data.orders); setLicenses(data.licenses);
      if (data.orders.some((order: CommerceOrder) => order.id === orderId && order.refundStatus === 'MANUAL_REVIEW')) setNotice(t('refundManualNotice'));
    } catch (operationError) {
      setError(operationError instanceof Error ? operationError.message : t('operationFailed'));
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="space-y-10">
      {error && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">{error}</p>
      )}
      {notice && <p role="status" className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70">{notice}</p>}

      <section>
        <h2 className="t-title-3 mb-4">{t('ordersTitle')}</h2>
        {orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/45">{t('ordersEmpty')}</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const canRetry = order.status === 'paid' && ['pending', 'failed'].includes(order.deliveryStatus);
              const refundPending = unresolvedRefund(order.refundStatus);
              const canRefund = order.status === 'paid' || refundPending;
              return (
                <article key={order.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-white/90">{order.productId} · {order.planName}</p>
                      <p className="t-footnote mt-1 truncate text-white/45">{order.email}</p>
                      <p className="t-footnote mt-1 truncate font-mono text-white/30">{order.id}</p>
                    </div>
                    <span className="font-medium text-white/80">¥{order.amountCny}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/50">
                    <span>{t('payment')}: {paymentLabels[order.status] ?? order.status}</span>
                    <span>{t('delivery')}: {deliveryLabels[order.deliveryStatus] ?? order.deliveryStatus}</span>
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                    {order.refundStatus && <span className="text-amber-200">{t('refundState')}: {refundLabels[order.refundStatus] ?? order.refundStatus}</span>}
                    {order.outRefundNo && <span className="break-all font-mono">{order.outRefundNo}</span>}
                    {canRetry && (
                      <button
                        type="button"
                        disabled={busy === `order:${order.id}`}
                        onClick={() => retryDelivery(order.id)}
                        className="ml-auto rounded-lg bg-violet-600 px-3 py-1.5 font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
                      >
                        {busy === `order:${order.id}` ? t('retrying') : t('retryDelivery')}
                      </button>
                    )}
                    {canRefund && (
                      <button
                        type="button"
                        disabled={busy === `refund:${order.id}`}
                        onClick={() => refundOrder(order.id)}
                        className="ml-auto rounded-lg border border-red-500/30 px-3 py-1.5 font-medium text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {busy === `refund:${order.id}` ? t('refunding') : refundPending ? t('checkRefund') : t('refundOrder')}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="t-title-3 mb-4">{t('licensesTitle')}</h2>
        {licenses.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/45">{t('licensesEmpty')}</p>
        ) : (
          <div className="space-y-3">
            {licenses.map((license) => {
              const nextStatus = license.status === 'active' ? 'revoked' : 'active';
              return (
                <article key={license.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-white/90">{license.productId} · {license.planName}</p>
                      <p className="t-footnote mt-1 truncate text-white/45">{license.email}</p>
                      <p className="t-footnote mt-1 truncate font-mono text-emerald-400/70 select-all">{license.key}</p>
                    </div>
                    <span className={license.status === 'active' ? 'text-emerald-400' : 'text-red-400'}>
                      {licenseLabels[license.status] ?? license.status}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={busy === `license:${license.id}`}
                      onClick={() => changeLicenseStatus(license.id, nextStatus)}
                      className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/[0.06] disabled:opacity-50"
                    >
                      {busy === `license:${license.id}`
                        ? t('updating')
                        : nextStatus === 'active' ? t('activate') : t('revoke')}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
