import { PgDialect } from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultDailyPanelSettings } from '../panel-types';

interface Operation { kind: string; selection?: unknown; values?: Record<string, unknown>; where?: SQL; conflict?: { set: Record<string, unknown>; setWhere: SQL }; }
const state = vi.hoisted(() => ({ rows: [] as unknown[][], operations: [] as Operation[] }));
vi.mock('@/lib/db', () => {
  function query(kind: string, selection?: unknown) {
    const operation: Operation = { kind, selection }; state.operations.push(operation);
    const builder = {
      from() { return builder; }, where(value: SQL) { operation.where = value; return builder; }, limit() { return builder; },
      values(value: Record<string, unknown>) { operation.values = value; return builder; }, set(value: Record<string, unknown>) { operation.values = value; return builder; },
      returning() { return builder; }, onConflictDoUpdate(value: Operation['conflict']) { operation.conflict = value; return builder; },
      then(resolve: (value: unknown[]) => unknown) { return Promise.resolve(state.rows.shift() ?? []).then(resolve); },
    };
    return builder;
  }
  return { db: { select: (selection?: unknown) => query('select', selection), insert: () => query('insert'), update: () => query('update') } };
});
import { getDailyPanelPreferences, saveDailyPanelPreferences } from '../panel-service';
const revision = '2026-10-23T01:00:00.000Z';
const settings = defaultDailyPanelSettings(['english']);
beforeEach(() => { state.rows = []; state.operations = []; });

describe('账号公告面板设置', () => {
  it('读本人设置，未设置与明确空关注分别返回null和空数组', async () => {
    expect(await getDailyPanelPreferences('user-a')).toEqual({ userId: 'user-a', settings: null, revision: null, followedChannels: null });
    state.rows.push([{ channels: [], panelSettings: null, panelUpdatedAt: null }]);
    expect(await getDailyPanelPreferences('user-a')).toEqual({ userId: 'user-a', settings: null, revision: null, followedChannels: [] });
    expect(new PgDialect().sqlToQuery(state.operations[0].where!).params).toEqual(['user-a']);
  });

  it('首次保存只允许尚无面板版本的行，且不改已有日刊关注和提醒', async () => {
    state.rows.push([{ channels: [], panelSettings: settings, panelUpdatedAt: revision }]);
    expect(await saveDailyPanelPreferences('user-a', { settings, expectedRevision: null })).toEqual({ userId: 'user-a', settings, revision, followedChannels: [] });
    const operation = state.operations[0];
    expect(operation.kind).toBe('insert');
    expect(operation.values).toMatchObject({ userId: 'user-a', reminders: false, panelSettings: settings });
    expect(Object.keys(operation.conflict!.set).sort()).toEqual(['panelSettings', 'panelUpdatedAt']);
    expect(new PgDialect().sqlToQuery(operation.conflict!.setWhere).sql).toContain('"daily_preferences"."panel_updated_at" is null');
    expect(state.operations).toHaveLength(1);
  });

  it('已有版本只能更新本人匹配行，冲突不退回插入覆盖', async () => {
    expect(await saveDailyPanelPreferences('user-b', { settings, expectedRevision: revision })).toBeNull();
    expect(state.operations).toHaveLength(1);
    const operation = state.operations[0];
    expect(operation.kind).toBe('update');
    expect(new PgDialect().sqlToQuery(operation.where!).params).toEqual(['user-b', revision]);
    expect(Object.keys(operation.values!).sort()).toEqual(['panelSettings', 'panelUpdatedAt']);
    expect(new PgDialect().sqlToQuery(operation.where!).sql).toContain('"daily_preferences"."panel_updated_at" =');
  });

  it('恢复默认仍生成新版本，时间回拨或同一毫秒也不会复用旧版本', async () => {
    const future = '2099-10-23T01:00:00.000Z';
    state.rows.push([{ channels: ['english'], panelSettings: null, panelUpdatedAt: '2099-10-23T01:00:00.001Z' }]);
    const saved = await saveDailyPanelPreferences('user-a', { settings: null, expectedRevision: future });
    expect(saved).toMatchObject({ settings: null, revision: '2099-10-23T01:00:00.001Z', followedChannels: ['english'] });
    expect(state.operations[0].values).toEqual({ panelSettings: null, panelUpdatedAt: '2099-10-23T01:00:00.001Z' });
  });

  it('非法设置在写库前被拒绝', async () => {
    await expect(saveDailyPanelPreferences('user-a', { settings: { ...settings, channels: ['masters'] } as never, expectedRevision: null })).rejects.toThrow();
    expect(state.operations).toHaveLength(0);
  });
});
