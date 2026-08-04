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

  const patch = async (body: Record<string, unknown>) => {
    const response = await fetch('/api/admin/commerce', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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

  return (
    <div className="space-y-10">
      {error && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">{error}</p>
      )}

      <section>
        <h2 className="t-title-3 mb-4">{t('ordersTitle')}</h2>
        {orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/45">{t('ordersEmpty')}</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const canRetry = order.status === 'paid' && ['pending', 'failed'].includes(order.deliveryStatus);
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
