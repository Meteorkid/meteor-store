'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { runCancellableTask } from '@/lib/cancellable-task';
import type { Announcement } from '@/lib/announcements';

interface FormState {
  id?: string;
  titleZh: string;
  titleEn: string;
  bodyZh: string;
  bodyEn: string;
  published: boolean;
}

const EMPTY_FORM: FormState = {
  titleZh: '',
  titleEn: '',
  bodyZh: '',
  bodyEn: '',
  published: false,
};

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-violet-500/50';

export default function AnnouncementManager() {
  const t = useTranslations('AdminAnnouncementsPage');
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editing, setEditing] = useState(false);

  const fetchItems = async () => {
    const res = await fetch('/api/admin/announcements');
    if (!res.ok) throw new Error();
    const data = await res.json();
    setItems(data.announcements);
  };

  useEffect(() => {
    return runCancellableTask(
      fetch('/api/admin/announcements').then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      }),
      {
        onSuccess: (data) => setItems(data.announcements),
        onError: () => setError(t('loadFailed')),
        onSettled: () => setLoading(false),
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditing(false);
  };

  const startEdit = (a: Announcement) => {
    setForm({
      id: a.id,
      titleZh: a.titleZh ?? '',
      titleEn: a.titleEn ?? '',
      bodyZh: a.bodyZh ?? '',
      bodyEn: a.bodyEn ?? '',
      published: a.published,
    });
    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/admin/announcements', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: form.id,
          titleZh: form.titleZh.trim() || null,
          titleEn: form.titleEn.trim() || null,
          bodyZh: form.bodyZh.trim() || null,
          bodyEn: form.bodyEn.trim() || null,
          published: form.published,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(editing ? t('updateSuccess') : t('createSuccess'));
      resetForm();
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('deleteConfirm'))) return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/announcements?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(t('deleteSuccess'));
      if (form.id === id) resetForm();
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('deleteFailed'));
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="space-y-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex items-center justify-between">
          <h2 className="t-title-3">
            {editing ? t('editTitle') : t('newTitle')}
          </h2>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              {t('cancelEdit')}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-gray-400">{t('titleZh')}</label>
            <input
              type="text"
              value={form.titleZh}
              onChange={(e) => setForm({ ...form, titleZh: e.target.value })}
              placeholder={t('titlePlaceholder')}
              maxLength={120}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">{t('titleEn')}</label>
            <input
              type="text"
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              placeholder={t('titlePlaceholder')}
              maxLength={120}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-gray-400">{t('bodyZh')}</label>
            <textarea
              value={form.bodyZh}
              onChange={(e) => setForm({ ...form, bodyZh: e.target.value })}
              placeholder={t('bodyPlaceholder')}
              maxLength={2000}
              rows={4}
              className={`${inputClass} resize-y`}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">{t('bodyEn')}</label>
            <textarea
              value={form.bodyEn}
              onChange={(e) => setForm({ ...form, bodyEn: e.target.value })}
              placeholder={t('bodyPlaceholder')}
              maxLength={2000}
              rows={4}
              className={`${inputClass} resize-y`}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="h-4 w-4 rounded border-white/20 bg-white/10 accent-violet-500"
          />
          {t('publishLabel')}
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && <p className="text-sm text-emerald-400">{success}</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
        >
          {saving ? t('saving') : editing ? t('update') : t('create')}
        </button>
      </form>

      <div>
        <h2 className="t-title-3 mb-4">{t('listTitle')}</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
          </div>
        ) : items.length === 0 ? (
          <p className="t-footnote py-8 text-center text-white/60">{t('empty')}</p>
        ) : (
          <div className="space-y-3">
            {items.map((a) => (
              <div
                key={a.id}
                className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {a.titleZh || a.titleEn || t('untitled')}
                    </p>
                    <p className="t-footnote mt-0.5 text-white/60">
                      {a.published ? (
                        <span className="text-emerald-400">{t('statusPublished')}</span>
                      ) : (
                        <span className="text-gray-400">{t('statusDraft')}</span>
                      )}
                      {' · '}
                      {new Date(a.publishedAt ?? a.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(a)}
                      className="rounded-lg border border-white/10 px-3 py-1 text-xs text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      {t('edit')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(a.id)}
                      className="rounded-lg border border-red-400/20 px-3 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      {t('delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
