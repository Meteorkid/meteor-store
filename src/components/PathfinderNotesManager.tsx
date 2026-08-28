'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * AI 动态解读的审核台。
 *
 * 流程只有一条：生成初稿 → 人读一遍（可改）→ 确认发布。中间没有捷径，
 * 界面上也不提供「生成并发布」这样的合并动作——把两步并成一步，
 * 人工确认就会退化成走过场。
 */

/** 一次批量生成几条。与接口侧的上限保持一致。 */
const BATCH_SIZE = 8;
/** busy 状态用的哨兵：批量生成不对应任何单个 itemId */
const BATCH_KEY = '__batch__';

interface Note {
  itemId: string;
  status: 'draft' | 'approved';
  whatHappened: string;
  whyItMatters: string;
  skills: string[];
  suggestedAction: string;
  model: string;
  promptVersion: string;
  generatedAt: string;
  editedByHuman: boolean;
  reviewerId: string | null;
  reviewedAt: string | null;
}

interface Candidate {
  id: string;
  title: string;
  organization: string;
  publishedAt: string | null;
}

export default function PathfinderNotesManager({
  zh,
  candidates,
}: {
  zh: boolean;
  /** 尚无解读的 AI 动态，由服务端算好传入 */
  candidates: Candidate[];
}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draftEdits, setDraftEdits] = useState<Record<string, Note>>({});

  const load = useCallback(() => {
    fetch('/api/admin/pathfinder/notes')
      .then((response) => response.json())
      .then((data) => {
        setNotes(Array.isArray(data.notes) ? data.notes : []);
        setEnabled(data.enabled !== false);
      })
      .catch(() => setError(zh ? '加载失败' : 'Failed to load'));
  }, [zh]);

  useEffect(load, [load]);

  const act = async (itemId: string, body: Record<string, unknown>) => {
    setBusy(itemId);
    setError(null);
    try {
      const response = await fetch('/api/admin/pathfinder/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, ...body }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? (zh ? '操作失败' : 'Action failed'));
        return false;
      }
      load();
      return true;
    } catch {
      setError(zh ? '网络异常' : 'Network error');
      return false;
    } finally {
      setBusy(null);
    }
  };

  /*
   * 批量生成一次只做几条。上限小是有意的：每条都是一次 LLM 调用，请求要在
   * 网关超时前返回；而且一次灌进太多待确认草稿，会让「人工逐条读一遍」
   * 这一步重新变成走过场——那正是这个流程要防的事。
   */
  const generateBatch = async (itemIds: string[]) => {
    setBusy(BATCH_KEY);
    setError(null);
    try {
      const response = await fetch('/api/admin/pathfinder/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate-batch', itemIds }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? (zh ? '批量生成失败' : 'Batch generation failed'));
        return;
      }
      const failed = (data.results ?? []).filter((r: { ok: boolean }) => !r.ok);
      // 部分失败要说出来，否则用户只看到「少了几条」而不知道为什么
      if (failed.length > 0) {
        setError(zh
          ? `${failed.length} 条生成失败：${failed[0].error ?? ''}`
          : `${failed.length} failed: ${failed[0].error ?? ''}`);
      }
      load();
    } catch {
      setError(zh ? '网络异常' : 'Network error');
    } finally {
      setBusy(null);
    }
  };

  const drafts = notes.filter((note) => note.status === 'draft');
  const approved = notes.filter((note) => note.status === 'approved');
  const pendingCandidates = candidates.filter(
    (candidate) => !notes.some((note) => note.itemId === candidate.id),
  );

  return (
    <section className="mt-12">
      <h2 className="t-title-3">{zh ? 'AI 动态解读' : 'Editorial notes'}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
        {zh
          ? '由 DeepSeek 依据条目自身的来源材料起草，必须逐条人工确认后才会出现在详情页。生成会产生 API 费用。'
          : 'Drafted by DeepSeek from each item’s own source material. Nothing reaches the public page until a human approves it. Generation incurs API cost.'}
      </p>

      {!enabled && (
        <p className="mt-4 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {zh
            ? '服务器未配置 DEEPSEEK_API_KEY，生成功能不可用；已有解读仍可审核与发布。'
            : 'DEEPSEEK_API_KEY is not configured; generation is unavailable. Existing notes can still be reviewed.'}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h3 className="t-title-4">{zh ? `待生成（${pendingCandidates.length}）` : `Needs a draft (${pendingCandidates.length})`}</h3>
        {pendingCandidates.length > 1 && (
          <button
            type="button"
            disabled={!enabled || busy !== null}
            onClick={() => generateBatch(pendingCandidates.slice(0, BATCH_SIZE).map((c) => c.id))}
            className="rounded-lg border border-violet-400/25 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-100 disabled:opacity-50"
          >
            {busy === BATCH_KEY
              ? (zh ? '生成中…' : 'Generating…')
              : (zh ? `批量生成前 ${Math.min(BATCH_SIZE, pendingCandidates.length)} 条` : `Draft first ${Math.min(BATCH_SIZE, pendingCandidates.length)}`)}
          </button>
        )}
      </div>
      <ul className="mt-3 divide-y divide-white/[0.07]">
        {pendingCandidates.slice(0, 20).map((candidate) => (
          <li key={candidate.id} className="flex flex-wrap items-center gap-3 py-3">
            <span className="min-w-0 flex-1 text-sm text-white/80">{candidate.title}</span>
            <span className="t-footnote text-white/60">{candidate.organization}</span>
            <button
              type="button"
              disabled={!enabled || busy === candidate.id}
              onClick={() => act(candidate.id, { action: 'generate' })}
              className="rounded-lg border border-violet-400/25 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-100 disabled:opacity-50"
            >
              {busy === candidate.id ? (zh ? '生成中…' : 'Generating…') : (zh ? '生成初稿' : 'Draft')}
            </button>
          </li>
        ))}
        {pendingCandidates.length === 0 && (
          <li className="py-3 text-sm text-white/60">{zh ? '全部 AI 动态都已有解读。' : 'Every AI update already has a note.'}</li>
        )}
      </ul>

      <h3 className="mt-10 t-title-4">{zh ? `待确认（${drafts.length}）` : `Awaiting review (${drafts.length})`}</h3>
      <div className="mt-3 space-y-5">
        {drafts.map((note) => {
          const edited = draftEdits[note.itemId] ?? note;
          const field = (key: keyof Note, label: string, rows = 2) => (
            <label className="block">
              <span className="t-footnote text-white/60">{label}</span>
              <textarea
                rows={rows}
                value={String(edited[key])}
                onChange={(event) => setDraftEdits((prev) => ({
                  ...prev,
                  [note.itemId]: { ...edited, [key]: event.target.value },
                }))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-violet-400/60"
              />
            </label>
          );

          return (
            <article key={note.itemId} className="rounded-2xl border border-white/10 p-5">
              <div className="flex flex-wrap items-center gap-3 t-footnote text-white/60">
                <a href={`/zh/pathfinder/items/${note.itemId}`} className="text-violet-200 hover:underline">
                  {note.itemId}
                </a>
                <span>{note.model}</span>
                <span>{note.promptVersion}</span>
                <span>{note.generatedAt.slice(0, 16).replace('T', ' ')}</span>
              </div>

              <div className="mt-4 space-y-3">
                {field('whatHappened', zh ? '发生了什么' : 'What happened')}
                {field('whyItMatters', zh ? '为什么值得关注' : 'Why it matters')}
                {field('suggestedAction', zh ? '建议做什么' : 'What to do')}
                <p className="t-footnote text-white/60">
                  {zh ? '技能：' : 'Skills: '}{note.skills.join('、') || '—'}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy === note.itemId}
                  onClick={async () => {
                    // 改过就先存，避免「改完直接点确认」把编辑丢掉
                    if (draftEdits[note.itemId]) {
                      const saved = await act(note.itemId, {
                        action: 'edit',
                        note: {
                          whatHappened: edited.whatHappened,
                          whyItMatters: edited.whyItMatters,
                          skills: edited.skills,
                          suggestedAction: edited.suggestedAction,
                        },
                      });
                      if (!saved) return;
                    }
                    await act(note.itemId, { action: 'approve' });
                    setDraftEdits((prev) => {
                      const next = { ...prev };
                      delete next[note.itemId];
                      return next;
                    });
                  }}
                  className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {zh ? '确认并发布' : 'Approve & publish'}
                </button>
                <button
                  type="button"
                  disabled={!enabled || busy === note.itemId}
                  onClick={() => act(note.itemId, { action: 'generate' })}
                  className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 disabled:opacity-50"
                >
                  {zh ? '重新生成' : 'Regenerate'}
                </button>
                <button
                  type="button"
                  disabled={busy === note.itemId}
                  onClick={() => act(note.itemId, { action: 'delete' })}
                  className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-white/60 disabled:opacity-50"
                >
                  {zh ? '丢弃' : 'Discard'}
                </button>
              </div>
            </article>
          );
        })}
        {drafts.length === 0 && <p className="text-sm text-white/60">{zh ? '没有待确认的解读。' : 'No drafts awaiting review.'}</p>}
      </div>

      <h3 className="mt-10 t-title-4">{zh ? `已发布（${approved.length}）` : `Published (${approved.length})`}</h3>
      <ul className="mt-3 divide-y divide-white/[0.07]">
        {approved.map((note) => (
          <li key={note.itemId} className="flex flex-wrap items-center gap-3 py-3">
            <a href={`/zh/pathfinder/items/${note.itemId}`} className="min-w-0 flex-1 text-sm text-violet-200 hover:underline">
              {note.whatHappened.slice(0, 60)}…
            </a>
            {note.editedByHuman && <span className="t-footnote text-white/60">{zh ? '已人工修改' : 'edited'}</span>}
            <button
              type="button"
              disabled={busy === note.itemId}
              onClick={() => act(note.itemId, { action: 'revert' })}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 disabled:opacity-50"
            >
              {zh ? '退回草稿' : 'Revert'}
            </button>
          </li>
        ))}
        {approved.length === 0 && <li className="py-3 text-sm text-white/60">{zh ? '还没有发布任何解读。' : 'Nothing published yet.'}</li>}
      </ul>
    </section>
  );
}
