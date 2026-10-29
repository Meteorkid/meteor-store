import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MastersRound, MastersRoundInput } from '@/lib/masters/types';

const state = vi.hoisted(() => ({ db: undefined as NodePgDatabase | undefined }));
vi.mock('@/lib/db', () => ({
  db: new Proxy({}, {
    get(_target, key) {
      if (!state.db) throw new Error('测试数据库尚未连接');
      const value = Reflect.get(state.db, key);
      return typeof value === 'function' ? value.bind(state.db) : value;
    },
  }),
}));

import { createAdmissionsService } from '../service';

const databaseUrl = process.env.ADMISSIONS_TEST_DATABASE_URL;
describe.skipIf(!databaseUrl)('硕博同ID隔离（真实 PostgreSQL 临时表）', () => {
  let client: Client;
  const masters = createAdmissionsService('masters', []);
  const phd = createAdmissionsService('phd', []);

  beforeAll(async () => {
    const url = new URL(databaseUrl!);
    if (!['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) || !url.pathname.endsWith('_test')) {
      throw new Error('ADMISSIONS_TEST_DATABASE_URL 必须指向本地且名称以 _test 结尾的测试库');
    }
    client = new Client({ connectionString: databaseUrl });
    await client.connect();
    state.db = drizzle(client);
    // 只建立本连接的临时表，不修改测试库中已存在的公开表。
    for (const migration of ['0047_wide_thunderbolts.sql', '0053_phd_application_calendar.sql']) {
      const ddl = readFileSync(join(process.cwd(), 'drizzle', migration), 'utf8');
      await client.query(ddl.replaceAll('CREATE TABLE ', 'CREATE TEMP TABLE '));
    }
    await client.query('ALTER TABLE pg_temp.masters_rounds ADD COLUMN automation_paused boolean DEFAULT false NOT NULL');
  });

  beforeEach(async () => {
    await client.query('TRUNCATE pg_temp.masters_rounds, pg_temp.masters_watches, pg_temp.masters_notices, pg_temp.phd_rounds, pg_temp.phd_watches, pg_temp.phd_notices');
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2027-01-01T01:30:00.000Z'));
  });
  afterEach(() => vi.useRealTimers());
  afterAll(async () => { await client?.end(); });

  function input(studyType: 'taught' | 'research'): MastersRoundInput {
    return {
      id: 'shared-round-id', intakeYear: 2027, region: 'singapore', status: 'published', verifiedOn: '2026-10-29',
      details: {
        university: 'Example University', programme: 'Computer Science', subject: '计算机科学',
        studyType, studyMode: '全日制', intakeLabel: '2027年8月', applicantGroup: '国际申请者',
        roundName: '主轮', eventType: 'application', opensOn: '2026-10-01', openingNote: '官方开放日期', openingState: 'scheduled',
        deadlineStatus: 'confirmed', deadlineOn: '2027-01-31', deadlineAt: null, deadlineTimeZone: null,
        deadlineText: '31 January 2027', rolling: false, mayCloseEarly: false,
        officialUrl: 'https://example.edu/admissions', sourceNote: '项目国际申请者截止，仅公布日期。',
      },
    };
  }
  async function saveBoth() {
    const master = await masters.saveRound(input('taught'));
    const doctor = await phd.saveRound(input('research'));
    expect(master).not.toBeNull();
    expect(doctor).not.toBeNull();
    return { master: master!, doctor: doctor! };
  }
  function updateInput(round: MastersRound): MastersRoundInput {
    return { ...input(round.details.studyType), details: round.details, expectedUpdatedAt: round.updatedAt };
  }

  it('相同主键和业务身份可以并存，列表与按ID读取都只返回自己的学位记录', async () => {
    await saveBoth();
    expect((await masters.listRounds(2027)).map(round => round.details.studyType)).toEqual(['taught']);
    expect((await phd.listRounds(2027)).map(round => round.details.studyType)).toEqual(['research']);
    expect((await masters.getRoundsByIds(['shared-round-id']))[0].details.studyType).toBe('taught');
    expect((await phd.getRoundsByIds(['shared-round-id']))[0].details.studyType).toBe('research');
  });

  it('同账号和同轮次提醒独立幂等，博士已读和取消关注不修改硕士数据', async () => {
    await saveBoth();
    const watch = { roundId: 'shared-round-id', status: 'preparing' as const, reminders: true };
    await masters.saveWatch('owner', watch);
    await phd.saveWatch('owner', watch);
    const [masterNotice] = await masters.getNotices('owner');
    const [phdNotice] = await phd.getNotices('owner');
    expect(masterNotice.id).toBe(phdNotice.id);
    expect(await phd.syncNotices()).toEqual({ created: 0 });
    await phd.markNoticesRead('other-owner', [phdNotice.id]);
    expect((await phd.getNotices('owner'))[0].readAt).toBeNull();
    await phd.markNoticesRead('owner', [phdNotice.id]);
    expect((await phd.getNotices('owner'))[0].readAt).not.toBeNull();
    expect((await masters.getNotices('owner'))[0].readAt).toBeNull();
    await phd.removeWatch('owner', watch.roundId);
    expect(await phd.getWatches('owner')).toEqual([]);
    expect(await phd.getNotices('owner')).toEqual([]);
    expect(await masters.getWatches('owner')).toHaveLength(1);
    expect(await masters.getNotices('owner')).toHaveLength(1);
  });

  it('博士改期只推进自己的日期版本，过期CAS与跨年修改均不覆盖记录', async () => {
    const { master, doctor } = await saveBoth();
    const watch = { roundId: doctor.id, status: 'preparing' as const, reminders: true };
    await masters.saveWatch('owner', watch);
    await phd.saveWatch('owner', watch);
    const revised = await phd.saveRound({ ...updateInput(doctor), details: { ...doctor.details, deadlineOn: '2027-01-15' } });
    expect(revised).toMatchObject({ dateVersion: 2, revision: 2 });
    expect((await masters.getRoundsByIds([master.id]))[0]).toMatchObject({ dateVersion: 1, updatedAt: master.updatedAt });
    expect((await phd.getNotices('owner')).map(notice => notice.kind).sort()).toEqual(['changed', 'deadline']);
    expect(await masters.getNotices('owner')).toHaveLength(1);
    expect(await phd.saveRound(updateInput(doctor))).toBeNull();
    expect(await phd.saveRound({ ...updateInput(revised!), intakeYear: 2028 })).toBeNull();
  });

  it('博士下架不能下架硕士同ID，数据库约束同时阻止授课型和缺少studyType的数据', async () => {
    const { master, doctor } = await saveBoth();
    expect(await phd.unpublishRound(doctor.id, doctor.updatedAt)).toBe(true);
    expect(await phd.listRounds(2027)).toEqual([]);
    expect(await masters.getRoundsByIds([master.id])).toHaveLength(1);
    await expect(client.query("UPDATE pg_temp.phd_rounds SET details = jsonb_set(details, '{studyType}', '\"taught\"') WHERE id = $1", [doctor.id]))
      .rejects.toMatchObject({ code: '23514', constraint: 'phd_rounds_study_type_check' });
    await expect(client.query("UPDATE pg_temp.phd_rounds SET details = details - 'studyType' WHERE id = $1", [doctor.id]))
      .rejects.toMatchObject({ code: '23514', constraint: 'phd_rounds_study_type_check' });
  });
});
